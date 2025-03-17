const API_BASE_URL = "http://localhost:8002"; // Change if needed


// Fetch & display issues
async function loadIssues() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/issues/get-all`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        const issues = await response.json();
        const issuesList = document.getElementById("issuesList");
        issuesList.innerHTML = "";

        issues.forEach((issue) => {
            const issueItem = document.createElement("li");
            issueItem.className = "border p-4 rounded shadow";

            issueItem.innerHTML = `
                <h3 class="text-lg font-bold">${issue.title}</h3>
                <p>${issue.description}</p>
                <p><strong>Location:</strong> ${issue.location}</p>
                <p><strong>Department:</strong> ${issue.department}</p>
                <p><strong>Status:</strong> <span class="text-${issue.status === 'Completed' ? 'green' : 'red'}-500">${issue.status}</span></p>
                <p>Issue Image</p>
                ${issue.image ? `<img src="http://localhost:8002${issue.image}" class="w-32 mt-2 rounded">` : ""}
                ${issue.completion_image?`<p>Issue Resolved Image</p>`:""}
                ${issue.completion_image ? `<img src="http://localhost:8002${issue.completion_image}" class="w-32 mt-2 rounded">` : ""}
            `;

            issuesList.appendChild(issueItem);
        });
    } catch (error) {
        console.error("Error loading issues:", error);
    }
}


// Load issues on page load and clear form
document.addEventListener("DOMContentLoaded", () => {
    loadIssues();
});

