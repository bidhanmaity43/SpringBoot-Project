const createPostForm = document.getElementById('createPostForm');
const errorMessage = document.getElementById('error-message');
const logoutButton = document.getElementById('logout-button'); // Define the logoutButton variable
const backButton = document.getElementById('back-button'); // Define the backButton variable

createPostForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Clear previous error message
    errorMessage.textContent = '';

    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const content = document.getElementById('content').value;

    const postData = {
        title,
        description,
        content
    };

    try {
        const response = await fetch('/api/post', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
        });

        if (response.ok) {
            // Display success message with appropriate color
            errorMessage.textContent = 'Post is saved!';
            errorMessage.classList.add('success-message');
            errorMessage.classList.remove('error-message');
        } else {
            // Display error message from the server with appropriate color
            const result = await response.json();
            errorMessage.textContent = result.message || 'An error occurred.';
            errorMessage.classList.add('error-message');
            errorMessage.classList.remove('success-message');
        }
    } catch (error) {
        console.error('Error creating post:', error);
    }
});

// Event listener for the "Logout" button
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

// Event listener for the "Back" button
backButton.addEventListener('click', () => {
    // Add logic to navigate back to the previous page
    window.history.back();
});
