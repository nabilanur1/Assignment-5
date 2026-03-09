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
// 3. Display Cards in Grid
function displayCards(issues) {
    const container = document.getElementById("issuesContainer");
    container.innerHTML = issues.map(issue => {
        
        const borderClass = issue.status === 'open' ? 'border-open' : 'border-closed';
        
 const statusIcon =
issue.status.toLowerCase() === 'open'
? `<img src="assets/open-status.png" class="w-5 h-5">`
: `<img src="assets/closed-status.png" class="w-5 h-5">`;

        return `
            <div onclick="openIssueDetail('${issue._id}')" 
class="issue-card ${borderClass} cursor-pointer hover:shadow-md transition">
                <div class="flex justify-between items-center mb-4">
                    ${statusIcon}
                    <span class="text-[10px] bg-red-50 text-red-500 px-2 py-0.5 rounded font-black uppercase tracking-tighter">${issue.priority}</span>
                </div>
                <h3 class="font-bold text-sm text-gray-800 leading-tight mb-2 line-clamp-2">${issue.title}</h3>
                <p class="text-[11px] text-gray-500 mb-4 line-clamp-2">${issue.description}</p>
                <div class="flex gap-2 mb-6 mt-auto">
                    <span class="bg-red-50 text-red-400 text-[9px] px-2 py-1 rounded font-black border border-red-100 italic">BUG</span>
                    <span class="bg-yellow-50 text-yellow-600 text-[9px] px-2 py-1 rounded font-black border border-yellow-100 italic">HELP WANTED</span>
                </div>
                <div class="border-t pt-3 text-[10px] text-gray-400 font-bold flex flex-col gap-1">
                    <p>#1 by ${issue.author}</p>
                    <p>${new Date(issue.createdAt).toLocaleDateString()}</p>
                </div>
            </div>
        `;
    }).join("");
}

// 4. Search Functionality
async function searchIssues() {
    const query = document.getElementById("searchInput").value;
    if (query.length < 2) return;

    try {
        const res = await fetch(`${API_URL}/issues/search?q=${query}`);
        const result = await res.json();
        displayCards(result.data);
    } catch (e) { console.error(e); }
}

// 5. Modal Display 
async function openIssueDetail(id) {
    const modalContent = document.getElementById("modalContent");
    try {
        const res = await fetch(`${API_URL}/issue/${id}`);
        const result = await res.json();
        const issue = result.data;

        modalContent.innerHTML = `
            <div class="p-8">
                <h2 class="text-2xl font-black text-gray-800 mb-2">${issue.title}</h2>
                <div class="flex gap-2 items-center mb-4">
                    <span class="badge badge-success text-white text-[10px] py-3 px-4 font-black rounded-full uppercase tracking-widest">${issue.status}</span>
                    <span class="text-gray-400 text-xs font-bold italic">Opened by ${issue.author} • ${new Date(issue.createdAt).toLocaleDateString()}</span>
                </div>
                <div class="flex gap-2 mb-6">
                    <span class="border border-red-100 text-red-400 text-[10px] px-2 py-1 rounded font-bold italic">BUG</span>
                    <span class="border border-yellow-100 text-yellow-500 text-[10px] px-2 py-1 rounded font-bold italic">HELP WANTED</span>
                </div>
                <p class="text-gray-600 text-sm leading-relaxed mb-10 font-medium">${issue.description}</p>
                <div class="grid grid-cols-2 gap-4 bg-gray-50 p-5 rounded-lg border border-gray-100">
                    <div>
                        <p class="text-[9px] text-gray-400 font-black uppercase tracking-tighter mb-1">Assignee</p>
                        <p class="font-bold text-gray-800 text-sm">${issue.author}</p>
                    </div>
                    <div>
                        <p class="text-[9px] text-gray-400 font-black uppercase tracking-tighter mb-1">Priority</p>
                        <span class="bg-red-500 text-white text-[10px] px-3 py-1 rounded font-black uppercase">${issue.priority}</span>
                    </div>
                </div>
                <button onclick="document.getElementById('issue_modal').close()" class="w-full mt-8 bg-[#5811f5] text-white py-3 rounded-md font-bold text-sm tracking-widest shadow-lg">CLOSE</button>
            </div>
        `;
        document.getElementById("issue_modal").showModal();
    } catch (e) { console.error(e); }
}

// Initial Load
if(window.location.pathname.includes('dashboard.html')) {
    loadIssues();
}



