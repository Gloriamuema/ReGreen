// --- Leaflet Map for Analysis ---
const map = L.map('map').setView([0.0236, 37.9062], 6); // Default Kenya
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

let marker;
map.on('click', function (e) {
  const { lat, lng } = e.latlng;
  document.getElementById("lat").value = lat.toFixed(5);
  document.getElementById("lng").value = lng.toFixed(5);
  if (marker) map.removeLayer(marker);
  marker = L.marker([lat, lng]).addTo(map);
});

// --- GIS Map for Insights ---
const gisMap = L.map('gis-map').setView([0.0236, 37.9062], 6);
L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap'
}).addTo(gisMap);

// --- Tab Navigation ---
const tabs = document.querySelectorAll(".tab-btn");
const contents = document.querySelectorAll(".tab-content");

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active", "bg-green-600", "text-white"));
    tab.classList.add("active", "bg-green-600", "text-white");
    contents.forEach(c => c.classList.add("hidden"));
    document.getElementById(tab.dataset.tab).classList.remove("hidden");
  });
});

// --- AI Recommendation API Call ---
document.getElementById("aiBtn").addEventListener("click", async () => {
  const soil_type = document.getElementById("soil").value;
  const rainfall = document.getElementById("rainfall").value;
  const latitude = document.getElementById("lat").value;
  const longitude = document.getElementById("lng").value;

  if (!soil_type || !rainfall || !latitude || !longitude) {
    alert("Please fill in all fields before analysis.");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/ai-recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ soil_type, rainfall, latitude, longitude }),
    });

    const data = await res.json();
    if (data.recommended_trees) {
      document.getElementById("trees").value = data.recommended_trees;
      alert("✅ Analysis complete! Check the Recommendations tab.");
    } else {
      alert("❌ Unable to get recommendation. Check your backend or API key.");
    }
  } catch (err) {
    console.error("Error:", err);
    alert("⚠️ Could not connect to backend. Ensure the server is running.");
  }
});

// --- Charts for Dashboard ---
const rainCtx = document.getElementById('rainChart').getContext('2d');
new Chart(rainCtx, {
  type: 'bar',
  data: {
    labels: ['Nairobi', 'Mombasa', 'Kisumu', 'Eldoret', 'Nakuru'],
    datasets: [{
      label: 'Average Rainfall (mm)',
      data: [890, 1200, 1450, 1300, 1100],
    }]
  }
});

const soilCtx = document.getElementById('soilChart').getContext('2d');
new Chart(soilCtx, {
  type: 'pie',
  data: {
    labels: ['Clay', 'Loam', 'Sandy', 'Silt'],
    datasets: [{
      label: 'Soil Type Distribution',
      data: [35, 40, 15, 10],
    }]
  }
});
