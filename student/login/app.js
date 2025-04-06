document.addEventListener("DOMContentLoaded", () => {
    const languagePopup = document.getElementById("languagePopup");
    const languageButtons = document.querySelectorAll(".language-btn");
    let selectedLanguage = null;

    // Show language selection popup
    setTimeout(() => {
        languagePopup.style.display = "flex";
    }, 500); // Delays popup by 500ms

    
    // Handle language selection
    languageButtons.forEach(button => {
        button.addEventListener("click", () => {
            selectedLanguage = button.getAttribute("data-lang");
            languagePopup.style.display = "none";
        });
    });

    // Handle login form submission
    const loginForm = document.getElementById("loginForm");
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (!selectedLanguage) {
            alert("Please select a language.");
            return;
        }

        const regNo = document.getElementById("regNo").value;
        const parentPhone = document.getElementById("parentPhone").value;
            
        const response = await fetch("http://localhost:3004/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ regNo, parentPhone, lang: selectedLanguage }) // Correct key is "lang"
        });

        const data = await response.json();

        if (data.success) {
            window.location.href = "../dash/index.html"; // Change this as per your need
        } else {
            alert(`Login failed: ${data.message}`); // Show the error message from backend
        }
    });

    // Close Language Popup
    function closeLanguagePopup() {
        languagePopup.style.display = "none";
    }

    // Optional: Automatically close after some time or on background click
    languagePopup.addEventListener('click', (e) => {
        if (e.target === languagePopup) {
            closeLanguagePopup();
        }
    });
});




