# ReGreen
An Ai platform that identifies best area for reforestation and recommends and provides most native tree species for each land type. Regreeen. Combines GIS for mapping ,AI or smart recommendations and dashbard for clear insight
# 🌿 ReGreen — AI-Powered Reforestation Platform

ReGreen is an **AI + GIS web platform** that identifies the best areas for reforestation and recommends **native tree species** suited for each land type.  
It combines **geospatial mapping**, **AI-driven environmental insights**, and a **dashboard for visualization** to support sustainable reforestation planning.

---

## 🚀 Features

- 🗺️ **GIS Mapping** — Visualize and select land areas using coordinates (latitude & longitude).
- 🤖 **AI Recommendations** — Suggests the most suitable **native trees** based on:
  - Soil type  
  - Rainfall levels  
  - Geographic location
- 📊 **Interactive Dashboard** — Clear visual insights on soil types, rainfall data, and recommended vegetation.
- 💾 **MySQL Database** — Stores environmental data, coordinates, and AI recommendations.
- 🔐 **.env Support** — Securely manage your API keys (e.g. OpenAI API key).

---

## 🧠 How It Works

1. The user enters:
   - Soil type  
   - Average rainfall  
   - GPS coordinates (latitude & longitude)

2. The platform:
   - Analyzes the environmental inputs  
   - Queries the AI model to recommend suitable native tree species  
   - Displays results on an interactive map

---

## 🏗️ Tech Stack

| Layer | Technologies |
|-------|---------------|
| **Frontend** | HTML, CSS, Tailwind CSS, JavaScript |
| **Backend** | Node.js, Express.js |
| **Database** | MySQL |
| **APIs** | OpenAI API for AI recommendations |
| **GIS Tools** | Leaflet.js for interactive mapping |

---

## ⚙️ Setup Instructions (Local Development)

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Gloriamuema/ReGreen.git
cd ReGreen

