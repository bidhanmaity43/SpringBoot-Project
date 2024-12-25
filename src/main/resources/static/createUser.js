document.addEventListener("DOMContentLoaded", () => {
    const createUserForm = document.getElementById("createUserForm");
    const logoutButton = document.getElementById('logout-button');
    const backButton = document.getElementById('back-button');
    const errorMessage = document.getElementById("error-message");

    createUserForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const name = document.getElementById("name").value;
        const username = document.getElementById("username").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        const userData = {
            name,
            username,
            email,
            password
        };

        try {
            const response = await fetch("/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userData)
            });

            if (response.ok) {
                errorMessage.textContent = "User created successfully.";
                errorMessage.classList.remove("error-message");
                errorMessage.classList.add("success-message");
            } else {
                errorMessage.textContent = "Error creating user.";
                errorMessage.classList.remove("success-message");
                errorMessage.classList.add("error-message");
            }
        } catch (error) {
            console.error("Error creating user:", error);
            errorMessage.textContent = "An error occurred while creating the user.";
            errorMessage.classList.remove("success-message");
            errorMessage.classList.add("error-message");
        }
    });

    // Event listener for the "Logout" button
    logoutButton.addEventListener('click', async () => {
        try {
            const userToken = sessionStorage.getItem('userToken');

            if (userToken) {
                const response = await fetch('/api/auth/logout', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${userToken}`,
                        'Content-Type': 'application/json',
                    },
                });

                console.log('Logout Response:', response);

                if (response.ok) {
                    sessionStorage.removeItem('userToken');
                    window.location.href = 'login.html';
                } else {
                    console.error('Error logging out:', response.statusText);
                    errorMessage.textContent = 'Error logging out.';
                    errorMessage.classList.remove("success-message");
                    errorMessage.classList.add("error-message");
                }
            } else {
                console.error('User token not found in session storage.');
                errorMessage.textContent = 'Error logging out.';
                errorMessage.classList.remove("success-message");
                errorMessage.classList.add("error-message");
            }
        } catch (error) {
            console.error('Error logging out:', error);
            errorMessage.textContent = 'An error occurred while logging out.';
            errorMessage.classList.remove("success-message");
            errorMessage.classList.add("error-message");
        }
    });

    // Event listener for the "Back" button
    backButton.addEventListener('click', () => {
        window.history.back();
    });
});
