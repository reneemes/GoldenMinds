const journalForm = document.getElementById("journalForm");
const journalHistory = document.getElementById("journalHistory");
const titleInput = document.getElementById("journalTitle");
const contentInput = document.getElementById("journal");

/* ==== JOURNAL DATE ==== */
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/* ==== FETCH ALL JOURALS ==== */
async function fetchJournals() {
  try {
    const res = await fetch("/journal", {
      credentials: "include",
    });

    if (!res.ok) throw new Error("Unauthorized");

    const data = await res.json();
    renderJournalHistory(data.journalEntries);
  } catch (err) {
    console.error(err);
  }
}

/* ==== SHOW HISTORY ===== */
function renderJournalHistory(entries) {
  journalHistory.innerHTML = `<label>Journal History</label>`;

  if (!entries.length) {
    journalHistory.innerHTML += `<p>No journal entries yet.</p>`;
    return;
  }

  entries.forEach((entry) => {
    const el = document.createElement("div");
    el.className = "journal-entry";

    el.innerHTML = `
      <div class="journal-entry-header">
        <h4>${entry.title}</h4>
        <span class="journal-date">${formatDate(entry.created_at)}</span>
      </div>
      <p>${entry.content || entry.body}</p>
      <div class="journal-actions">
        <button class="delete-btn" data-id="${entry.id}">Delete</button>
      </div>
    `;

    journalHistory.appendChild(el);
  });
}

/* ==== CREATION ENTRY ==== */
journalForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = titleInput.value.trim();
  const content = contentInput.value.trim();
  if (!title || !content) return;

  try {
    const res = await fetch("/journal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ title, content }),
    });

    if (!res.ok) throw new Error("Failed to save");

    titleInput.value = "";
    contentInput.value = "";
    fetchJournals();
  } catch (err) {
    console.error(err);
  }
});

/* ==== DELETE ENTRY ==== */
journalHistory.addEventListener("click", async (e) => {
  if (!e.target.classList.contains("delete-btn")) return;

  const id = e.target.dataset.id;

  try {
    const res = await fetch(`/journal/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) throw new Error("Delete failed");

    fetchJournals();
  } catch (err) {
    console.error(err);
  }
});

/* CALL TO fetchJournal */
fetchJournals();

