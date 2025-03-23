from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from backend.models.model_handler import generate_response

# Create router
router = APIRouter()

# Request model
class RequestData(BaseModel):
    prompt: str
    model: str = "deepseek-coder-v2"  # Default model

@router.post("/")
async def generate_text(request: RequestData):
    """Generate text using DeepSeek Coder v2."""
    try:
        response = generate_response(request.prompt, request.model)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")
