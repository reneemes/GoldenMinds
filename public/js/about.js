const form = document.querySelector(".contact-form");
const sentMessage = form.querySelector(".contact-form__feedback");
const characterOutput = document.querySelector("#character-output");
// Logout Button
const signoutBtn = document.querySelector(".signout-btn");
signoutBtn.addEventListener("click", logout);

const nameInput = form.name;
const emailInput = form.email;
const messageInput = form.message;
const reasonSelect = form.reason;

characterOutput.textContent = "0 / 500";

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!validateForm()) return;

    try {
      const response = await fetch("/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          name: nameInput.value, 
          email: emailInput.value, 
          message: messageInput.value, 
          reason: reasonSelect.value
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Server error");
      }

      sentMessage.textContent = "Thank you for reaching out! We will get back with you shortly.";
      characterOutput.textContent = "0 / 500";
      form.reset();
    } catch (error) {
      console.error("Submission error:", error);
      sentMessage.textContent = "Something went wrong. Please try again later.";
    }
})

messageInput.addEventListener("input", (e) => {
  const currentLength = messageInput.value.length;
  characterOutput.textContent = `${currentLength} / 500`;
})

function validateForm() {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (
    nameInput.value == "" ||
    emailInput.value == "" ||
    !regex.test(emailInput.value) ||
    messageInput.value == "" ||
    reasonSelect.value == ""
  ) {
    sentMessage.textContent = "Please fill out all required forms.";
    sentMessage.style.color = "firebrick";
    return false;
  } else {
    return true;
  }
}

async function logout(e) {
  e.preventDefault();

  await fetch("/auth/signout", {
    method: "POST",
    credentials: "include",
  });
  window.location.href = "/";
}