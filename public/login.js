document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();

        // Get user input
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Perform basic validation
        if (!email || !password) {
            alert('Please enter both email and password.');
            return;
        }

        // Send login credentials to the server
        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Handle successful login
            // For example, you can store the token in local storage and redirect the user
            localStorage.setItem('token', data.token);
            alert('Login successful! Welcome, ' + email);
            window.location.href = './page.html'; // Redirect to the home page
        })
        .catch(error => {
            // Handle errors, e.g., display error message
            console.error('Error:', error);
            alert('Login failed. Please try again.');
        });
    });
});
