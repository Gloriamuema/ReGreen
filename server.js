// server.js
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

// ✅ MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "regreeen_db",
});

db.connect((err) => {
  if (err) throw err;
  console.log("✅ MySQL connected");
});

// 🌿 Simple AI rule-based tree recommender (you can later plug in real ML)
function getTreeRecommendation(soil, rainfall) {
  const rules = [
    { soil: "loamy", rain: "high", trees: "Prunus Africana, Croton megalocarpus, Markhamia lutea" },
    { soil: "sandy", rain: "low", trees: "Acacia tortilis, Commiphora africana, Melia volkensii" },
    { soil: "clay", rain: "moderate", trees: "Syzygium guineense, Terminalia brownie, Grevillea robusta" },
    { soil: "black cotton", rain: "moderate", trees: "Casuarina equisetifolia, Balanites aegyptiaca" },
    { soil: "red", rain: "high", trees: "Albizia coriaria, Ficus sycomorus, Croton macrostachyus" },
  ];

  const match = rules.find(
    (r) =>
      soil.toLowerCase().includes(r.soil) &&
      rainfall.toLowerCase().includes(r.rain)
  );

  return match ? match.trees : "Grevillea robusta, Acacia xanthophloea";
}

// 🌍 Fetch all land data
app.get("/api/recommendations", (req, res) => {
  const query = "SELECT * FROM land_data";
  db.query(query, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// ➕ Add new land record
app.post("/api/lands", (req, res) => {
  const { location_name, soil_type, rainfall, tree_species, latitude, longitude } = req.body;
  const query = `
    INSERT INTO land_data (location_name, soil_type, rainfall, tree_species, latitude, longitude)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.query(query, [location_name, soil_type, rainfall, tree_species, latitude, longitude], (err, result) => {
    if (err) throw err;
    res.json({ message: "New land data added successfully!" });
  });
});

// 🧠 AI endpoint: Recommend best trees via simple logic or later ML
app.post("/api/ai-recommend", (req, res) => {
  const { soil_type, rainfall } = req.body;
  const recommendation = getTreeRecommendation(soil_type, rainfall);
  res.json({ recommended_trees: recommendation });
});

// Serve frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});
