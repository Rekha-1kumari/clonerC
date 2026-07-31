from pydantic import BaseModel
from typing import Optional, Dict, Any, List

class UserCreate(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    role: str

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class PredictionRequest(BaseModel):
    input_text: str
    model_used: str = "distilbert"

class PredictionResponse(BaseModel):
    input_text: str
    predicted_label: str
    confidence: float
    explanation: Dict[str, Any]
