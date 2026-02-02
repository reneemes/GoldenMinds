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
