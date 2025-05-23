from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(title="Character Decomposition API")

# Configure CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Message(BaseModel):
    role: str
    content: str

class ConversationRequest(BaseModel):
    messages: List[Message]
    selected_characters: List[str] = []

@app.get("/")
async def root():
    return {"message": "Character Decomposition API is running!"}

@app.post("/api/generate")
async def generate_response(request: ConversationRequest):
    # For now, return a mock response
    return {
        "response": "This is a mock response that will be replaced with actual LLM calls later.",
        "status": "success"
    }

@app.post("/api/analyze")
async def analyze_response(request: Dict[str, Any]):
    # Mock character analysis
    mock_characters = [
        {
            "name": "The Analyst",
            "description": "Focuses on data and logical reasoning",
            "text_segments": ["This is a mock response"],
            "perspective": "analytical"
        },
        {
            "name": "The Optimist",
            "description": "Looks for positive outcomes and solutions",
            "text_segments": ["that will be replaced with actual LLM calls later."],
            "perspective": "positive"
        }
    ]
    
    return {"characters": mock_characters}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)