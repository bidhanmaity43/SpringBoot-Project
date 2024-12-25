const loginForm = document.getElementById('loginForm');
const errorMessage = document.getElementById('error-message');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const usernameOrEmail = document.getElementById('usernameOrEmail').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/auth/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ usernameOrEmail, password }),
        });

        if (response.ok) {
            const data = await response.json();
            const userToken = data.accessToken; // Get the JWT token

            // Store the JWT token in sessionStorage
            sessionStorage.setItem('userToken', userToken);

            console.log('JWT Token:', userToken);

            // Split the JWT token and decode the payload (payload is already a base64-encoded JSON)
            const jwtPayload = JSON.parse(atob(userToken.split('.')[1]));
            console.log('Decoded JWT Payload:', jwtPayload);

            // Extract roles from the payload
            const roles = jwtPayload.roles;

            // Check if the user has the "ROLE_ADMIN" role
            if (roles.includes('ROLE_ADMIN')) {
                window.location.href = '/admin.html'; // Redirect to the admin page
            } else {
                window.location.href = '/user.html'; // Redirect to the user page
            }
        } else {
            const data = await response.json();
            errorMessage.textContent = data.message;
            errorMessage.style.fontSize = '16px';
        }
    } catch (error) {
        console.error('Error:', error);
    }
});
