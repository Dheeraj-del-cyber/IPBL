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
GROQ_API_KEY = os.getenv("GROQ_API_KEY") 

def get_agricultural_guidance(disease_name, crop_type="plant", moisture=None, language="English"):
    """
    Calls Groq LLM for expert agricultural advice.
    This tool is strictly ONLINE and requires a valid GROQ_API_KEY.
    """
    
    if not GROQ_API_KEY:
        return {
            "full_guidance": "⚠️ Your GROQ API Key is missing or invalid. Please update the GROQ_API_KEY in the 'server/.env' file to enable AI guidance.",
            "success": False
        }


    moisture_context = f"The current soil moisture level is {moisture}%." if moisture is not None else "Soil moisture data is unavailable."
    
    prompt = f"""A farmer has a {crop_type} plant with '{disease_name}'. 
{moisture_context}

Provide an expert agricultural treatment plan in JSON format with these exact keys:
- 'recovery': list of strings (quick recovery steps)
- 'organic': list of strings (organic/sustainable cures)
- 'chemical': list of strings (recommended chemical solutions)
- 'prevention': list of strings (future prevention strategies)

Ensure the advice is specific to the detected disease and current moisture level.
CRITICAL: You MUST respond in {language}. All values in the JSON output MUST be in {language} (except keys which remain English)."""

    payload = {
        "model": "llama-3.1-8b-instant",
        "messages": [
            {"role": "system", "content": "You are a professional agronomist. Output ONLY valid JSON."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.4,
        "response_format": { "type": "json_object" }
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
