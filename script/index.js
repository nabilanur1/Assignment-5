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
// 2. Load Issues (All/Open/Closed)
let allIssuesData = [];

async function loadIssues(filter = 'all', element = null) {
    const container = document.getElementById("issuesContainer");
    const loader = document.getElementById("loader");
    
    
    if(element) {
        document.querySelectorAll('.tab-item').forEach(btn => {
            btn.classList.remove('bg-[#5811f5]', 'text-white');
        });
        element.classList.add('bg-[#5811f5]', 'text-white');
    }

    loader.classList.remove('hidden');
    container.innerHTML = "";

    try {
        const response = await fetch(`${API_URL}/issues`);
        const result = await response.json();
        allIssuesData = result.data;

        let filteredData = allIssuesData;
        if (filter !== 'all') {
            filteredData = allIssuesData.filter(issue => issue.status === filter);
        }

        document.getElementById("issueCount").innerText = filteredData.length;
        displayCards(filteredData);
    } catch (error) {
        console.error("Error fetching data:", error);
    } finally {
        loader.classList.add('hidden');
    }
}


