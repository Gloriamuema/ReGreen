// script.js

// 🌍 Initialize map
const map = L.map("map").setView([-1.286389, 36.817223], 7); // Kenya default

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 18,
}).addTo(map);

// 📊 Load recommendations
async function loadRecommendations() {
  const res = await fetch("http://localhost:5000/api/recommendations");
  const data = await res.json();

  const container = document.getElementById("recommendations");
  container.innerHTML = "";

  data.forEach((item) => {
    const div = document.createElement("div");
    div.className =
      "p-4 border rounded-lg shadow hover:shadow-md transition bg-green-50";
    div.innerHTML = `
      <h4 class="text-lg font-bold text-green-800">${item.location_name}</h4>
      <p>🌱 <strong>Soil:</strong> ${item.soil_type}</p>
      <p>💧 <strong>Rainfall:</strong> ${item.rainfall}</p>
      <p>🌳 <strong>Native Trees:</strong> ${item.tree_species}</p>
    `;
    container.appendChild(div);

    // Add marker on map
    L.marker([-1.286389 + Math.random(), 36.817223 + Math.random()])
      .addTo(map)
      .bindPopup(`<b>${item.location_name}</b><br>${item.tree_species}`);
  });
}

loadRecommendations();

// ➕ Add new land data
document.getElementById("landForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const location_name = document.getElementById("location").value;
  const soil_type = document.getElementById("soil").value;
  const rainfall = document.getElementById("rainfall").value;
  const tree_species = document.getElementById("trees").value;

  const res = await fetch("http://localhost:5000/api/lands", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ location_name, soil_type, rainfall, tree_species }),
  });

  const result = await res.json();
  alert(result.message);
  loadRecommendations();
});
// server.js