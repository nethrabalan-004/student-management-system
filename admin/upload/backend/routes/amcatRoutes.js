// routes/amcatRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { uploadAmcatFile } = require('../controllers/amcatController');
const router = express.Router();

// Ensure 'uploads' directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

// Multer instance with file type validation
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(csv|xlsx)$/)) {
            return cb(new Error('Only CSV and XLSX files are allowed!'));
        }
        cb(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// POST route for uploading AMCAT scores
router.post('/uploadAmcatScores', upload.single('amcatFile'), (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded!' });
    }
    next();
}, uploadAmcatFile);

module.exports = router;