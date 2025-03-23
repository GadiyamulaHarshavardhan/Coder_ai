import requests

# Ollama API URL
OLLAMA_URL = "http://localhost:11434/api/generate"

def generate_response(prompt: str, model: str = "deepseek-coder-v2"):
    """Send request to Ollama API and get response."""
    payload = {
        "model": model,
        "prompt": prompt,
        "stream": False
    }

    response = requests.post(OLLAMA_URL, json=payload)
    if response.status_code == 200:
        data = response.json()
        return data["response"]
    else:
        raise Exception(f"Error from Ollama: {response.text}")
