const API_BASE_URL = "http://localhost:8002/api/issues"; // Update with actual API URL

document.addEventListener("DOMContentLoaded", async () => {
    const department = localStorage.getItem("department"); // Retrieve department from storage
    document.getElementById("dept-name").innerText = department;
    if (!department) {
        alert("Department not found. Please log in again.");
        return;
    }
    await loadDepartmentIssues(department);
});

// Function to load department-specific issues
async function loadDepartmentIssues(department) {
    const container = document.getElementById("issues-container");
    container.innerHTML = "<p>Loading issues...</p>";

    try {
        const response = await fetch(`${API_BASE_URL}/department/${department}`, {
            method: "GET",
            headers: { 
                "Authorization": `Bearer ${localStorage.getItem("token")}` // Auth token for security
            }
        });

        const issues = await response.json();
        container.innerHTML = ""; // Clear loading message

        if (issues.length === 0) {
            container.innerHTML = "<p class='text-gray-500'>No issues reported for this department.</p>";
            return;
        }

        issues.forEach(issue => {
            const issueCard = document.createElement("div");
            issueCard.className = "bg-white p-4 rounded-lg shadow-md";

            issueCard.innerHTML = `
                <h3 class="text-lg font-bold">${issue.title}</h3>
                <p class="text-sm text-gray-600">${issue.description}</p>
                <p class="text-sm font-medium mt-2">Location: ${issue.location}</p>
                <p class="text-sm font-medium">Department: ${issue.department}</p>
                <p class="text-sm font-medium">Status: <span class="text-blue-500">${issue.status}</span></p>
                <p class="text-sm font-medium">Reported by: ${issue.user.name} (${issue.user.email})</p>

                <div class="mt-2">
                    <p class="font-semibold">Citizen Image:</p>
                    <img src="http://localhost:8002${issue.image}" alt="Issue Image" class="w-32 h-32 object-cover rounded mt-1">
                </div>

                ${issue.completion_image ? `
                    <div class="mt-2">
                        <p class="font-semibold">Completion Image:</p>
                        <img src="http://localhost:8002${issue.completion_image}" alt="Completion Image" class="w-32 h-32 object-cover rounded mt-1">
                    </div>
                ` : `
                    <button class="mt-4 bg-blue-500 text-white px-4 py-2 rounded update-btn" data-id="${issue._id}">
                        Update Status
                    </button>
                `}
            `;

            container.appendChild(issueCard);
        });

        // Attach event listeners to update buttons
        document.querySelectorAll(".update-btn").forEach(button => {
            button.addEventListener("click", () => openUpdateModal(button.getAttribute("data-id")));
        });

    } catch (error) {
        console.error("Error loading department issues:", error);
        container.innerHTML = "<p class='text-red-500'>Failed to load issues.</p>";
    }
}

// Open Update Modal
function openUpdateModal(issueId) {
    document.getElementById("update-modal").classList.remove("hidden");
    document.getElementById("issue-id").value = issueId;
    
    // Clear any previously selected file
    const fileInput = document.getElementById("completion-image");
    if (fileInput) {
        fileInput.value = "";
    }
    
    // Reset status dropdown to default if needed
    const statusSelect = document.getElementById("status");
    if (statusSelect) {
        statusSelect.selectedIndex = 0; // Reset to first option
    }
}

// Close Modal
document.getElementById("close-modal").addEventListener("click", () => {
    document.getElementById("update-modal").classList.add("hidden");
    // Also clear form when closing modal
    resetUpdateForm();
});

// Reset update form function
function resetUpdateForm() {
    document.getElementById("issue-id").value = "";
    
    // Clear file input
    const fileInput = document.getElementById("completion-image");
    if (fileInput) {
        fileInput.value = "";
    }
    
    // Reset status dropdown
    const statusSelect = document.getElementById("status");
    if (statusSelect) {
        statusSelect.selectedIndex = 0;
    }
}

// Handle Update Submission
document.getElementById("update-issue").addEventListener("click", async () => {
    const issueId = document.getElementById("issue-id").value;
    const status = document.getElementById("status").value;
    const completionImage = document.getElementById("completion-image").files[0];

    const formData = new FormData();
    formData.append("status", status);
    if (completionImage) {
        formData.append("completion_image", completionImage);
    }

    try {
        const response = await fetch(`${API_BASE_URL}/update/${issueId}`, {
            method: "PUT",
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }, // Ensure auth token
            body: formData
        });

        const result = await response.json();
        
        if (response.ok) {
            alert("Issue updated successfully!");
            document.getElementById("update-modal").classList.add("hidden");
            
            // Reset the form fields
            resetUpdateForm();
            
            // Refresh the issues list
            await loadDepartmentIssues(localStorage.getItem("department"));
        } else {
            alert(result.message || "Failed to update issue.");
        }
    } catch (error) {
        console.error("Error updating issue:", error);
        alert("Failed to update issue.");
    }
});