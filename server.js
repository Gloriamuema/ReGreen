import express from "express";
import mysql from "mysql2";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("⚠️ MySQL not connected (optional):", err.message);
  } else {
    console.log("✅ MySQL connected successfully!");
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 ReGreen server running on http://localhost:${PORT}`);
});
