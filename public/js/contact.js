document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
    const nameInput = form.name;
    const emailInput = form.email;
    const messageInput = form.message;
///         live validation for the user       ///
nameInput.addEventListener("input", () => {
  validateText(nameInput);
});
messageInput.addEventListener("input", () => {
  validateText(messageInput);
});
emailInput.addEventListener("input", () => {
  validateEmailInput(emailInput);
});
////////        validating when leaving the input field     /////
[nameInput, emailInput, messageInput].forEach(input => {
  input.addEventListener("blur", () => {
    if (input.value.trim()) {
      input.classList.add("success");
      input.classList.remove("error");
    }
  });
});
//////////////          submit validation       ///////
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const isNameValid = validateText(nameInput);
  const isEmailValid = validateEmailInput(emailInput);
  const isMessageValid = validateText(messageInput);

  if (!isNameValid || !isEmailValid || !isMessageValid) {
    alert("Please fix the highlighted fields.");
    return;
  }
  // MAKE MODEL
  // alert("Thank you! Your message has been submitted.");
  form.reset();
  clearStyles();
  });
});

//  Helper Functions ///
function validateText(input) {
  if (!input.value.trim()) {
    input.classList.add("error");
    input.classList.remove("success");
    return false;
  }
  return true;
}

function validateEmailInput(input) {
  if (!validateEmail(input.value.trim())) {
    input.classList.add("error");
    input.classList.remove("success");
    return false;
  }
  return true;
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function clearStyles() {
  document
    .querySelectorAll(".error, .success")
    .forEach(el => el.classList.remove("error", "success"));
}
