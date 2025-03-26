import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Ollama API URL
OLLAMA_URL = "http://localhost:11434/api/generate"

def generate_response(prompt: str, model: str = "deepseek-coder-v2"):
    """Send request to Ollama API and get response."""
    payload = {
        "model": model,
        "prompt": prompt,
        "stream": False,
    }

    # Configure retry logic
    session = requests.Session()
    retries = Retry(
        total=3,  # Retry 3 times
        backoff_factor=1,  # Exponential backoff
        status_forcelist=[500, 502, 503, 504],  # Retry on these status codes
    )
    session.mount("http://", HTTPAdapter(max_retries=retries))

    try:
        logger.info(f"Sending request to Ollama API with model: {model}")
        response = session.post(OLLAMA_URL, json=payload, timeout=100)  # 10-second timeout
        response.raise_for_status()  # Raise exception for non-200 status codes
        return response.json()["response"]
    except requests.exceptions.RequestException as e:
        logger.error(f"Error from Ollama API: {str(e)}")
        raise Exception(f"Ollama API error: {str(e)}")