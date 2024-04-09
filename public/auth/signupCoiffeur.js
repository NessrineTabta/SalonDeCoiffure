document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signupForm');

    signupForm.addEventListener('submit', function(event) {
        event.preventDefault();

        // Get user input
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Perform basic validation
        if (!email || !password || !confirmPassword) {
            alert('Please fill in all fields.');
            return;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }

        // Send sign-up data to the server
        fetch('/registerCoiffeur', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ unEmail: email, password })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Handle successful registration
            alert('Registration successful! Please login.');
            window.location.href = './login.html'; // Redirect to the login page
        })
        .catch(error => {
            // Handle errors, e.g., display error message
            console.error('Error:', error);
            alert('Registration failed. Please try again.');
        });
    });
});
