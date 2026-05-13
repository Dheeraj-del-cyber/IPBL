import requests
import os
from dotenv import load_dotenv

# Load key from .env
load_dotenv()

GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
# Use the key from .env or fallback to hardcoded (for testing)
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "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")

def test_key():
    print(f"Testing Key: {GROQ_API_KEY[:10]}...")
    payload = {
        "model": "llama-3.1-8b-instant",
        "messages": [{"role": "user", "content": "Hello"}],
        "max_tokens": 10
    }
    headers = {"Authorization": f"Bearer {GROQ_API_KEY}"}
    
    try:
        response = requests.post(GROQ_API_URL, headers=headers, json=payload)
        if response.status_code == 200:
            print("SUCCESS: Your API key is working!")
            print(f"Reply: {response.json()['choices'][0]['message']['content']}")
        elif response.status_code == 401:
            print("ERROR 401: Unauthorized. Your API key is invalid or expired.")
            print("Please go to https://console.groq.com/ to generate a new key.")
        else:
            print(f"ERROR {response.status_code}: {response.text}")
    except Exception as e:
        print(f"CONNECTION ERROR: {e}")


if __name__ == "__main__":
    test_key()
