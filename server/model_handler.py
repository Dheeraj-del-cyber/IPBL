import cv2
import numpy as np
import tensorflow as tf
from PIL import Image
import io
import os
from tensorflow.keras.applications.efficientnet import preprocess_input

# Exactly mapped folder names in alphabetical order as used during training
CLASS_NAMES = [
    "Apple Scab",
    "Bacterial Spot",
    "Black Rot",
    "Cedar Apple Rust",
    "Early Blight",
    "Esca (Black Measles)",
    "Healthy",
    "Late Blight",
    "Leaf Blight",
    "Septoria Leaf Spot",
    "Yellow Leaf Curl Virus"
]

# Initialization
MODEL = None
MODEL_PATH = 'model.h5'

def load_model():
    global MODEL
    if os.path.exists(MODEL_PATH):
        try:
            MODEL = tf.keras.models.load_model(MODEL_PATH)
            print("--- [LOADED] High-Accuracy EfficientNet Model ---")
        except Exception as e:
            print(f"Error loading model: {e}")
            MODEL = None
    else:
        print(f"WARNING: Model file {MODEL_PATH} not found.")

load_model()

def plant_check(image_bytes):
    """
    Stage 2: Organic Plant Verification (Green Pixel Check)
    Refined with adaptive thresholds for different lighting.
    """
    try:
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if img is None:
            return False, 0.0

        hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
        
        # Broad green range to capture various leaf shades
        lower_green = np.array([25, 30, 30])
        upper_green = np.array([95, 255, 255])

        mask = cv2.inRange(hsv, lower_green, upper_green)
        green_pixels = cv2.countNonZero(mask)
        total_pixels = img.shape[0] * img.shape[1]
        green_percentage = (green_pixels / total_pixels) * 100

        print(f"Plant Check: {green_percentage:.1f}% green detected.")
        return green_percentage > 12.0, green_percentage # Relaxed to 12%
    except Exception:
        return False, 0.0

def preprocess_image(image):
    """
    Core Preprocessing for a single PIL image object
    """
    img = image.convert('RGB').resize((224, 224))
    img_array = np.array(img).astype(np.float32)
    img_array = np.expand_dims(img_array, axis=0)
    return preprocess_input(img_array)

def predict_image(image_bytes):
    """
    Stage 4: CNN Prediction with TTA (Test-Time Augmentation)
    Looks at the image from 3 different spatial perspectives for maximum accuracy.
    """
    if MODEL is None:
        return {"error": "Model not found. Please train the model first."}
    
    try:
        # Load base image
        base_img = Image.open(io.BytesIO(image_bytes))
        
        # Create 3 views for TTA (Original, Horizontal Flip, Vertical Flip)
        views = [
            base_img,
            base_img.transpose(Image.FLIP_LEFT_RIGHT),
            base_img.transpose(Image.FLIP_TOP_BOTTOM)
        ]
        
        all_probs = []
        for view in views:
            input_data = preprocess_image(view)
            preds = MODEL.predict(input_data, verbose=0)[0]
            all_probs.append(preds)
        
        # Average the predictions across all views
        avg_probs = np.mean(all_probs, axis=0)
        class_idx = np.argmax(avg_probs)
        confidence = float(np.max(avg_probs) * 100)
        
        # Bias Control: If result is 'Healthy' but confidence is borderline, 
        # check if there's a strong runner-up disease.
        healthy_idx = 6
        if class_idx == healthy_idx and confidence < 50.0:
            temp_probs = avg_probs.copy()
            temp_probs[healthy_idx] = 0
            runner_up_idx = np.argmax(temp_probs)
            if temp_probs[runner_up_idx] > 0.15: # Runner up at least 15%
                class_idx = runner_up_idx
                confidence = float(temp_probs[runner_up_idx] * 100)
                print(f"--- Corrected Bias (Healthy -> {CLASS_NAMES[class_idx]}) ---")

        disease_name = CLASS_NAMES[class_idx] if confidence > 10.0 else "Uncertain (Low Confidence)"

        return {
            "disease": disease_name,
            "confidence": round(confidence, 2),
            "tta_active": True
        }
    except Exception as e:
        return {"error": f"Analysis Failed: {str(e)}"}

def predict_disease(image_bytes):
    return predict_image(image_bytes)
