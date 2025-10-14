// script.js

// 🌍 Initialize map
const map = L.map("map").setView([-0.0236, 37.9062], 6);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 18 }).addTo(map);

let selectedMarker = null;

// 📍 Map click
map.on("click", function (e) {
  const { lat, lng } = e.latlng;
  document.getElementById("lat").value = lat.toFixed(6);
  document.getElementById("lng").value = lng.toFixed(6);

  if (selectedMarker) map.removeLayer(selectedMarker);
  selectedMarker = L.marker([lat, lng]).addTo(map)
    .bindPopup(`Selected:<br>${lat.toFixed(4)}, ${lng.toFixed(4)}`)
    .openPopup();
});

// 🌿 Load data
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
      <p>🌱 Soil: ${item.soil_type}</p>
      <p>💧 Rainfall: ${item.rainfall}</p>
      <p>🌳 Trees: ${item.tree_species}</p>
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
// 🧠 AI Recommendation
document.getElementById("aiBtn").addEventListener("click", async () => {
  const soil_type = document.getElementById("soil").value;
  const rainfall = document.getElementById("rainfall").value;
  const latitude = document.getElementById("lat").value;
  const longitude = document.getElementById("lng").value;

  if (!soil_type || !rainfall) {
    alert("Please enter soil type and rainfall first.");
    return;
  }

  const res = await fetch("http://localhost:5000/api/ai-recommend", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ soil_type, rainfall, latitude, longitude }),
  });

  const data = await res.json();
  document.getElementById("trees").value = data.recommended_trees;
});


// ➕ Save data
document.getElementById("landForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const body = {
    location_name: document.getElementById("location").value,
    soil_type: document.getElementById("soil").value,
    rainfall: document.getElementById("rainfall").value,
    tree_species: document.getElementById("trees").value,
    latitude: document.getElementById("lat").value,
    longitude: document.getElementById("lng").value,
  };

  const res = await fetch("http://localhost:5000/api/lands", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const result = await res.json();
  alert(result.message);
  document.getElementById("landForm").reset();
  loadRecommendations();
});
