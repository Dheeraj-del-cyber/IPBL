# 🌿 Smart Agriculture Assistant

An AI-powered system for **crop disease detection, intelligent advisory, and crop recommendation**, designed to support farmers with modern technology.

---

## 🧩 Problem

Farmers often lack timely access to expert guidance, which leads to:

- Incorrect disease identification  
- Overuse of pesticides  
- Reduced crop yield  

---

## 💡 Solution

This project provides a **Smart Agriculture Assistant** that:

- Detects plant diseases using CNN models  
- Validates input images using image processing techniques  
- Generates AI-based advisory using LLM  
- Recommends suitable crops using machine learning  

----
## ⚙️ Tech Stack

### AI / ML
- TensorFlow Lite  
- Scikit-learn  

### Image Processing
- OpenCV  
  - Laplacian Variance (Blur Detection)  
  - Green Pixel Ratio (Leaf Detection)  
  - Test Time Augmentation (TTA)  

### LLM
- Groq API  

### Machine Learning Model
- Random Forest (Crop Recommendation)  

### Storage
- JSON  
- SQLite  

### Frontend
- HTML  
- CSS  
- JavaScript  

### Backend
- Python  

---

## 🔬 Key Features

- Image validation (blur detection and leaf detection)  
- Disease detection using CNN  
- AI-powered advisory system  
- Crop recommendation using ML  
- Multi-language support  
- Chatbot integration  
- Fast and lightweight performance  

---

## 🔄 How It Works

1. User uploads a leaf image  

2. Image validation is performed:
   - Blur detection using Laplacian Variance  
   - Leaf detection using Green Pixel Ratio  

3. Valid image is processed using CNN  

4. Disease prediction with confidence score is generated  

5. Advisory is generated using Groq API  

6. Crop recommendation:
   - Data fetched via APIs based on location  
   - Processed using Random Forest model  

7. Final results are displayed in the selected language  

---

## 🛠️ Installation & Setup

```bash
git clone https://github.com/dheeraj-del-cyber/agriai.git
cd agriai
pip install -r requirements.txt
python app.py
