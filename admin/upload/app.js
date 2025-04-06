

document.getElementById('fetchDetailsButton').addEventListener('click', async (event) => {
    event.preventDefault();

    const regNo = document.getElementById('regNo').value;
    const searchContainer = document.querySelector('.form-group'); // Select the search box container
    const studentDetailsContainer = document.getElementById('studentDetailsContainer');
    const errorMessage = document.getElementById('errorMessage');

    console.log('Fetching details for Register Number:', regNo);

    try {
        const response = await fetch(`http://127.0.0.1:3000/api/studentDetails/students/${regNo}`);
        if (!response.ok) {
            throw new Error('Failed to fetch student details');
        }
        const studentData = await response.json();

        // Populate student details
        document.getElementById('studentRegNo').textContent = studentData.regNo || 'N/A';
        document.getElementById('studentName').textContent = studentData.name || 'N/A';
        document.getElementById('studentEmail').textContent = studentData.email || 'N/A';
        document.getElementById('studentPhone').textContent = studentData.phone || 'N/A';
        document.getElementById('studentParentPhone').textContent = studentData.parentPhone || 'N/A';
        document.getElementById('studentDepartment').textContent = studentData.department || 'N/A';
        document.getElementById('studentSemester').textContent = studentData.currentSemester || 'N/A';
        document.getElementById('studentCGPA').textContent = studentData.cgpa || 'N/A';
        document.getElementById('studentAttendancePercentage').textContent = studentData.attendancePercentage || 'N/A';

        // Hide search box and error message
        searchContainer.style.display = 'none';
        errorMessage.style.display = 'none';

        // Show student details
        studentDetailsContainer.style.display = 'block';

    } catch (error) {
        console.error('Error fetching student details:', error);
        errorMessage.style.display = 'block'; // Show error message
        studentDetailsContainer.style.display = 'none'; // Hide details if error
    }
});


document.getElementById('uploadButton').addEventListener('click', async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    const uploadType = document.getElementById('uploadType').value;
    const formData = new FormData();

    if (uploadType === 'marks') {
        await handleMarksUpload(formData);
    } else if (uploadType === 'attendance') {
        await handleAttendanceUpload(formData);
    } else if (uploadType === 'studentDetails') {
        await handleStudentDetailsUpload(formData);
    }
    else if (uploadType === 'amcat') {
        await handleAmcatUpload(formData);
    }
});

async function handleMarksUpload(formData) {
    const marksFileInput = document.getElementById('marksFile');
    if (!marksFileInput.files[0]) {
        alert('Please select a marks file');
        return;
    }

    const marksFile = marksFileInput.files[0];
    formData.append('marksFile', marksFile);

    // Get the selected exam type
    const examType = document.getElementById('examType').value;
    formData.append('examType', examType);

    await uploadFile('marks/uploadMarks', formData, 'Marks file uploaded successfully!');
}

async function handleAmcatUpload(formData) {
    const amcatFileInput = document.getElementById('amcatFile');
    if (!amcatFileInput.files[0]) {
        alert('Please select an AMCAT file');
        return;
    }

    const amcatFile = amcatFileInput.files[0];
    formData.append('amcatFile', amcatFile);

    await uploadFile('amcat/uploadAmcatScores', formData, 'AMCAT file uploaded successfully!');
}

async function handleAttendanceUpload(formData) {
    const attendanceFileInput = document.getElementById('attendanceFile');
    if (!attendanceFileInput.files[0]) {
        alert('Please select an attendance file');
        return;
    }

    const attendanceFile = attendanceFileInput.files[0];
    formData.append('attendanceFile', attendanceFile);

    await uploadFile('attendance/uploadAttendance', formData, 'Attendance file uploaded successfully and sms sent successfully!');

    // After successful attendance upload, show the SMS button
    document.getElementById('sendSmsButton').style.display = 'block';
}

async function handleStudentDetailsUpload(formData) {
    const studentDetailsFileInput = document.getElementById('studentDetailsFile');
    if (!studentDetailsFileInput.files[0]) {
        alert('Please select a student details file');
        return;
    }

    const studentDetailsFile = studentDetailsFileInput.files[0];
    formData.append('studentDetailsFile', studentDetailsFile);

    await uploadFile('studentDetails/uploadStudentDetails', formData, 'Student details file uploaded successfully!');
}

async function uploadFile(endpoint, formData, successMessage) {
    try {
        const response = await fetch('http://127.0.0.1:3000/api/' + endpoint, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            alert('Upload failed: ' + errorText);
            return;
        }

        const data = await response.json();
        if (data.message && data.message.toLowerCase().includes('uploaded')) {
            alert(successMessage);
        } else {
            alert('Unexpected response message: ' + data.message);
        }
    } catch (error) {
        console.error('Upload Error:', error);
        //alert('Error: ' + error.message);
    }
}

// Function to send SMS notifications
async function handleSendSms() {
    const smsStatusMessage = document.getElementById('smsStatusMessage');
    smsStatusMessage.textContent = "Sending SMS notifications...";

    try {
        const response = await fetch('http://127.0.0.1:3000/api/attendance/sendSms', {
            method: 'POST',
        });

        const data = await response.json();

        if (response.ok) {
            smsStatusMessage.textContent = "SMS notifications sent successfully!";
        } else {
            smsStatusMessage.textContent = "Error sending SMS: " + data.message;
        }
    } catch (error) {
        console.error('Error sending SMS:', error);
        smsStatusMessage.textContent = "Error: " + error.message;
    }
}

// Add event listener for the "Send SMS Notifications" button
document.getElementById('sendSmsButton')?.addEventListener('click', async () => {
    await handleSendSms();
});

