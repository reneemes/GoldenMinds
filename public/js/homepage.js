const signoutBtn = document.querySelector(".signout-btn");
signoutBtn.addEventListener("click", logout);
let currentRange = "week";

// DOM READY
document.addEventListener("DOMContentLoaded", () => {
  // ======= Active Emoji Button =======
  const buttons = document.querySelectorAll(".mood-btn");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const mood = btn.dataset.mood;
      saveMood(mood)
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

  // FETCH MOODS ON PAGE LOAD
  fetchMoods(currentRange);

  const rangeBtns = document.querySelectorAll("button[data-range]");
  rangeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      currentRange = btn.dataset.range;
      fetchMoods(currentRange);
    })
  })
});

// GOOGLE CHART
google.charts.load("current", { packages: ["corechart"] });

function drawChart(moods, range = "week") {
  range = range[0].toUpperCase() + range.slice(1);
  const data = google.visualization.arrayToDataTable(formatChartData(moods));

  const options = {
    title: `Mood Trends Over the Past ${range}`,
    legend: "none",
  };
  const chart = new google.visualization.ColumnChart(
    document.getElementById("myChart"),
  );
  chart.draw(data, options);
}

// FETCH MOODS ON PAGE LOAD
async function fetchMoods(range) {
  if (range == undefined) range = "week"
  try {
    const response = await fetch(`/mood?range=${range}`, {
      credentials: "include",
    });

    const data = await response.json();

    if (response.ok) {
      drawChart(data.moods, range);
    }
  } catch (error) {
    console.error('Mood fetch error:', error);
  }
}

function formatChartData(moods = []) {
  const counts = moods
    .filter(item => item && item.mood)
    .reduce((acc, { mood }) => {
      acc[mood] = (acc[mood] || 0) + 1;
      return acc;
    }, {});

  const moodColors = {
    happy: "#fff1b8",
    sad: "#e8f1ff",
    angry: "#ffe2e2",
    anxious: "#fff0d9",
    excited: "#e6f9ef",
    tired: "#f0e9ff",
    calm: "#e9f8ff",
    stressed: "#fde8f0",
  };

  return [
    ["Mood", "Mood Count", { role: "style" }],
    ...Object.entries(counts).map(([mood, count]) => [
      mood[0].toUpperCase() + mood.slice(1),
      count, moodColors[mood]
    ])
  ];
}

async function saveMood(mood) {
  try {
    const response = await fetch("/mood", {
      method: "POST",
      credentials: "include",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ mood }),
    });

    if (response.ok) {
      fetchMoods(currentRange);
    }
  } catch (error) {
    console.error('Mood save error:', error);
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
