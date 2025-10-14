// server.js
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ Connect to MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",      // change if you use another username
  password: "",       // your MySQL password
  database: "regreeen_db"
});

db.connect(err => {
  if (err) throw err;
  console.log("✅ MySQL connected");
});

// 🌍 Route: Get reforestation recommendations
app.get("/api/recommendations", (req, res) => {
  const query = "SELECT * FROM land_data";
  db.query(query, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// 🌳 Route: Add new land record
app.post("/api/lands", (req, res) => {
  const { location_name, soil_type, rainfall, tree_species } = req.body;
  const query = "INSERT INTO land_data (location_name, soil_type, rainfall, tree_species) VALUES (?, ?, ?, ?)";
  db.query(query, [location_name, soil_type, rainfall, tree_species], (err, result) => {
    if (err) throw err;
    res.json({ message: "New land data added successfully!" });
  });
});

app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});
