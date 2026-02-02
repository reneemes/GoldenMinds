async function geocode(req, res) {
  try {
    const { location } = req.query;

    if (!location) {
      return res.status(400).json({ error: "Location is required" });
    }

    const url = `https://geocode.maps.co/search?q=${encodeURIComponent(
      location,
    )}&api_key=${process.env.GEOLOCATION_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Geocoding failed" });
  }
}

module.exports = { geocode };
