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
  
      // Dummy example: Log the email and password
      console.log('Email:', email);
      console.log('Password:', password);
  
      // Here you can perform further validation or send data to the server
      // For example, using fetch or XMLHttpRequest to send the data to a server endpoint
  
      // Dummy example: Simulate a successful login
      simulateLogin(email);
    });
  
    // Dummy function to simulate a successful login
    function simulateLogin(email) {
      // Simulate a delay to mimic server communication
      setTimeout(() => {
        alert('Login successful! Welcome, ' + email);
        // Redirect the user to the home page or any other page
        window.location.href = './page.html';
      }, 1000); // Adjust the delay time as needed
    }
  });
  