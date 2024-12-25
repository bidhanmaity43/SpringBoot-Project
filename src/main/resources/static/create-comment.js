document.addEventListener("DOMContentLoaded", () => {
    const createCommentForm = document.getElementById("createCommentForm");
    const logoutButton = document.getElementById('logout-button');
    const backButton = document.getElementById('back-button');

    // Event listener to populate the Post ID input field
    const populatePostId = (postId) => {
        const postIdInput = document.getElementById("postId");
        postIdInput.value = postId;
    };

    createCommentForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const postId = document.getElementById("postId").value;
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const body = document.getElementById("body").value;

        const commentData = {
            name,
            email,
            body
        };

        try {
            const response = await fetch(`/api/posts/${postId}/comments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(commentData)
            });

            if (response.ok) {
                const errorMessage = document.getElementById("error-message");
                errorMessage.textContent = "Comment created successfully.";
                errorMessage.classList.remove("error-message");
                errorMessage.classList.add("success-message");
            } else {
                const errorMessage = document.getElementById("error-message");
                errorMessage.textContent = "Error creating comment.";
                errorMessage.classList.remove("success-message");
                errorMessage.classList.add("error-message");
            }
        } catch (error) {
            console.error("Error creating comment:", error);
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

    // Extract the post ID from the URL query parameter and populate the Post ID input field
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('postId');
    if (postId) {
        populatePostId(postId);
    }
});
