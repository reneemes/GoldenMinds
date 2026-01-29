// Get URL parameters
const urlParams = new URLSearchParams(window.location.search);
const formType = urlParams.get('form');

// Get elements
const loginTab = document.getElementById('loginTab');
const signupTab = document.getElementById('signupTab');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');

// Show correct form based on URL
if (formType === 'signup') {
  showSignup();
} else {
  showLogin();
}

// Function to show login
function showLogin() {
  loginForm.classList.remove('hidden');
  signupForm.classList.add('hidden');
  loginTab.classList.add('active');
  signupTab.classList.remove('active');
}

// Function to show signup
function showSignup() {
  signupForm.classList.remove('hidden');
  loginForm.classList.add('hidden');
  signupTab.classList.add('active');
  loginTab.classList.remove('active');
}

// Tab click handlers
loginTab.addEventListener('click', showLogin);
signupTab.addEventListener('click', showSignup);

// ---------- Handle Login Form Submit ----------
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault(); // Stop default form submission
  
  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;
  
  try {
    // Send to backend
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });
    
    const data = await response.json();
    
    if (data.success) {
      // Login successful - go to homepage
      window.location.href = '/homepage';
    } else {
      // Login failed - show error
      alert(data.message || 'Invalid username or password');
    }
  } catch (error) {
    console.error('Login error:', error);
    alert('Something went wrong. Please try again.');
  }
});

// ---------- Handle Signup Form Submit ----------
signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const firstName = document.getElementById('signupFirstName').value;
  const username = document.getElementById('signupUsername').value;
  const password = document.getElementById('signupPassword').value;
  
  try {
    // Send to backend
    const response = await fetch('/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ firstName, username, password })
    });
    
    const data = await response.json();
    
    if (data.success) {
      // Signup successful - show login form
      alert('Account created! Please log in.');
      
      // Clear signup form
      document.getElementById('signupFirstName').value = '';
      document.getElementById('signupUsername').value = '';
      document.getElementById('signupPassword').value = '';
      
      // Switch to login tab
      showLogin();
    } else {
      // Signup failed - show error
      alert(data.message || 'Could not create account');
    }
  } catch (error) {
    console.error('Signup error:', error);
    alert('Something went wrong. Please try again.');
  }
});