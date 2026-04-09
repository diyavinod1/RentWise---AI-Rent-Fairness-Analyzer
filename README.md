# 💎 RentWise — AI Rent Fairness Analyzer

> **Stop overpaying rent. Start playing smart.** 🧠🏠    
> ML-powered rent prediction for Indian cities with AI explanations, interactive maps, and clean visual insights.

---

## ⚡ This isn’t a project. This is a PRODUCT.

You don’t guess rent anymore.
You **analyze it like a pro**.

👉 Enter property details  
👉 Get AI-powered rent prediction    
👉 Know instantly if it’s a **steal or a scam**

---

## 🔥 Why RentWise hits different

* 🧠 **XGBoost model with R² = 0.93**
* 📊 Real-time **fairness analysis**
* 🗺️ Map-based location selection
* 🤖 AI explanations using SambaNova
* 💎 Premium UI that *feels like a startup*

---

## ✨ Features

| Feature                 | Description                                           |
| ----------------------- | ----------------------------------------------------- |
| 🤖 **ML Prediction**    | XGBoost model trained on 8,000+ listings (MAE ₹2,858) |
| 🗺️ **Interactive Map** | Pick location using Leaflet or type manually          |
| 📊 **Visual Reports**   | Price comparison + distribution graphs                |
| 🧠 **AI Explanation**   | Smart reasoning using LLM (SambaNova API)             |
| 💡 **Negotiation Tips** | Actionable suggestions for users                      |
| 🏙️ **10 Cities**       | Covers major Indian metro cities                      |
| 🌙 **Premium UI**       | Dark + glassmorphism + modern typography              |

---

## 🧠 How it works

```
User Input → Feature Engineering → ML Prediction → Fairness Logic → AI Explanation → UI Display
```

1. User enters property details
2. Features are engineered dynamically
3. XGBoost predicts fair rent
4. System compares with actual rent
5. AI explains the result
6. Visual insights are displayed

---

## 📁 Project Structure

```
rentwise/
├── backend/
│   ├── main.py
│   ├── model/
│   ├── data/
│   └── utils/
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   └── utils/
│
├── docker-compose.yml
└── README.md
```

---

## 🚀 Quick Start

### 1. Clone repo

```bash
git clone https://github.com/yourname/rentwise.git
cd rentwise
```

---

### 2. Setup Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate

pip install -r requirements.txt
python model/train_model.py
```

---

### 3. Start Backend

```bash
uvicorn main:app --reload
```

---

### 4. Setup Frontend

```bash
cd ../frontend
npm install
npm run dev
```

---


## 🌐 API Endpoints

### `/predict`

Returns:

* predicted rent
* fairness label
* score
* % difference

---

### `/explain`

Returns:

* AI-generated explanation of pricing

---

## 🧠 ML Pipeline

* Models compared:

  * Linear Regression
  * Random Forest
  * Gradient Boosting
  * **XGBoost (Best)**

* Feature engineering:

  * `bath_ratio`
  * `floor_ratio`
  * binary flags (parking, furnishing)

---

## 🤖 AI Layer

Powered by **SambaNova API**

Generates:

* Explanation of pricing
* Negotiation insights
* Market reasoning

---

## ☁️ Deployment

* Backend → Render
* Frontend → Vercel / Netlify
* Full stack → Docker

---

## 🧩 Tech Stack

### Backend

* FastAPI
* Scikit-learn
* XGBoost

### Frontend

* React + Vite
* Tailwind CSS
* Recharts
* Leaflet

---

## 💣 What makes this insane?

Most ML projects:     
❌ Just predict numbers

RentWise:     
✅ Predicts     
✅ Explains     
✅ Visualizes    
✅ Feels like a real startup

---

## 🚀 Future Scope

* 📍 Live rent heatmaps
* 🧠 Personalized insights
* 📱 Mobile app
* 🔔 Deal alerts

---

## 🙌 Contributing

PRs welcome. Build something cool.

---

## ⭐ Show some love

If this made you go “damn 🔥”     
👉 **Star this repo** ⭐

---

## 👩‍💻 Built by

**Diya Vinod**

> Turning ideas into real-world AI products 🚀

---

## 🌟 Final vibe

This isn’t just code.
This is **design + data + intelligence combined**.

And yeah…
**you’re never overpaying rent again.** 😏
