import os
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

import model_handler
import llm_handler

# Set static folder to the web directory (located one level up)
app = Flask(__name__, static_folder='../web', static_url_path='')

# Production-safe CORS: read allowed origins from env (comma-separated)
allowed = os.getenv('ALLOWED_ORIGINS', '')
if allowed:
    origins = [o.strip() for o in allowed.split(',') if o.strip()]
    CORS(app, resources={r"/*": {"origins": origins}})
else:
    # Default: allow all origins only in non-production modes
    CORS(app)

# Security / upload limits
app.config['MAX_CONTENT_LENGTH'] = int(os.getenv('MAX_CONTENT_LENGTH', 8 * 1024 * 1024))  # 8 MB default

# Logging: integrate with gunicorn if present
logger = logging.getLogger('gunicorn.error')
if logger.handlers:
    app.logger.handlers = logger.handlers
    app.logger.setLevel(logger.level)

@app.route('/')
def index():
    """Serve the index.html file from the web folder."""
    return app.send_static_file('index.html')

@app.route('/web/<path:path>')
def send_web(path):
    """Serve other static assets from the web folder."""
    return app.send_static_file(path)


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
    # STAGE 1: PLANT CHECK (Green Pixel Check)
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
    
    # Call LLM with Moisture Context
    current_moisture = iot_data.get("moisture", 0)
    guidance = llm_handler.get_agricultural_guidance(disease_name, crop_type, moisture=current_moisture)
    
    # FINAL OUTPUT
    return jsonify({
        "status": "clear",
        "message": "Plant leaf detected and successfully analyzed.",
        "prediction_results": prediction,
        "guidance": guidance.get("full_guidance", "Guidance not available."),
        "moisture": current_moisture
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
        "model": "llama-3.1-8b-instant",
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

# ---------------------------------------------------------------
# IOT MONITORING - Moisture Sensor Integration
# ---------------------------------------------------------------
iot_data = {
    "moisture": 0,
    "last_updated": "Never"
}

@app.route('/update_moisture', methods=['POST'])
def update_moisture():
    data = request.get_json()
    if not data or 'moisture' not in data:
        return jsonify({"error": "No moisture value provided"}), 400
    
    import datetime
    iot_data["moisture"] = data['moisture']
    iot_data["last_updated"] = datetime.datetime.now().strftime("%H:%M:%S")
    
    return jsonify({"success": True, "received": iot_data["moisture"]})

@app.route('/get_moisture', methods=['GET'])
def get_moisture():
    return jsonify(iot_data)

if __name__ == '__main__':
    # Threaded=True for responsiveness when running locally
    debug_mode = os.getenv('FLASK_DEBUG', '0') in ['1', 'true', 'True']
    app.run(debug=debug_mode, host='0.0.0.0', port=int(os.getenv('PORT', 5000)), threaded=True)


# ---------- Production-friendly error handlers ----------
@app.errorhandler(413)
def too_large(e):
    return jsonify({"error": "Uploaded file is too large (max 8MB)."}), 413


@app.errorhandler(404)
def not_found(e):
    # If the request expects JSON (API), return JSON
    if request.path.startswith('/api') or request.path.startswith('/detect') or request.path.startswith('/chat'):
        return jsonify({"error": "Not found"}), 404
    return app.send_static_file('index.html')


@app.errorhandler(Exception)
def handle_exception(e):
    app.logger.exception('Unhandled Exception: %s', e)
    return jsonify({"error": "Internal server error"}), 500
