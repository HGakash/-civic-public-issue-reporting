const API_BASE_URL = "http://localhost:8002/api/auth"; // Change this if backend URL is different

// Handle Signup
document.getElementById("signupForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;
    const department = role === "Department Official" ? document.getElementById("department").value : null;

    try {
        const response = await fetch(`${API_BASE_URL}/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password, role, department }),
        });

        const data = await response.json();
        if (response.ok) {
            alert("Signup successful! Redirecting to login...");
            window.location.href = "login.html";
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error("Signup error:", error);
        alert("Something went wrong. Try again.");
    }
});

document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        if (response.ok) {
            // Store token & role in localStorage
            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.role);

            // Redirect user based on role
            if (data.role === "Citizen") {
                window.location.href = "citizen_dashboard.html";
            } else if (data.role === "Department Official") {
                window.location.href = "department_dashboard.html";
            }
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error("Login error:", error);
        alert("Something went wrong. Try again.");
    }
});


