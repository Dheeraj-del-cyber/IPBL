"""
Download model.h5 from a hosted URL if not present locally.
Set MODEL_URL environment variable to your hosted model link.
"""
import os
import requests

MODEL_PATH = os.path.join(os.path.dirname(__file__), '..', 'server', 'model.h5')
MODEL_URL = os.getenv("MODEL_URL", "")  # Set this in your cloud env vars

def download_model():
    if os.path.exists(MODEL_PATH):
        print("✅ model.h5 already exists, skipping download.")
        return

    if not MODEL_URL:
        print("⚠️  MODEL_URL not set. Skipping model download.")
        return

    print(f"⬇️  Downloading model from {MODEL_URL} ...")
    response = requests.get(MODEL_URL, stream=True)
    response.raise_for_status()

    with open(MODEL_PATH, 'wb') as f:
        for chunk in response.iter_content(chunk_size=8192):
            f.write(chunk)

    print("✅ model.h5 downloaded successfully.")

if __name__ == "__main__":
    download_model()
