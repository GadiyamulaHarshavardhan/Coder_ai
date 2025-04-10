from fastapi import FastAPI, HTTPException, File, UploadFile, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from datetime import datetime, timedelta
from typing import Optional
import logging
import secrets
import jwt
from fastapi.encoders import jsonable_encoder
from db.database import (
    initialize_db,
    insert_chat,
    fetch_user_chat_history,
    register_user,
    login_user,
    get_user_by_id
)
from api import generate  # Import the generate router

# Initialize the database
initialize_db()

# Create FastAPI instance
app = FastAPI(
    title="Ollama DeepSeek Backend",
    version="1.0.0",
    description="Backend for Personal AI project using DeepSeek Coder.",
)

# Security configuration
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
SECRET_KEY = secrets.token_urlsafe(32)
ACCESS_TOKEN_EXPIRE_MINUTES = 30

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

# Models
class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    created_at: datetime
    last_login: Optional[datetime]

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class ChatRequest(BaseModel):
    user_message: str
    ai_response: str

class ChatResponse(BaseModel):
    id: int
    user_id: int
    user_message: str
    ai_response: str
    timestamp: str

# Helper function to create access token
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm="HS256")
    return encoded_jwt

# Authentication endpoints
@app.post("/register", response_model=UserResponse)
async def register(user_data: UserCreate):
    try:
        user_id = register_user(user_data.username, user_data.email, user_data.password)
        user = get_user_by_id(user_id)
        return user
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )

@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    try:
        user_id = login_user(form_data.username, form_data.password)
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": form_data.username},
            expires_delta=access_token_expires
        )
        return {"access_token": access_token, "token_type": "bearer"}
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

# Protected endpoints
@app.get("/users/me", response_model=UserResponse)
async def read_users_me(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        username = payload.get("sub")
        if username is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
            )
        user = get_user_by_username(username)
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )
        return user
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
        )

# Chat endpoints (now protected)
@app.post("/chat/")
async def store_chat(
    chat: ChatRequest,
    current_user: UserResponse = Depends(read_users_me)
):
    try:
        insert_chat(current_user.id, chat.user_message, chat.ai_response)
        return {"status": "success", "message": "Chat stored successfully."}
    except Exception as e:
        logging.error(f"Error storing chat: {e}")
        raise HTTPException(status_code=500, detail="Error storing chat.")

@app.get("/chat/history/", response_model=list[ChatResponse])
async def get_chat_history(current_user: UserResponse = Depends(read_users_me)):
    try:
        chat_history = fetch_user_chat_history(current_user.id)
        return [
            {
                "id": row[0],
                "user_id": row[1],
                "user_message": row[2],
                "ai_response": row[3],
                "timestamp": row[4].isoformat(),
            }
            for row in chat_history
        ]
    except Exception as e:
        logging.error(f"Error fetching chat history: {e}")
        raise HTTPException(status_code=500, detail="Error fetching chat history.")

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "Backend is running."}

# File upload endpoint
@app.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    current_user: UserResponse = Depends(read_users_me)
):
    # Save the file or process it
    return {"filename": file.filename, "message": "File uploaded successfully"}

# Run the FastAPI app
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)