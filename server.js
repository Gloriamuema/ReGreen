// server.js
import express from "express";
import mysql from "mysql2";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import dotenv from "dotenv";
import axios from "axios";
import OpenAI from "openai";

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.resolve()));

// ✅ MySQL setup
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

// 🌿 AI Client setup
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// AI recommendation using OpenAI API
async function getTreeRecommendationAI(soil, rainfall, lat, lng) {
  const prompt = `
You are an expert environmental AI for Kenya reforestation.
Suggest the most suitable native tree species for reforestation
based on the following inputs:

Soil Type: ${soil}
Rainfall: ${rainfall}
Latitude: ${lat}
Longitude: ${lng}

Output only a short comma-separated list of native species.
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const answer = response.choices[0].message.content.trim();
    return answer || "Grevillea robusta, Croton megalocarpus, Acacia xanthophloea";
  } catch (error) {
    console.error("AI API error:", error);
    return "Grevillea robusta, Acacia xanthophloea";
  }
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

// 🧠 AI Recommendation endpoint
app.post("/api/ai-recommend", async (req, res) => {
  const { soil_type, rainfall, latitude, longitude } = req.body;
  const trees = await getTreeRecommendationAI(soil_type, rainfall, latitude, longitude);
  res.json({ recommended_trees: trees });
});

// Serve frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(path.resolve(), "index.html"));
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`🚀 Server running at http://localhost:${process.env.PORT || 5000}`);
});
