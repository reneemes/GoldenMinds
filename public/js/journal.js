// GOOGLE CHART
google.charts.load("current", { packages: ["corechart"] });
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
  const data = google.visualization.arrayToDataTable([
    ["Mood", "Mood Count", { role: "style" }],
    ["Happy", 55, "#fff1b8"],
    ["Sad", 49, "#e8f1ff"],
    ["Angry", 44, "#ffe2e2"],
    ["Anxious", 24, "#fff0d9"],
    ["Excited", 15, "#e6f9ef"],
    ["Tired", 15, "#f0e9ff"],
    ["Calm", 5, "#e9f8ff"],
    ["Stressed", 50, "#fde8f0"],
  ]);

  const options = {
    title: "Mood Trends Over the Past Year",
    legend: "none",
  };
  const chart = new google.visualization.ColumnChart(
    document.getElementById("myChart"),
  );
  chart.draw(data, options);
}
