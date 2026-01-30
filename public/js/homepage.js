document.addEventListener("DOMContentLoaded", () => {
  // ======= Active Emoji Button =======
  const buttons = document.querySelectorAll(".mood-btn");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  // ======= DATE LOGIC FOR AUTOMATIC CHANGE DAILY ======
  const dayNumbers = document.querySelectorAll(".day-number");
  const dayContainers = document.querySelectorAll(".day");

  const today = new Date();
  const todayIndex = today.getDay(); // 0 = Sunday, 6 = Saturday

  const sunday = new Date(today);
  sunday.setDate(today.getDate() - todayIndex);

  dayNumbers.forEach((span, index) => {
    const currentDay = new Date(sunday);
    currentDay.setDate(sunday.getDate() + index);

    span.textContent = currentDay.getDate();

    // Highlight today
    if (index === todayIndex && dayContainers[index]) {
      dayContainers[index].classList.add("today");
    }
  });
});
