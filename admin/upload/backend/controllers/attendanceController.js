const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const xlsx = require('xlsx');
const Attendance = require('../models/Attendance'); // Import Attendance model
const Sms = require('../models/SMS'); // Import SMS model
const Student = require('../models/Student'); // Import Student model
const { sendSms } = require('../services/smsService'); // Import SMS sending service

// Function to convert XLSX to CSV
const convertXlsxToCsv = (xlsxFilePath, csvFilePath) => {
    const workbook = xlsx.readFile(xlsxFilePath);
    const sheetName = workbook.SheetNames[0]; // Assuming first sheet
    const sheet = workbook.Sheets[sheetName];
    const csvData = xlsx.utils.sheet_to_csv(sheet);
    fs.writeFileSync(csvFilePath, csvData);
};

// Controller to handle attendance file upload
const uploadAttendanceFile = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded.' });
    }

    console.log('File uploaded:', req.file);
    const filePath = req.file.path;
    let csvFilePath = filePath;

    // Convert XLSX to CSV if necessary
    if (req.file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        req.file.mimetype === 'application/vnd.ms-excel') {
        csvFilePath = filePath.replace(/\.xlsx$/, '.csv');
        convertXlsxToCsv(filePath, csvFilePath);
    }

    // Array to store parsed attendance data
    const attendanceData = [];

    try {
        await new Promise((resolve, reject) => {
            fs.createReadStream(csvFilePath)
                .pipe(csv({ headers: ['studentRegNo', 'date', 'status'], skipLines: 1 }))
                .on('data', (row) => {
                    try {
                        const regNo = parseInt(row.studentRegNo?.trim(), 10);
                        if (!isNaN(regNo) && row.date && row.status) {
                            attendanceData.push({
                                studentRegNo: regNo,
                                date: row.date.trim(),
                                status: row.status.trim(),
                            });
                        } else {
                            console.warn('Skipping invalid row:', row);
                        }
                    } catch (error) {
                        console.warn('Error parsing row:', row, error);
                    }
                })
                .on('end', resolve)
                .on('error', reject);
        });

        console.log('Parsed CSV data:', attendanceData);

        // Insert attendance data into MongoDB
        const result = await Attendance.insertMany(attendanceData);
        console.log('Data saved to MongoDB:', result);

        // Process absentees and send SMS notifications
        const absenteeRecords = attendanceData.filter((data) => data.status.toLowerCase() === 'absent');

        for (let absentee of absenteeRecords) {
            // Fetch student details (including parent's phone) from Student collection
            const student = await Student.findOne({ regNo: absentee.studentRegNo });

            if (student) {
                const smsRecord = new Sms({
                    regNo: absentee.studentRegNo,
                    date: absentee.date,
                    parentPhone: student.parentPhone, // Get parent phone from student collection
                    status: 'Absent',
                });
                await smsRecord.save();

                // Send SMS notification for absentee
                const smsData = {
                    parentPhone: student.parentPhone,
                    message: `Your child ${student.name} with registration number ${absentee.studentRegNo} was absent on ${absentee.date}.`,
                };

                await sendSms(smsData); // Send the SMS using Twilio or your SMS provider

                // Update flag after SMS is sent
                await Sms.updateOne(
                    { regNo: absentee.studentRegNo, date: absentee.date, flag: 0 },
                    { $set: { flag: 1 } }
                );
            } else {
                console.log(`Student with regNo ${absentee.studentRegNo} not found.`);
            }
        }

        res.status(200).json({ message: 'Data uploaded, SMS notifications sent for absentees.' });
    } catch (error) {
        console.error('Error processing file or saving to MongoDB:', error);
        res.status(500).json({ message: 'Failed to process file or save data', error: error.message });
    } finally {
        // Cleanup temporary files
        if (filePath !== csvFilePath) {
            fs.unlinkSync(csvFilePath);
        }
        fs.unlinkSync(filePath);
    }
};

module.exports = { uploadAttendanceFile };