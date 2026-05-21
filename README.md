# 🌿 AgriAI - Smart Agriculture Assistant

![AgriAI Banner](https://via.placeholder.com/1200x300.png?text=AgriAI+-+Empowering+Farmers+with+AI)

An AI-powered, full-stack platform designed to empower farmers with modern technology. **AgriAI** provides intelligent crop disease detection, personalized agricultural advisory, and real-time IoT monitoring, all wrapped in a robust, multilingual, and mobile-first Progressive Web App (PWA).

---

## ✨ Core Features

- 🦠 **Smart Disease Detection**: Scan crop leaves using the device camera. The system uses an **EfficientNetB0 CNN** with Test-Time Augmentation (TTA) to diagnose diseases instantly.
- 🛡️ **Intelligent Image Validation**: Automatically detects blurry images or non-leaf photos (via Green Pixel Ratio calculation) before sending them to the model, saving bandwidth and processing power.
- 🤖 **AI-Driven Advisory**: Integrates with the **Groq API (Llama 3)** to generate tailored, context-aware treatment plans (organic and chemical interventions).
- 🌍 **Deep Multilingual Support**: Fully localized in English, Hindi, Kannada, Tamil, and Telugu. The AI dynamically generates responses natively in the selected language.
- 🎙️ **Voice Assistant**: Speak your queries naturally in your native language, and the AI will guide you through speech recognition.
- 💧 **IoT Dashboard**: Real-time soil moisture monitoring and smart irrigation recommendations based on live sensor data.
- 📱 **Offline-Ready PWA**: Fully functional offline fallback using Service Workers for critical local advisories when the internet is disconnected.

---

## ⚙️ Tech Stack

**Frontend:**
- HTML5, Vanilla JavaScript, CSS3 (Glassmorphism & Responsive Design)
- Progressive Web App (PWA) Architecture
- Web Speech API (Voice Input & Synthesis)

**Backend:**
- Python 3 / Flask REST API
- Groq API (LLM Integration & Prompt Engineering)

**Machine Learning & Computer Vision:**
- TensorFlow / Keras (EfficientNetB0)
- OpenCV (Blur detection, HSV color masking)
- Scikit-learn

---

## 📂 Project Structure

```text
IPBL2/
├── server/               # Python Flask Backend
│   ├── app.py            # Main API routing and orchestration
│   ├── model_handler.py  # Image processing and CNN inference
│   ├── llm_handler.py    # Groq API integration and prompt generation
│   ├── data_validation.py# Image quality and green pixel checks
│   ├── .env              # Environment variables (API keys)
│   └── models/           # Pre-trained .h5 model weights
├── web/                  # Frontend PWA
│   ├── index.html        # Main application UI
│   ├── style.css         # Styling and design system
│   ├── script.js         # Client-side logic, i18n dictionary, IoT polling
│   ├── sw.js             # Service Worker for offline caching
│   └── manifest.json     # PWA configuration
├── data/                 # Training datasets and CSVs
├── scripts/              # Utility and model conversion scripts
└── requirements.txt      # Python dependencies
```

---

## 🚀 Setup & Installation

### Prerequisites
- Python 3.8+
- Node.js (Optional, for serving frontend via local server)
- A Groq API Key

### 1. Clone & Setup Backend
```bash
# Navigate to the server directory
cd server

# Create and activate a virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate

# Install dependencies
pip install -r ../requirements.txt

# Configure Environment Variables
# Create a .env file in the server directory and add your Groq API key:
echo "GROQ_API_KEY=your_actual_api_key_here" > .env
```

### 2. Run the Backend Server
```bash
python app.py
```
*The Flask API will run on `http://localhost:5000`.*

### 3. Run the Frontend
You can serve the `web/` directory using any local web server.
Using Python:
```bash
cd ../web
python -m http.server 3000
```
Or using Node.js:
```bash
npx serve ./web
```
*Access the application at `http://localhost:3000` in your web browser.*

---

## 📱 Usage Guide

1. **Dashboard**: View real-time IoT metrics (Moisture, Temp, Humidity) and daily farming tips.
2. **Language Selection**: Use the top-right globe icon to instantly switch the interface and AI responses to your preferred language.
3. **Disease Detection**: Navigate to the "Detect" tab. Upload an image or use your camera to snap a picture of a diseased leaf. The AI will validate the image and provide a diagnosis.
4. **Chatbot**: Use the floating chat button on the bottom right to ask any agriculture-related questions.
5. **Voice Input**: Click the microphone icon to speak your questions instead of typing.

---

## 🏆 Credits

This project was developed as part of **IPBL 2026**.