//detailController.js
const mongoose=require('mongoose');
const Student = require("../models/Student");
const Amcat = require("../models/Amcat");


const mongoose = require('mongoose');
const infoSchema = new mongoose.Schema({
    counMail: { type: String, required: true },
    pass: { type: String, required: true }
});

const infom = mongoose.model('InfoCoun', infoSchema);



// Get all students
exports.getAllStudents = async (req, res) => {
    //get the last login counMail from infom
    const value=await infom.find().sort({ _id: -1 }).limit(1);
    console.log(value)
    const counMail=value[0]['counMail'];
    console.log(counMail)
    // const lang=value[0]['lang']
    try {
        const students = await Student.find({counMail:counMail}, "regNo name department cgpa"); // Fetch only required fields
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

// Get student details along with AMCAT scores
exports.getStudentDetails = async (req, res) => {
    try {
        const { regNo } = req.params;

        // Find student details
        const student = await Student.findOne({ regNo: regNo });
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        // Find AMCAT details
        const amcat = await Amcat.findOne({ regNo: regNo });

        res.json({
            regNo: student.regNo,
            name: student.name,
            email: student.email,
            phone: student.phone,
            parentPhone: student.parentPhone,
            department: student.department,
            currentSemester: student.currentSemester,
            cgpa: student.cgpa,
            attendancePercentage: student.attendancePercentage,
            amcatScores: amcat ? {
                logicalAbilityScore: amcat.logicalAbilityScore || 'N/A',
                englishScore: amcat.englishScore || 'N/A',
                quantitativeScore: amcat.quantitativeScore || 'N/A',
                computerProgrammingScore: amcat.computerProgrammingScore || 'N/A',
                automata: amcat.automata || 'N/A',
                
            } : {}
        });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};