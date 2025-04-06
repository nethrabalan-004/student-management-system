async function loading (){

 // Log the regNo being used for the request

    try {
        const response = await fetch(`http://127.0.0.1:3000/api/studentDetails/students`);
        if (!response.ok) {
            throw new Error('Failed to fetch student details');
        }
        const studentData = await response.json();
        // Populate the details in the HTML
        document.getElementById('studentRegNo').textContent = studentData.regNo || 'N/A';
        document.getElementById('studentName').textContent = studentData.name || 'N/A';
        document.getElementById('studentEmail').textContent = studentData.email || 'N/A';
        document.getElementById('studentPhone').textContent = studentData.phone || 'N/A';
        document.getElementById('studentParentPhone').textContent = studentData.parentPhone || 'N/A';
        document.getElementById('studentDepartment').textContent = studentData.department || 'N/A';
        document.getElementById('studentSemester').textContent = studentData.currentSemester || 'N/A';
        document.getElementById('studentCGPA').textContent = studentData.cgpa || 'N/A';
        document.getElementById('studentAttendancePercentage').textContent = studentData.attendancePercentage || 'N/A';
        document.getElementById('studentDetailsContainer').style.display = 'block'; // Show the student details container
    } catch (error) {
        console.error('Error fetching student details:', error); // Log any errors during the fetch request
        console.log(error);
        alert('Error fetching student details');
    }
}

window.onload = loading()