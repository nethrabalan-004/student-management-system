//detailRoutes.js

const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Amcat = require('../models/Amcat');
const mongoose=require('mongoose');
const infoSchema = new mongoose.Schema({
    counMail: { type: String, required: true },
    pass: { type: String, required: true }
});

const infom = mongoose.model('InfoCoun', infoSchema);


// Get all students
router.get('/students', async (req, res) => {
    
    try {
        const value=await infom.find().sort({ _id: -1 }).limit(1);
    // console.log(value)
    const counMail=value[0]['counMail'];
    console.log(counMail)
        const students = await Student.find({counMail}, 'regNo name department currentSemester cgpa attendancePercentage');
        console.log(students)
        res.json(students);
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get student details by regNo including AMCAT scores
router.get('/students/:regNo', async (req, res) => {
    try {
        const regNo = req.params.regNo;

        const student = await Student.findOne({ regNo });
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        const amcatScores = await Amcat.findOne({ regNo });

        res.json({
            ...student.toObject(),
            amcatScores: amcatScores || {} // Include AMCAT scores if available
        });

    } catch (error) {
        console.error('Error fetching student details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
module.exports = router;