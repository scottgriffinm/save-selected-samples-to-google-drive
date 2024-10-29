// Helper function to check if the user is authenticated
async function checkAuthentication() {
    try {
        const response = await fetch("/auth/status");
        const data = await response.json();
        return data.isAuthenticated;
    } catch (error) {
        console.error("Error checking authentication:", error);
        return false;
    }
}

// Initialize the app by checking authentication
async function init() {
    const isAuthenticated = await checkAuthentication();

    // If authenticated, hide sign-in and show get samples button
    if (isAuthenticated) {
        document.getElementById("signInButton").style.display = "none";
        document.getElementById("getSamples").style.display = "block";
    } else {
        document.getElementById("signInButton").style.display = "block";
        document.getElementById("getSamples").style.display = "none";
    }
}

// Sign-in button click handler to redirect to Google sign-in
document.getElementById("signInButton").addEventListener("click", () => {
    window.location.href = "/auth/google";
});

document.getElementById("getSamples").addEventListener("click", async () => {
    const audioContainer = document.getElementById("audioContainer");
    audioContainer.innerHTML = "";

    try {
        const response = await fetch("/api/samples");
        const { files, map } = await response.json(); // Get files and fileMap

        files.forEach(filename => {
            const audio = document.createElement("audio");
            audio.controls = true;
            audio.src = `/api/sample/${filename}`; // Load audio using modified filename

            const addToDriveButton = document.createElement("button");
            addToDriveButton.textContent = "Add to Drive";
            addToDriveButton.onclick = async () => {
                try {
                    const res = await fetch("/api/add-to-drive", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ fileName: filename, map: map }), // Send original filename map
                    });
                    const result = await res.json();
                    alert(result.message);
                } catch (error) {
                    console.error("Error adding file to Google Drive:", error);
                }
            };

            audioContainer.appendChild(audio);
            audioContainer.appendChild(addToDriveButton);
        });
    } catch (error) {
        console.error("Error fetching samples:", error);
    }
});

// Initialize the app on load
init();