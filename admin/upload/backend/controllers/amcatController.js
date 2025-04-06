// controllers/amcatController.js
const fs = require('fs');
const xlsx = require('xlsx');
const csv = require('csv-parser');
const Amcat = require('../models/Amcat'); // Import the AMCAT model

// Function to convert XLSX to CSV
const convertXlsxToCsv = (xlsxFilePath, csvFilePath) => {
    const workbook = xlsx.readFile(xlsxFilePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const csvData = xlsx.utils.sheet_to_csv(sheet);
    fs.writeFileSync(csvFilePath, csvData);
};

// Controller to handle AMCAT file upload
const uploadAmcatFile = async (req, res) => {
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

    // Array to store parsed AMCAT data
    const amcatData = [];

    try {
        await new Promise((resolve, reject) => {
            fs.createReadStream(csvFilePath)
                .pipe(csv({ 
                    headers: [
                        'S.No', 'candidatePublicID', 'universityRollNo', 'Candidate Name', 'Automata', 
                        'Automata Fix Score', 'Computer Programming Score', 'Computer Programming %', 
                        'WriteX Score', 'WriteX %', 'Logical Ability Score', 'Logical Ability %', 
                        'English Score', 'English %', 'Quantitative Score', 'Quantitative %', 
                        'Grouping', 'Computer Science(Score_1917)', 'Computer Science(Percentile_1917)', 'Average'
                    ], 
                    skipLines: 1 
                }))
                .on('data', (row) => {
                    try {
                        // Convert universityRollNo to an integer
                        const regNo = parseInt(row['universityRollNo']?.trim(), 10);
                        
                        // Ensure required fields exist before pushing to MongoDB
                        if (!isNaN(regNo) && row['Candidate Name'] && row['Grouping']) {
                            amcatData.push({
                                serialNo: parseInt(row['S.No']?.trim(), 10) || null,
                                candidatePublicID: row['candidatePublicID']?.trim() || null,
                                regNo,
                                candidateName: row['Candidate Name']?.trim(),
                                automata: parseInt(row['Automata']?.trim(), 10) || null,
                                automataFixScore: parseInt(row['Automata Fix Score']?.trim(), 10) || null,
                                computerProgrammingScore: parseInt(row['Computer Programming Score']?.trim(), 10) || null,
                                computerProgrammingPercent: parseFloat(row['Computer Programming %']?.trim()) || null,
                                writeXScore: parseFloat(row['WriteX Score']?.trim(), 10) || null,
                                writeXPercent: parseFloat(row['WriteX %']?.trim()) || null,
                                logicalAbilityScore: parseInt(row['Logical Ability Score']?.trim(), 10) || null,
                                logicalAbilityPercent: parseFloat(row['Logical Ability %']?.trim()) || null,
                                englishScore: parseInt(row['English Score']?.trim(), 10) || null,
                                englishPercent: parseFloat(row['English %']?.trim()) || null,
                                quantitativeScore: parseInt(row['Quantitative Score']?.trim(), 10) || null,
                                quantitativePercent: parseFloat(row['Quantitative %']?.trim()) || null,
                                grouping: row['Grouping']?.trim(),
                                computerScienceScore: parseInt(row['Computer Science(Score_1917)']?.trim(), 10) || null,
                                computerSciencePercentile: parseInt(row['Computer Science(Percentile_1917)']?.trim(), 10) || null,
                                average: parseFloat(row['Average']?.trim()) || null
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

        console.log('Parsed CSV data:', amcatData);
        const result = await Amcat.insertMany(amcatData);
        console.log('Data saved to MongoDB:', result);

        res.status(200).json({ message: 'AMCAT details uploaded and saved successfully!', data: result });
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

module.exports = { uploadAmcatFile };