import os
import requests
import json
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

# --- SET YOUR API KEY HERE ---
# You can also set it in a .env file as: GROQ_API_KEY=your_key_here
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "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") 

def get_agricultural_guidance(disease_name, crop_type="plant", moisture=None):
    """
    Calls Groq LLM for expert agricultural advice.
    This tool is strictly ONLINE and requires a valid GROQ_API_KEY.
    """
    
    if not GROQ_API_KEY or GROQ_API_KEY.startswith("gsk_rDBp5"):
        return {
            "full_guidance": "⚠️ Your GROQ API Key is missing or invalid. Please update the GROQ_API_KEY in the 'server/.env' file to enable AI guidance.",
            "success": False
        }


    moisture_context = f"The current soil moisture level is {moisture}%." if moisture is not None else "Soil moisture data is unavailable."
    
    prompt = f"""Expert Mode: A farmer has a {crop_type} plant with '{disease_name}'. 
{moisture_context}

Based on both the detected disease and the current moisture level, provide 4-5 bullet points including:
- Quick Recovery Steps (Adjusted for moisture: e.g., if too wet, suggest drainage; if too dry, suggest irrigation)
- Best Organic/Sustainable Cure
- Recommended Chemical (if organic fails)
- Future Prevention Strategy (Specific to irrigation and moisture management)

Format as plain text, no markdown headers."""

    payload = {
        "model": "llama-3.1-8b-instant",
        "messages": [
            {"role": "system", "content": "You are a village-friendly expert agronomist. You use both visual disease detection and real-time IoT sensor data (moisture) to provide the most accurate farming advice."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.5
    }

    try:
        response = requests.post(GROQ_API_URL, 
                                 headers={"Authorization": f"Bearer {GROQ_API_KEY}"}, 
                                 json=payload, 
                                 timeout=15)
        response.raise_for_status()
        guidance = response.json()['choices'][0]['message']['content']
        return {"full_guidance": guidance, "success": True}
        
    except Exception as e:
        return {
            "full_guidance": f"⚠️ AI Service Unavailable: {str(e)}. Please check your internet connection and API status.",
            "success": False
        }
