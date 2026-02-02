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

// const signupForm = document.getElementById("signupForm");

//   signupForm.addEventListener("submit", async (e) => {
//     e.preventDefault(); // Prevent the form from reloading the page

//     const username = document.getElementById("signupUsername").value;
//     const password = document.getElementById("signupPassword").value;

//     try {
//       const response = await fetch("/auth/signup", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ firstName: 'Renee', username, password }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         // Signup successful
//         alert("Signup successful!");
//         // You can redirect user or hide the form
//         // window.location.href = "/dashboard";
//       } else {
//         // Signup failed
//         alert(data.message || "Signup failed.");
//       }
//     } catch (err) {
//       console.error("Signup error:", err);
//       alert("Something went wrong. Please try again.");
//     }
//   });
// // const signinForm = document.getElementById("signinForm");

// loginForm.addEventListener("submit", async (e) => {
//   e.preventDefault();

//   const username = document.getElementById("loginUsername").value;
//   const password = document.getElementById("loginPassword").value;

//   try {
//     const response = await fetch("/auth/signin", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ username, password })
//     });

//     const data = await response.json();

//     if (response.ok) {
//       alert("Signin successful!");
//       window.location.href = "/homepage"; // redirect after successful login
//     } else {
//       alert(data.message || "Signin failed.");
//     }
//   } catch (err) {
//     console.error("Signin error:", err);
//     alert("Something went wrong. Please try again.");
//   }
// });