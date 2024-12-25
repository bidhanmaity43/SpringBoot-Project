document.addEventListener("DOMContentLoaded", () => {
    const updatePostForm = document.getElementById("updatePostForm");
    const fetchPostButton = document.getElementById("fetchPostButton");
    const logoutButton = document.getElementById('logout-button'); // Define the logoutButton variable
    const backButton = document.getElementById('back-button'); // Define the backButton variable

    fetchPostButton.addEventListener("click", async () => {
        const postId = document.getElementById("postId").value;
        const response = await fetch(`/api/post/${postId}`);
        if (response.ok) {
            const postData = await response.json();

            document.getElementById("title").value = postData.title;
            document.getElementById("description").value = postData.description;
            document.getElementById("content").value = postData.content;

            // Clear any existing error or success messages
            const errorMessage = document.getElementById("error-message");
            errorMessage.textContent = "";
        } else {
            const errorMessage = document.getElementById("error-message");
            errorMessage.textContent = "Error fetching post.";
            errorMessage.classList.remove("success-message");
            errorMessage.classList.add("error-message");
        }
    });

    updatePostForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const postId = document.getElementById("postId").value;
        const title = document.getElementById("title").value;
        const description = document.getElementById("description").value;
        const content = document.getElementById("content").value;

        const postData = {
            id: postId,
            title,
            description,
            content
        };

        try {
            const response = await fetch(`/api/post/${postId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(postData)
            });

            if (response.ok) {
                const errorMessage = document.getElementById("error-message");
                errorMessage.textContent = "Post updated successfully.";
                errorMessage.classList.remove("error-message");
                errorMessage.classList.add("success-message");
            } else {
                const errorMessage = document.getElementById("error-message");
                errorMessage.textContent = "Error updating post.";
                errorMessage.classList.remove("success-message");
                errorMessage.classList.add("error-message");
            }
        } catch (error) {
            console.error("Error updating post:", error);
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
});
