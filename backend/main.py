from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from db.database import initialize_db, insert_chat, fetch_chat_history
from api import generate  # Import the generate router
import logging

# Initialize the database
initialize_db()

# Create FastAPI instance
app = FastAPI(
    title="Ollama DeepSeek Backend",
    version="1.0.0",
    description="Backend for Personal AI project using DeepSeek Coder.",
)

# Add CORS middleware to allow frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (update this in production)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Include the generate router
app.include_router(generate.router, prefix="/generate", tags=["Generate"])

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "Backend is running."}

# Request model for storing chats
class ChatRequest(BaseModel):
    user_message: str
    ai_response: str

# Response model for fetching chat history
class ChatResponse(BaseModel):
    id: int
    user_message: str
    ai_response: str
    timestamp: str

# Endpoint to store a chat
@app.post("/chat/")
async def store_chat(chat: ChatRequest):
    try:
        insert_chat(chat.user_message, chat.ai_response)
        return {"status": "success", "message": "Chat stored successfully."}
    except Exception as e:
        logging.error(f"Error storing chat: {e}")
        raise HTTPException(status_code=500, detail="Error storing chat.")

# Endpoint to fetch chat history
@app.get("/chat/history/", response_model=list[ChatResponse])
async def get_chat_history():
    try:
        chat_history = fetch_chat_history()
        return [
            {
                "id": row[0],
                "user_message": row[1],
                "ai_response": row[2],
                "timestamp": row[3].isoformat(),
            }
            for row in chat_history
        ]
    except Exception as e:
        logging.error(f"Error fetching chat history: {e}")
        raise HTTPException(status_code=500, detail="Error fetching chat history.")
# File upload endpoint
@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    # Save the file or process it
    return {"filename": file.filename, "message": "File uploaded successfully"}

# Run the FastAPI app
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)