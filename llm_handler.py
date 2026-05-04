import os
import requests
import json

GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
# User provided API key
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "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")

# OFFLINE FALLBACK DATA
# Expert-verified advice for the 11 classes your model detects
LOCAL_ADVISORY = {
    "Apple Scab": {
        "recovery": "Prune infected leaves and fruit. Improve air circulation.",
        "organic": "Neem oil spray or sulfur-based organic fungicides.",
        "chemical": "Fungicides containing Captan or Myclobutanil.",
        "prevention": "Plant scab-resistant varieties; clear fallen leaves in autumn."
    },
    "Bacterial Spot": {
        "recovery": "Remove infected plants immediately to prevent spread.",
        "organic": "Copper-based sprays or Serenade (Bacillus subtilis).",
        "chemical": "Fixed copper products applied early morning.",
        "prevention": "Avoid overhead watering; use certified disease-free seeds."
    },
    "Black Rot": {
        "recovery": "Cut out 'mummified' fruit and cankers on vines.",
        "organic": "Lime-sulfur sprays during dormant season.",
        "chemical": "Mancozeb or Ziram fungicides.",
        "prevention": "Ensure good drainage and spacing between plants."
    },
    "Cedar Apple Rust": {
        "recovery": "Remove nearby cedar galls if possible.",
        "organic": "Potassium bicarbonate sprays.",
        "chemical": "Immunox or other systemic fungicides.",
        "prevention": "Avoid planting apple trees near Junipers/Cedars."
    },
    "Early Blight": {
        "recovery": "Remove bottom leaves showing spots. Mulch around the base.",
        "organic": "Compost tea or Bacillus amyloliquefaciens sprays.",
        "chemical": "Chlorothalonil or Copper-based fungicides.",
        "prevention": "Rotate crops every 3 years; maintain leaf dryness."
    },
    "Esca (Black Measles)": {
        "recovery": "Careful pruning of affected wood during dry weather.",
        "organic": "Trichoderma-based biocontrol agents.",
        "chemical": "Sodium arsenite (regulated) or systemic triazoles.",
        "prevention": "Disinfect pruning tools between every cut."
    },
    "Healthy": {
        "recovery": "Plant is performing well!",
        "organic": "Keep using organic compost to maintain vigor.",
        "chemical": "No chemicals needed.",
        "prevention": "Continue regular monitoring and balanced watering."
    },
    "Late Blight": {
        "recovery": "Destructive disease! Bag and remove entire plant immediately.",
        "organic": "Strict copper sprays (preventive only).",
        "chemical": "Systemic fungicides like Ridomil Gold.",
        "prevention": "Destroy volunteer plants; choose resistant hybrids."
    },
    "Leaf Blight": {
        "recovery": "Increase spacing to lower humidity around the canopy.",
        "organic": "Garlic-based sprays or baking soda solution.",
        "chemical": "Mancozeb or Propiconazole.",
        "prevention": "Avoid working in the field when leaves are wet."
    },
    "Septoria Leaf Spot": {
        "recovery": "Drip irrigation only. Remove spotted leaves as they appear.",
        "organic": "Actinovate or other biological fungicides.",
        "chemical": "Chlorothalonil applied every 7-10 days.",
        "prevention": "Clean all gardening tools with bleach after use."
    },
    "Yellow Leaf Curl Virus": {
        "recovery": "Cannot be cured once infected; focus on whitefly control.",
        "organic": "Yellow sticky traps; mineral oil sprays.",
        "chemical": "Imidacloprid (for whiteflies, not the virus).",
        "prevention": "Use silver-colored mulch to repel insects."
    }
}

def get_agricultural_guidance(disease_name, crop_type="plant"):
    """
    Calls Groq LLM but falls back to High-Quality local data if offline.
    """
    
    # 1. Check for Offline Fallback first
    fallback = LOCAL_ADVISORY.get(disease_name)
    
    if not GROQ_API_KEY:
        print("--- Running in Offline Fallback Mode (API Key Missing) ---")
        return format_fallback(disease_name, fallback)

    prompt = f"""Expert Mode: A farmer has a {crop_type} plant with '{disease_name}'. 
Provide 4-5 bullet points including:
- Quick Recovery Steps
- Best Organic/Sustainable Cure
- Recommended Chemical (if organic fails)
- Future Prevention Strategy

Format as plain text, no markdown headers."""

    payload = {
        "model": "llama-3-8b-8192",
        "messages": [
            {"role": "system", "content": "You are a village-friendly expert agronomist."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.5
    }

    try:
        response = requests.post(GROQ_API_URL, 
                                 headers={"Authorization": f"Bearer {GROQ_API_KEY}"}, 
                                 json=payload, 
                                 timeout=8)
        response.raise_for_status()
        guidance = response.json()['choices'][0]['message']['content']
        return {"full_guidance": guidance, "success": True}
        
    except Exception as e:
        print(f"--- LLM Unavailable ({e}). Using Expert Local Knowledge. ---")
        return format_fallback(disease_name, fallback)

def format_fallback(name, data):
    """Formats the JSON fallback for clean UI display"""
    if not data:
        return {"full_guidance": f"Monitor your {name} closely. Check soil moisture and drainage.", "success": False}
        
    text = (f"OFFLINE ADVICE FOR {name.upper()}:\n\n"
            f"1. RECOVERY: {data['recovery']}\n"
            f"2. ORGANIC: {data['organic']}\n"
            f"3. CHEMICAL: {data['chemical']}\n"
            f"4. PREVENTION: {data['prevention']}")
    
    return {"full_guidance": text, "success": True}
