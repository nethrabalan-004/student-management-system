require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Import Routes
const marksRoutes = require('./routes/marksRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const studentRoutes = require('./routes/studentRoutes');
// const loginRoutes = require('./routes/loginRoutes');
const amcatRoutes = require('./routes/amcatRoutes');

const detailRoutes = require("./routes/detailRoutes");


const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI,).then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Use Routes
app.use('/api/marks', marksRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/studentDetails', studentRoutes);
// app.use('/api', loginRoutes);
app.use('/api', detailRoutes);
app.use('/api/amcat', amcatRoutes);






module.exports = app;