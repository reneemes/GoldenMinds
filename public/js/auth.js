// Get URL parameters
const urlParams = new URLSearchParams(window.location.search);
const formType = urlParams.get('form');

// Get elements
const loginTab = document.getElementById('loginTab');
const signupTab = document.getElementById('signupTab');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');

const loginFeedback = document.querySelector('.loginForm-feedback');
const signupFeedback = document.querySelector('.signupForm-feedback');

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
  e.preventDefault();
  
  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;
  
  try {
    const response = await fetch('/auth/signin', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      // Login successful - backend sets cookie, redirect to homepage
      window.location.href = '/homepage';
    } else {
      // Login failed - show backend error message
      console.error(data.message);
      loginFeedback.textContent = 'Invalid username or password';
      loginFeedback.style.color = 'firebrick';
    }
  } catch (error) {
    console.error('Login error:', error);
    loginFeedback.textContent = 'Something went wrong. Please try again.';
    loginFeedback.style.color = 'firebrick';
  }
});

// ---------- Handle Signup Form Submit ----------
signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const firstName = document.getElementById('signupFirstName').value;
  const username = document.getElementById('signupUsername').value;
  const password = document.getElementById('signupPassword').value;
  
  // Get selected avatar
  const profileImage = document.querySelector('input[name="profileImage"]:checked')?.value;
  
  // Check if avatar is selected
  if (!profileImage) {
    signupFeedback.textContent = 'Please select an avatar!';
    signupFeedback.style.color = 'firebrick';
    return;
  }
  
  try {
    const response = await fetch('/auth/signup', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ firstName, username, password, profileImg: profileImage })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      // Signup successful - show success and switch to login
      signupFeedback.textContent = 'Account created! Please log in.';
      signupFeedback.style.color = 'green';
      
      // Clear signup form
      document.getElementById('signupFirstName').value = '';
      document.getElementById('signupUsername').value = '';
      document.getElementById('signupPassword').value = '';
      
      // Uncheck all avatars
      document.querySelectorAll('input[name="profileImage"]').forEach(radio => {
        radio.checked = false;
      });
      
      // Switch to login tab after 1.5 seconds
      setTimeout(() => {
        showLogin();
        signupFeedback.textContent = '';
      }, 1500);
    } else {
      // Signup failed - show backend error message
      signupFeedback.textContent = data.message || 'An error occurred creating your account. Please try again.';
      signupFeedback.style.color = 'firebrick';
    }
  } catch (error) {
    console.error('Signup error:', error);
    signupFeedback.textContent = 'Something went wrong. Please try again.';
    signupFeedback.style.color = 'firebrick';
  }
});