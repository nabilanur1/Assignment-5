const API_URL = "https://phi-lab-server.vercel.app/api/v1/lab";

// LOGIN
function login() {
const user = document.getElementById("username").value;
const pass = document.getElementById("password").value;

if (user === "admin" && pass === "admin123") {
window.location.href = "dashboard.html";
} else {
alert("Invalid credentials! Try: admin / admin123");
}
}

// STORE DATA
let allIssuesData = [];

// LOAD ISSUES
async function loadIssues(filter = "all", element = null) {

const container = document.getElementById("issuesContainer");
const loader = document.getElementById("loader");

if(element){
document.querySelectorAll(".tab-item").forEach(btn=>{
btn.classList.remove("bg-[#5811f5]","text-white");
});
element.classList.add("bg-[#5811f5]","text-white");
}

loader.classList.remove("hidden");
container.innerHTML="";

try{

const res = await fetch(`${API_URL}/issues`);
const result = await res.json();

if(!result.data){
console.log("No issues found");
return;
}

allIssuesData = result.data;

let filtered = allIssuesData;

if(filter !== "all"){
filtered = allIssuesData.filter(issue => issue.status === filter);
}

document.getElementById("issueCount").innerText = filtered.length;

displayCards(filtered);

}catch(error){
console.log(error);
}

finally{
loader.classList.add("hidden");
}

}

// DISPLAY CARDS
function displayCards(issues){

const container = document.getElementById("issuesContainer");

container.innerHTML = issues.map(issue=>{

const borderClass = issue.status === "open"
? "border-open"
: "border-closed";

const statusIcon =
issue.status === "open"
? `<i class="fa-solid fa-circle-check text-green-500 text-lg"></i>`
: `<i class="fa-solid fa-circle-x mark text-purple-500 text-lg"></i>`;

return `
<div onclick="openIssueDetail('${issue._id}')" 
class="issue-card ${borderClass} cursor-pointer hover:shadow-md transition">

<div class="flex justify-between items-center mb-4">

${statusIcon}

<span class="text-[10px] bg-red-50 text-red-500 px-2 py-0.5 rounded font-black uppercase">
${issue.priority}
</span>

</div>

<h3 class="font-bold text-sm text-gray-800 mb-2">
${issue.title}
</h3>

<p class="text-[11px] text-gray-500 mb-4">
${issue.description}
</p>

<div class="flex gap-2 mb-6">

<span class="bg-red-50 text-red-400 text-[9px] px-2 py-1 rounded font-black">
BUG
</span>

<span class="bg-yellow-50 text-yellow-600 text-[9px] px-2 py-1 rounded font-black">
HELP WANTED
</span>

</div>

<div class="border-t pt-3 text-[10px] text-gray-400 font-bold">

<p>#1 by ${issue.author}</p>

<p>${new Date(issue.createdAt).toLocaleDateString()}</p>

</div>

</div>
`;

}).join("");

}

// SEARCH
async function searchIssues(){

const query = document.getElementById("searchInput").value;

if(query.length < 2) return;

try{

const res = await fetch(`${API_URL}/issues/search?q=${query}`);
const result = await res.json();

displayCards(result.data);

}catch(error){
console.log(error);
}

}

// MODAL
async function openIssueDetail(id){

const modal = document.getElementById("issue_modal");
const modalContent = document.getElementById("modalContent");

try{

const res = await fetch(`${API_URL}/issue/${id}`);
const result = await res.json();

if(!result.data){
alert("Issue not found");
return;
}

const issue = result.data;

modalContent.innerHTML = `

<div class="p-8">

<h2 class="text-2xl font-bold mb-3">
${issue.title}
</h2>

<p class="text-gray-600 mb-6">
${issue.description}
</p>

<div class="grid grid-cols-2 gap-6 bg-gray-50 border rounded-lg p-6">

<div>
<p class="text-xs text-gray-400">Author</p>
<p class="font-semibold">${issue.author}</p>
</div>

<div>
<p class="text-xs text-gray-400">Priority</p>
<p class="font-semibold text-red-500">${issue.priority}</p>
</div>

</div>

<div class="flex justify-end mt-8">

<button onclick="issue_modal.close()" 
class="bg-[#5811f5] text-white px-6 py-2 rounded-md">

Close

</button>

</div>

</div>
`;

modal.showModal();

}catch(error){
console.log(error);
}

}

// INITIAL LOAD
if(window.location.pathname.includes("dashboard.html")){
loadIssues();
}