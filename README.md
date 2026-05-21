🌿 Smart Agriculture Assistant

An AI-powered system for crop disease detection and intelligent advisory — designed to assist farmers with modern technology.

---

## 📂 Project Structure

The project is organized into logical modules for better maintainability:

- **`/server/`**: Python backend (Flask API, AI Model Handlers, Training)
- **`/web/`**: Frontend web application (HTML, CSS, JS, Service Worker)
- **`/data/`**: Machine Learning datasets
- **`/scripts/`**: Utility scripts for export and conversion
- **`requirements.txt`**: Project dependencies

---

## ⚙️ Tech Stack

- **AI/ML**: TensorFlow (EfficientNetB0), Scikit-learn
- **Image Processing**: OpenCV (Blur detection, Green Pixel Ratio, TTA)
- **LLM**: Groq API (Llama-3-8b)
- **Frontend**: Vanilla JS (PWA), CSS (Glassmorphism), HTML5
- **Backend**: Python Flask

---

## 🚀 Setup & Execution

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Start the Backend Server
```bash
cd server
python app.py
```

### 3. Open the Frontend
Open `web/index.html` in your browser (use a local server like Live Server for best results, especially for PWA features).

---

## 🔬 Key Features

- ✅ **Smart Validation**: Detects blur and verifies if the image is actually a plant leaf before processing.
- ✅ **High-Accuracy CNN**: Uses EfficientNetB0 with Test-Time Augmentation (TTA).
- ✅ **AI Advisory**: Generates treatment plans using the Groq API.
- ✅ **IoT Integration**: Real-time soil moisture monitoring.
- ✅ **Offline Support**: Progressive Web App (PWA) with Service Worker caching.
- ✅ **Multilingual**: Supports 5 languages (English, Hindi, Kannada, Telugu, Tamil).

---

#   I P B L 2026