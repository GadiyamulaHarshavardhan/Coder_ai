from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
import logging
from models.model_handler import generate_response

# Create router
router = APIRouter()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Request model
class RequestData(BaseModel):
    prompt: str = Field(..., min_length=1, max_length=1000, description="User input prompt.")
    model: str = Field(default="deepseek-coder-v2", description="Model to use for generating response.")

# Response model
class ResponseData(BaseModel):
    response: str = Field(..., description="Generated response from the model.")
    status: str = Field(default="success", description="Status of the request.")

@router.post("/", response_model=ResponseData)
async def generate_text(request: RequestData):
    """Generate text using DeepSeek Coder v2."""
    logger.info(f"Received request with prompt: {request.prompt}")
    try:
        response = generate_response(request.prompt, request.model)
        return {"response": response, "status": "success"}
    except Exception as e:
        logger.error(f"Error generating response: {str(e)}")
        raise HTTPException(status_code=500, detail={"response": "Error generating response.", "status": "error"})