// script.js

// 🌍 Initialize map (centered on Kenya)
const map = L.map("map").setView([-0.0236, 37.9062], 6);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 18,
}).addTo(map);

let selectedMarker = null;

// 📍 Handle map click - get coordinates and show marker
map.on("click", function (e) {
  const { lat, lng } = e.latlng;
  document.getElementById("lat").value = lat.toFixed(6);
  document.getElementById("lng").value = lng.toFixed(6);

  if (selectedMarker) {
    map.removeLayer(selectedMarker);
  }

  selectedMarker = L.marker([lat, lng]).addTo(map)
    .bindPopup(`Selected Location:<br>Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`)
    .openPopup();
});

// 🌿 Load recommendations from backend
async function loadRecommendations() {
  const res = await fetch("http://localhost:5000/api/recommendations");
  const data = await res.json();

  const container = document.getElementById("recommendations");
  container.innerHTML = "";

  data.forEach((item) => {
    const div = document.createElement("div");
    div.className = "p-4 border rounded-lg shadow hover:shadow-md transition bg-green-50";
    div.innerHTML = `
      <h4 class="text-lg font-bold text-green-800">${item.location_name}</h4>
      <p>🌱 <strong>Soil:</strong> ${item.soil_type}</p>
      <p>💧 <strong>Rainfall:</strong> ${item.rainfall}</p>
      <p>🌳 <strong>Trees:</strong> ${item.tree_species}</p>
    `;
    container.appendChild(div);

    if (item.latitude && item.longitude) {
      L.marker([item.latitude, item.longitude])
        .addTo(map)
        .bindPopup(`<b>${item.location_name}</b><br>${item.tree_species}`);
    }
  });
}

loadRecommendations();

// ➕ Add new land record
document.getElementById("landForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const location_name = document.getElementById("location").value;
  const soil_type = document.getElementById("soil").value;
  const rainfall = document.getElementById("rainfall").value;
  const tree_species = document.getElementById("trees").value;
  const latitude = document.getElementById("lat").value;
  const longitude = document.getElementById("lng").value;

  if (!latitude || !longitude) {
    alert("Please click on the map to select a location first.");
    return;
  }

  const res = await fetch("http://localhost:5000/api/lands", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ location_name, soil_type, rainfall, tree_species, latitude, longitude }),
  });

  const result = await res.json();
  alert(result.message);
  document.getElementById("landForm").reset();
  loadRecommendations();
});
