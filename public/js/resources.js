const locationInput = document.getElementById("locationInput");
const radiusInput = document.getElementById("radiusInput");
const searchButton = document.getElementById("searchButton");
const resultsContainer = document.getElementById("locationResults");

// Logout Button
const signoutBtn = document.querySelector(".signout-btn");
signoutBtn.addEventListener("click", logout);

// Modal
const modal = document.getElementById("infoModal");

// Adding Default location
const defaultLocation = {
  name: "Charlotte, NC",
  lat: 35.2271,
  lng: -80.8431,
  radius: 50, // miles
};

// Initialize map
const map = L.map("locationMap").setView(
  [defaultLocation.lat, defaultLocation.lng],
  12,
);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
}).addTo(map);

// Convert miles to meters (Overpass requires meters)
function milesToMeters(miles) {
  return miles * 1609.344;
}

// Fetch facility locations
const fetchFacilityLocations = async (searchLocation, radius = 50) => {
  try {
    if (!searchLocation) {
      console.error("No Search Location provided...");
      return [];
    }

    const cacheKey = `facilities_${searchLocation.toLowerCase()}_${radius}`;

    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
      console.log("Using cached facility data");
      return JSON.parse(cachedData);
    }

    console.log("Fetching fresh facility data");

    const geocodeResult = await fetch(
      `/api/geocode?location=${encodeURIComponent(searchLocation)}`,
    );
    if (!geocodeResult.ok) throw new Error("Geolocation API error");

    const geocodeData = await geocodeResult.json();
    const lat = geocodeData[0]?.lat;
    const lon = geocodeData[0]?.lon;
    if (!lat || !lon) throw new Error("Latitude and longitude are required");

    // Convert miles → meters
    radius = milesToMeters(radius || 50);

    // 🔹 Mental wellness Overpass query (FIXED)
    const overpassQuery = `
[out:json][timeout:25];
(
  node(around:${radius},${lat},${lon})["amenity"="mental_health_clinic"];
  node(around:${radius},${lat},${lon})["healthcare"="mental_health"];
  node(around:${radius},${lat},${lon})["healthcare"="psychotherapist"];
  node(around:${radius},${lat},${lon})["healthcare"="psychiatrist"];
  node(around:${radius},${lat},${lon})["healthcare"="counselling"];
);
out body;
`;

    const response = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "data=" + encodeURIComponent(overpassQuery),
    });

    if (!response.ok) throw new Error(await response.text());

    const data = await response.json();
    localStorage.setItem(cacheKey, JSON.stringify(data));
    return data;
  } catch (err) {
    console.error("Error occurred:", err.message);
    return [];
  }
};

// Format Overpass API results
function formatOverpassResults(overpassJson) {
  return (
    overpassJson?.elements
      .map((element) => {
        const tags = element.tags || {};

        const street =
          tags["addr:housenumber"] && tags["addr:street"]
            ? `${tags["addr:housenumber"]} ${tags["addr:street"]}, ${tags["addr:city"] || ""} ${tags["addr:state"] || ""} ${tags["addr:postcode"] || ""}`.trim()
            : null;

        const hours = tags.opening_hours || null;

        return {
          name: tags.name || "No Name",
          street,
          hours,
          phone: tags.phone || tags["contact:phone"] || null,
          website: tags.website || tags["contact:website"] || null,
          lat: element.lat,
          lng: element.lon,
        };
      })
      // 🔹 FIX: Do not filter out valid clinics with no hours
      .filter((clinic) => clinic.street) || []
  );
}

// Display facilities on map and list
async function loadAndDisplayFacilities(searchLocation, radius) {
  resultsContainer.innerHTML = `<p>Fetching Results...</p>`;
  const results = await fetchFacilityLocations(searchLocation, radius);
  resultsContainer.innerHTML = "";

  const formattedResults = formatOverpassResults(results);

  if (window.currentMarkers)
    window.currentMarkers.forEach((m) => map.removeLayer(m));
  window.currentMarkers = [];

  formattedResults.forEach((clinic) => {
    const marker = L.marker([clinic.lat, clinic.lng])
      .addTo(map)
      .bindPopup(
        `<b>${clinic.name}</b>${clinic.street ? "<br>" + clinic.street : ""}`,
      );

    window.currentMarkers.push(marker);

    const div = document.createElement("div");
    div.className = "location";

    let innerHTML = `<h3>${clinic.name}</h3>`;
    if (clinic.street)
      innerHTML += `<p><strong>Street:</strong> ${clinic.street}</p>`;
    if (clinic.hours)
      innerHTML += `<p><strong>Hours:</strong> ${clinic.hours}</p>`;
    if (clinic.phone)
      innerHTML += `<p><strong>Phone:</strong> ${clinic.phone}</p>`;
    if (clinic.website)
      innerHTML += `<p><strong>Website:</strong> <a href="${clinic.website}" target="_blank">${clinic.website}</a></p>`;

    div.innerHTML = innerHTML;

    div.addEventListener("click", () => {
      map.setView([clinic.lat, clinic.lng], 15);
      marker.openPopup();
    });

    resultsContainer.appendChild(div);
  });

  if (formattedResults[0]) {
    map.setView([formattedResults[0].lat, formattedResults[0].lng], 12);
  }
}

// Initial load for Charlotte
window.addEventListener("DOMContentLoaded", async () => {
  locationInput.value = "";
  radiusInput.value = defaultLocation.radius;
  await loadAndDisplayFacilities(defaultLocation.name, defaultLocation.radius);
});

// Search button
searchButton.addEventListener("click", async () => {
  await loadAndDisplayFacilities(locationInput.value, radiusInput.value);
});

/* ==== SHOW MESSAGE MODAL ==== */
function openModal() {
  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modal.classList.add("hidden");
  document.body.style.overflow = "";
}

modal.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("modal__backdrop") ||
    e.target.classList.contains("modal__close-btn")
  ) {
    closeModal();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

async function logout(e) {
  e.preventDefault();

  await fetch("/auth/signout", {
    method: "POST",
    credentials: "include",
  });

  window.location.href = "/";
}
