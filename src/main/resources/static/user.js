// Fetch the user's information from the backend
const fetchUserInfo = async () => {
    try {
        const response = await fetch('/api/auth/currentUser'); // Adjust the endpoint as needed
        if (response.ok) {
            const data = await response.json();
            return data.name;
        } else {
            console.error('Error fetching user info:', response.statusText);
        }
    } catch (error) {
        console.error('Error fetching user info:', error);
    }
};

// Update the welcome message with the username
const updateWelcomeMessage = async () => {
    const welcomeMessage = document.getElementById('welcomeMessage');
    const username = await fetchUserInfo();
    if (username) {
        welcomeMessage.textContent = `Welcome ${username} !`;
    }
};

// Call the function to update the welcome message
updateWelcomeMessage();

// Redirect to view.html when clicking on "View Post" option
const viewPostOption = document.querySelector('.option-block');
viewPostOption.addEventListener('click', () => {
    window.location.href = 'user-view.html';
});

// Corrected: Add the following code to select the logout button
const logoutButton = document.getElementById('logout-button-user');

logoutButton.addEventListener('click', async () => {
    try {
        // Get the JWT token from sessionStorage
        const userToken = sessionStorage.getItem('userToken');
        console.log('JWT Token:', userToken); // Display the JWT token in the console

        // Call the logout endpoint on the server to invalidate the token
        const response = await fetch('/api/auth/logout', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${userToken}`, // Use the token from sessionStorage
                'Content-Type': 'application/json',
            },
        });

        // Log the server response
        console.log('Logout Response:', response);

        if (response.ok) {
            // Clear the user token from sessionStorage
            sessionStorage.removeItem('userToken');

            // Redirect the user to the login page (replace 'login.html' with your actual login page)
            window.location.href = 'login.html';
        } else {
            // Handle error responses here
            console.error('Error logging out:', response.statusText);

            // You can display an error message to the user if needed
            // errorMessage.textContent = 'Error logging out'; // Add an error message element in your HTML
        }
    } catch (error) {
        console.error('Error logging out:', error);
        // You can display an error message to the user if needed
        // errorMessage.textContent = 'Error logging out'; // Add an error message element in your HTML
    }
});
