import cv2
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import io
import model_handler 
import llm_handler # New Integration

app = Flask(__name__)
CORS(app) # Enable CORS for development

def blur_check(image_bytes, threshold=100.0):
    """
    Stage 1: Blur Detection (Laplacian Variance Method)
    Returns: Variance, ErrorMessage
    """
    try:
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_GRAYSCALE)
        
        if img is None:
            return None, "Invalid image format or corrupted file."

        # Compute Laplacian variance
        laplacian_var = cv2.Laplacian(img, cv2.CV_64F).var()
        return laplacian_var, None
    except Exception as e:
        return None, str(e)

@app.route('/detect', methods=['POST'])
def detect():
    if 'image' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400
    
    file = request.files['image']
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400

    # Read image bytes
    img_bytes = file.read()
    
    # -------------------------------------------------------------
    # STAGE 1: BLUR CHECK
    # -------------------------------------------------------------
    var, error = blur_check(img_bytes)
    if error:
        return jsonify({"error": error}), 400
    
    threshold = 30.0
    if var < threshold:
        return jsonify({
            "status": "blurry",
            "message": "Image is blurry. Please hold steady and take a clearer photo.",
            "error": "Image is blurry. Please capture a closer and clearer photo.",
            "variance": round(var, 2)
        }), 400

    # -------------------------------------------------------------
    # STAGE 2: PLANT CHECK (Green Pixel Check)
    # -------------------------------------------------------------
    is_plant, green_percentage = model_handler.plant_check(img_bytes)
    if not is_plant:
        return jsonify({
            "error": "Invalid image. Please upload a clear plant leaf image",
            "green_percentage": round(green_percentage, 2)
        }), 400

    # -------------------------------------------------------------
    # STAGE 3 & 4: CNN PREDICTION & CONFIDENCE FILTERING
    # -------------------------------------------------------------
    prediction = model_handler.predict_image(img_bytes)
    
    if "error" in prediction:
        # Check if it was a confidence error or a server error
        status_code = 400 if "confidence" in str(prediction["error"]).lower() else 500
        return jsonify({"error": prediction["error"]}), status_code

    # -------------------------------------------------------------
    # STAGE 5: LLM GUIDANCE GENERATION
    # -------------------------------------------------------------
    # Infer crop name from disease name (e.g., 'Apple Scab' -> 'Apple')
    disease_name = prediction.get("disease", "plant")
    crop_type = "plant" 
    if "Apple" in disease_name: crop_type = "Apple"
    elif "Grape" in disease_name or "Esca" in disease_name: crop_type = "Grape"
    elif "Tomato" in disease_name or "Curl" in disease_name: crop_type = "Tomato"
    
    # Call LLM
    guidance = llm_handler.get_agricultural_guidance(disease_name, crop_type)
    
    # FINAL OUTPUT
    return jsonify({
        "status": "clear",
        "message": "Plant leaf detected and successfully analyzed.",
        "prediction_results": prediction,
        "guidance": guidance.get("full_guidance", "Guidance not available.")
    })

# ---------------------------------------------------------------
# CHATBOT ENDPOINT — Full conversational AI for agriculture
# ---------------------------------------------------------------
@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    if not data or 'messages' not in data:
        return jsonify({"error": "No messages provided"}), 400

    messages = data['messages']

    # Validate and cap history to avoid token overflows
    if len(messages) > 22:
        messages = [messages[0]] + messages[-20:]

    payload = {
        "model": "llama-3-8b-8192",
        "messages": messages,
        "temperature": 0.6,
        "max_tokens": 600
    }

    try:
        import requests as req
        response = req.post(
            llm_handler.GROQ_API_URL,
            headers={"Authorization": f"Bearer {llm_handler.GROQ_API_KEY}"},
            json=payload,
            timeout=20
        )
        response.raise_for_status()
        reply = response.json()['choices'][0]['message']['content'].strip()
        return jsonify({"reply": reply, "success": True})

    except Exception as e:
        print(f"Chat API Error: {e}")
        return jsonify({"error": str(e), "success": False}), 500

if __name__ == '__main__':
    # Threaded=True for responsiveness
    app.run(debug=True, port=5000, threaded=True)
