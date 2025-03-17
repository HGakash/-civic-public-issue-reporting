const API_BASE_URL = "http://localhost:8002"; // Change if needed

// Function to clear form data on page load/refresh
function clearFormOnRefresh() {
    const form = document.getElementById("issueForm");
    if (form) {
        form.reset();
        // Also clear any hidden fields that might not be reset by form.reset()
        document.getElementById("location_coordinates").value = "";
        document.getElementById("locationStatus").textContent = "";
    }
}

document.getElementById("issueForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formElement = e.target; // Get the form directly from the event
    const formData = new FormData();
    formData.append("title", document.getElementById("title").value);
    formData.append("description", document.getElementById("description").value);
    formData.append("location", document.getElementById("location").value);
    formData.append("coordinates", document.getElementById("location_coordinates").value);
    formData.append("department", document.getElementById("department").value);
    formData.append("image", document.getElementById("image").files[0]);

    try {
        const response = await fetch(`${API_BASE_URL}/api/issues/report`, {
            method: "POST",
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            body: formData,
        });

        if (response.ok) {
            alert("Issue reported successfully!");
            loadIssues(); // Reload issues
            formElement.reset(); // Reset using the element from the event
            // Clear coordinates and status text as well
            document.getElementById("location_coordinates").value = "";
            document.getElementById("locationStatus").textContent = "";
        } else {
            const data = await response.json();
            alert(data.message);
        }

    } catch (error) {
        console.error("Error reporting issue:", error);
        alert("Something went wrong.");
    }
});

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

document.getElementById("getLocation").addEventListener("click", () => {
    const locationStatus = document.getElementById("locationStatus");

    if ("geolocation" in navigator) {
        locationStatus.textContent = "Fetching location...";
        
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                // Convert coordinates to address (using OpenStreetMap)
                try {
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
                    );
                    const data = await response.json();
                    console.log(data);
                    document.getElementById("location").value = data.display_name || `${latitude}, ${longitude}`;
                    document.getElementById("location_coordinates").value = `${latitude}, ${longitude}`;    
                    locationStatus.textContent = "location fetched successfully";
                } catch (error) {
                    console.error("Error fetching address:", error);
                    document.getElementById("location").value = `${latitude}, ${longitude}`;
                }
            },
            (error) => {
                console.error("Error getting location:", error);
                locationStatus.textContent = "Location access denied!";
            }
        );
    } else {
        locationStatus.textContent = "Geolocation is not supported by your browser.";
    }
});

// Load issues on page load and clear form
document.addEventListener("DOMContentLoaded", () => {
    loadIssues();
    clearFormOnRefresh();
});



