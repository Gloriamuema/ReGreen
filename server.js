// server.js
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "regreeen_db",
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err);
    return;
  }
  console.log("✅ Connected to MySQL database!");
});

// ✅ Route: Save new land data
app.post("/api/lands", (req, res) => {
  const { location_name, soil_type, rainfall, tree_species, latitude, longitude } = req.body;
  const sql =
    "INSERT INTO lands (location_name, soil_type, rainfall, tree_species, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(sql, [location_name, soil_type, rainfall, tree_species, latitude, longitude], (err) => {
    if (err) {
      console.error("❌ Error inserting data:", err);
      res.status(500).json({ error: err });
    } else {
      res.json({ message: "✅ Land data saved successfully!" });
    }
  });
});

// ✅ Route: Get all land recommendations
app.get("/api/recommendations", (req, res) => {
  db.query("SELECT * FROM lands", (err, results) => {
    if (err) {
      console.error("❌ Error fetching data:", err);
      res.status(500).json({ error: err });
    } else {
      res.json(results);
    }
  });
});

// ✅ AI Suggestion Endpoint (mocked intelligence)
app.post("/api/ai-recommend", (req, res) => {
  const { soil_type, rainfall, latitude, longitude } = req.body;
  console.log("📩 AI request received:", { soil_type, rainfall, latitude, longitude });

  if (!soil_type || !rainfall) {
    return res.status(400).json({ error: "Soil type and rainfall are required" });
  }

  // 🌿 Simple AI logic (you can replace with real ML API later)
  let recommended_trees = "Acacia, Croton, or Neem";

  if (soil_type.toLowerCase().includes("clay") && rainfall > 800)
    recommended_trees = "Bamboo, Mangrove, or Palm";
  else if (soil_type.toLowerCase().includes("sandy"))
    recommended_trees = "Casuarina, Coconut, or Acacia";
  else if (soil_type.toLowerCase().includes("loam"))
    recommended_trees = "Grevillea, Eucalyptus, or Mango";

  // Return AI result
  res.json({ recommended_trees });
});

// ✅ Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
