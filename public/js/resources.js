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
