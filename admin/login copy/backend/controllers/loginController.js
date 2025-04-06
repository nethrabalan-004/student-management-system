// controllers/loginController.js
const Student = require('../models/Student');  // Import the Student model
const Info = require('../models/info');        // Import the Info model to store the selected language and regNo

// Login handler
exports.login = async (req, res) => {
    try {
        const { counMail, pass } = req.body; // Extract counMail, pass, and lang from request body
        console.log('Received login data:', { counMail, pass });

        // Find the student by counMail
        const coun = await Student.findOne({ counMail:counMail });
        console.log(coun.Pass);

        if (!coun) {
            console.log('Student not found:', counMail);
            return res.status(404).json({ success: false, message: 'Student not found!' });
        }

        // Check if the pass matches
        if (coun.Pass!==pass) {
            console.log('Invalid password:', pass);
            return res.status(401).json({ success: false, message: 'Invalid login details!' });
        }

        // Save the selected language and counMail to Info.js model
        const info = new Info({ counMail,pass });
        await info.save();

        // Respond with success
        console.log('Login successful for Councler:', counMail);
        res.status(200).json({ success: true, message: 'Login successful!' });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ success: false, message: 'Internal server error!' });
    }
};
