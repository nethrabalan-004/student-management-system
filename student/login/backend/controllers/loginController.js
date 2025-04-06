// controllers/loginController.js
const Student = require('../models/Student');  // Import the Student model
const Info = require('../models/info');        // Import the Info model to store the selected language and regNo

// Login handler
exports.login = async (req, res) => {
    try {
        const { regNo, parentPhone, lang } = req.body; // Extract regNo, parentPhone, and lang from request body
        console.log('Received login data:', { regNo, parentPhone, lang });

        // Find the student by regNo
        const student = await Student.findOne({ regNo });

        if (!student) {
            console.log('Student not found:', regNo);
            return res.status(404).json({ success: false, message: 'Student not found!' });
        }

        // Check if the parentPhone matches
        if (student.parentPhone !== parentPhone) {
            console.log('Invalid parentPhone:', parentPhone);
            return res.status(401).json({ success: false, message: 'Invalid login details!' });
        }

        // Save the selected language and regNo to Info.js model
        const info = new Info({ regNo, lang });
        await info.save();

        // Respond with success
        console.log('Login successful for student:', regNo);
        res.status(200).json({ success: true, message: 'Login successful!' });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ success: false, message: 'Internal server error!' });
    }
};
