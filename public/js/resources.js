const locationInput = document.getElementById("locationInput");
const radiusInput = document.getElementById("radiusInput");
const searchButton = document.getElementById("searchButton");
const resultsContainer = document.getElementById("locationResults");

// Adding Default location
const defaultLocation = {
  name: "Charlotte, NC",
  lat: 35.2271,
  lng: -80.8431,
  radius: 50,
};

// Initialize map
const map = L.map("locationMap").setView(
  [defaultLocation.lat, defaultLocation.lng],
  12,
);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
}).addTo(map);

// Convert miles to meters
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

    // Create a unique cache key
    const cacheKey = `facilities_${searchLocation.toLowerCase()}_${radius}`;

    // Check localStorage first
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

    radius = milesToMeters(radius || 50);

    // Overpass Query
    const overpassQuery = `
      [out:json][timeout:25];
      (
        node(around:${radius},${lat},${lon})["healthcare"="mental_health"];
        node(around:${radius},${lat},${lon})["amenity"="clinic"];
        node(around:${radius},${lat},${lon})["amenity"="hospital"];
      );
      out center;
    `;

    const response = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "data=" + encodeURIComponent(overpassQuery),
    });

    if (!response.ok) throw new Error(await response.text());

    const data = await response.json();

    // Save to localStorage
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
    overpassJson?.elements.map((element) => {
      const tags = element.tags || {};
      const street =
        tags["addr:housenumber"] && tags["addr:street"]
          ? `${tags["addr:housenumber"]} ${tags["addr:street"]}, ${tags["addr:city"] || ""} ${tags["addr:state"] || ""} ${tags["addr:postcode"] || ""}`.trim()
          : null;
      return {
        name: tags.name || "No Name",
        street, // null if not available
        hours: tags.opening_hours || "Not available",
        phone: tags.phone || tags["contact:phone"] || "Not available",
        website: tags.website || tags["contact:website"] || "Not available",
        lat: element.lat,
        lng: element.lon,
      };
    }) || []
  );
}

// Display facilities on map and list
async function loadAndDisplayFacilities(searchLocation, radius) {
  resultsContainer.innerHTML = `<p>Fetching Results...</p>`;
  const results = await fetchFacilityLocations(searchLocation, radius);
  resultsContainer.innerHTML = "";

  const formattedResults = formatOverpassResults(results);

  // Clear previous markers
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
    innerHTML += `<p><strong>Hours:</strong> ${clinic.hours}</p>`;
    innerHTML += `<p><strong>Phone:</strong> ${clinic.phone}</p>`;
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
  locationInput.value = defaultLocation.name;
  radiusInput.value = defaultLocation.radius;
  await loadAndDisplayFacilities(defaultLocation.name, defaultLocation.radius);
});

// Search button
searchButton.addEventListener("click", async () => {
  await loadAndDisplayFacilities(locationInput.value, radiusInput.value);
});
