const saveBtn = document.getElementById("saveJournalBtn");
const journalTextarea = document.getElementById("journal");
const extraSection = document.getElementById("extraSection");

saveBtn.addEventListener("click", async () => {
  const content = journalTextarea.value.trim();

  if (!content) {
    alert("Journal cannot be empty!");
    return;
  }

  try {
    const response = await fetch("/journal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        title: "My Day",
        content: content,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      alert(data.message);
      extraSection.style.display = "block";
      extraSection.innerHTML = `
        <h3>Saved Entry</h3>
        <p>${content}</p>
      `;
    } else {
      alert(data.message || data.error);
    }
  } catch (error) {
    console.error(error);
    alert("Something went wrong while saving.");
  }
});

extraSection.innerHTML = `
  <h3>Saved Entry</h3>
  <p>${content.replace(/</g, "&lt;")}</p>
`;
