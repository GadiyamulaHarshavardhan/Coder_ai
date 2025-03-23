from fastapi import FastAPI
from backend.api import generate

# Create FastAPI instance
app = FastAPI(
    title="Ollama DeepSeek Backend",
    version="1.0.0"
)

# Include API route
app.include_router(generate.router, prefix="/generate", tags=["Generate"])
