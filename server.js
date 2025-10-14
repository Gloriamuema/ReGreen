// server.js
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname)); // serve frontend files

// ✅ MySQL Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root", // change if different
  password: "", // your password
  database: "regreeen_db"
});

db.connect(err => {
  if (err) throw err;
  console.log("✅ MySQL connected");
});

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

// Serve frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(5000, () => {
  console.log("🚀 Server running at http://localhost:5000");
});
