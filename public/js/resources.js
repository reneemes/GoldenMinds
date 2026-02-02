// Initialize map
const map = L.map("locationMap").setView([40.73061, -73.935242], 12); // NYC coords

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
}).addTo(map);

// Fake clinic data
const clinics = [
  {
    name: "Clinic One",
    street: "123 Main St, NYC",
    hours: "9am - 5pm",
    phone: "123-456-7890",
    website: "https://clinicone.example.com",
    lat: 40.735,
    lng: -73.935,
  },
  {
    name: "Clinic Two",
    street: "456 Elm St, NYC",
    hours: "10am - 6pm",
    phone: "987-654-3210",
    website: "https://clinictwo.example.com",
    lat: 40.74,
    lng: -73.94,
  },
  {
    name: "Clinic Three",
    street: "789 Oak Ave, NYC",
    hours: "8am - 4pm",
    phone: "555-123-4567",
    website: "https://clinicthree.example.com",
    lat: 40.728,
    lng: -73.92,
  },

  {
    name: "Clinic Three",
    street: "789 Oak Ave, NYC",
    hours: "8am - 4pm",
    phone: "555-123-4567",
    website: "https://clinicthree.example.com",
    lat: 40.728,
    lng: -73.92,
  },
];

// Inject clinics into list and map
const resultsContainer = document.getElementById("locationResults");

clinics.forEach((clinic) => {
  // Map marker
  const marker = L.marker([clinic.lat, clinic.lng])
    .addTo(map)
    .bindPopup(`<b>${clinic.name}</b><br>${clinic.street}`);

  // List card
  const div = document.createElement("div");
  div.className = "location";
  div.innerHTML = `
    <h3>${clinic.name}</h3>
    <p><strong>Street:</strong> ${clinic.street}</p>
    <p><strong>Hours:</strong> ${clinic.hours}</p>
    <p><strong>Phone:</strong> ${clinic.phone}</p>
    <p><strong>Website:</strong> <a href="${clinic.website}" target="_blank">${clinic.website}</a></p>
  `;

  // Clicking a list item centers map on marker
  div.addEventListener("click", () => {
    map.setView([clinic.lat, clinic.lng], 15);
    marker.openPopup();
  });

  resultsContainer.appendChild(div);
});
// update these with proper html ids
// const locationInput = document.getElementById("locationInput");
// const searchButton = document.getElementById("locationSearchButton");
// const radiusInput = document.getElementById("radiusInput");
// const locationsSection = document.getElementById("location-result-section");

const fetchFacilityLocations = async (searchLocation, radius = 50) => {
  try {
    if (!searchLocation) {
      console.error("No Search Location provided...");
    }

    if (!radius) {
      radius = 50; // default to 50 if none provided
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

    if (!geocodeResult.ok) {
      throw new Error("Geolocation API error");
    }

    const geocodeData = await geocodeResult.json();
    console.log(geocodeData);
    const lat = geocodeData[0]?.lat;
    const lon = geocodeData[0]?.lon;

    if (!lat || !lon) {
      throw new Error("Latitude and longitude are required");
    }

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

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }

    const data = await response.json();

    // Save to localStorage
    localStorage.setItem(cacheKey, JSON.stringify(data));

    return data;
  } catch (err) {
    console.log(err);
    console.error("Error has occurred:", err.message);
  }
};

// we will need to output the data from fetchFacilityLocations and update html
// use eventListener below and update html within
