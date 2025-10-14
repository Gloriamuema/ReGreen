// script.js

// 🌍 Initialize the map (centered on Kenya)
const map = L.map("map").setView([-0.0236, 37.9062], 6);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 18,
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

let selectedMarker = null;

// 📍 Capture user click on map to get coordinates
map.on("click", function (e) {
  const { lat, lng } = e.latlng;
  document.getElementById("lat").value = lat.toFixed(6);
  document.getElementById("lng").value = lng.toFixed(6);

  if (selectedMarker) {
    map.removeLayer(selectedMarker);
  }

  selectedMarker = L.marker([lat, lng])
    .addTo(map)
    .bindPopup(`📍 Selected Location<br>${lat.toFixed(4)}, ${lng.toFixed(4)}`)
    .openPopup();
});

// 🌿 Load saved land data and show on map + dashboard
async function loadRecommendations() {
  try {
    const res = await fetch("http://localhost:5000/api/recommendations");
    const data = await res.json();

    const container = document.getElementById("recommendations");
    container.innerHTML = "";

    data.forEach((item) => {
      // Create info cards
      const div = document.createElement("div");
      div.className =
        "p-4 border rounded-lg shadow hover:shadow-md transition bg-green-50";
      div.innerHTML = `
        <h4 class="text-lg font-bold text-green-800">${item.location_name}</h4>
        <p>🌱 <b>Soil:</b> ${item.soil_type}</p>
        <p>💧 <b>Rainfall:</b> ${item.rainfall}</p>
        <p>🌳 <b>Trees:</b> ${item.tree_species}</p>
      `;
      container.appendChild(div);

      // Add markers to map
      if (item.latitude && item.longitude) {
        L.marker([item.latitude, item.longitude])
          .addTo(map)
          .bindPopup(
            `<b>${item.location_name}</b><br>🌱 ${item.soil_type}<br>🌳 ${item.tree_species}`
          );
      }
    });
  } catch (error) {
    console.error("Error loading data:", error);
  }
}

// Load data on startup
loadRecommendations();

// 🧠 AI Recommendation (now includes lat/lng)
document.getElementById("aiBtn").addEventListener("click", async () => {
  const soil_type = document.getElementById("soil").value;
  const rainfall = document.getElementById("rainfall").value;
  const latitude = document.getElementById("lat").value;
  const longitude = document.getElementById("lng").value;

  if (!soil_type || !rainfall) {
    alert("Please enter soil type and rainfall first.");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/ai-recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ soil_type, rainfall, latitude, longitude }),
    });

    const data = await res.json();

    // Fill recommended tree list into input field
    document.getElementById("trees").value = data.recommended_trees;

    // Show toast or alert with recommendation
    alert(`🌳 AI Recommended Trees: ${data.recommended_trees}`);
  } catch (error) {
    console.error("AI recommendation error:", error);
    alert("Failed to fetch AI recommendation. Please check server.");
  }
});

// ➕ Save new land record
document
  .getElementById("landForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const body = {
      location_name: document.getElementById("location").value,
      soil_type: document.getElementById("soil").value,
      rainfall: document.getElementById("rainfall").value,
      tree_species: document.getElementById("trees").value,
      latitude: document.getElementById("lat").value,
      longitude: document.getElementById("lng").value,
    };

    try {
      const res = await fetch("http://localhost:5000/api/lands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const result = await res.json();
      alert(result.message);

      // Reset form and reload data
      document.getElementById("landForm").reset();
      loadRecommendations();
    } catch (error) {
      console.error("Error saving land data:", error);
      alert("Error saving data. Check connection or backend.");
    }
  });
// server.js