const locationInput = document.getElementById("locationInput");
const radiusInput = document.getElementById("radiusInput");
const searchButton = document.getElementById("searchButton");

// Initialize map
const map = L.map("locationMap").setView([40.73061, -73.935242], 12); // NYC coords

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
}).addTo(map);

// Inject clinics into list and map
const resultsContainer = document.getElementById("locationResults");

const fetchFacilityLocations = async (searchLocation, radius = 50) => {
  function milesToMeters(miles) {
    return miles * 1609.344;
  }

  try {
    if (!searchLocation) {
      console.error("No Search Location provided...");
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

    const lat = geocodeData[0]?.lat;
    const lon = geocodeData[0]?.lon;

    if (!lat || !lon) {
      throw new Error("Latitude and longitude are required");
    }

    if (!radius) {
      radius = milesToMeters(50); // default to 50 if none provided
    } else {
      radius = milesToMeters(radius);
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

function formatOverpassResults(overpassJson) {
  return overpassJson?.elements.map((element) => {
    const response = element.tags || {};

    const street =
      response["addr:housenumber"] && response["addr:street"]
        ? `${response["addr:housenumber"]} ${response["addr:street"]}, ${response["addr:city"] || ""} ${response["addr:state"] || ""} ${response["addr:postcode"] || ""}`.trim()
        : "Not available";

    return {
      name: response.name,
      street,
      hours: response.opening_hours || "Not available",
      phone: response.phone || response["contact:phone"] || "Not available",
      website:
        response.website || response["contact:website"] || "Not available",
      lat: element.lat,
      lng: element.lon,
    };
  });
}

// we will need to output the data from fetchFacilityLocations and update html
// use eventListener below and update html within
searchButton.addEventListener("click", async () => {
  resultsContainer.innerHTML = `<p>Fetching Results....</p>`;
  const results = await fetchFacilityLocations(
    locationInput.value,
    radiusInput.value,
  );
  resultsContainer.innerHTML = "";

  const formattedResults = await formatOverpassResults(results);

  formattedResults.forEach((clinic) => {
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
});
