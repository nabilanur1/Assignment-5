const API_URL = "https://phi-lab-server.vercel.app/api/v1/lab";

// 1. Login Functionality
function login() {
    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;

    if (user === "admin" && pass === "admin123") {
        window.location.href = "dashboard.html";
    } else {
        alert("Invalid credentials! Try: admin / admin123");
    }
}

