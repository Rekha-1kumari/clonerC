from sqlalchemy import Column, Integer, String, Float, JSON
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    role = Column(String, default="user")

class Prediction(Base):
    __tablename__ = "predictions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer)
    input_text = Column(String)
    model_used = Column(String)
    predicted_label = Column(String)
    confidence = Column(Float)
    explanation_json = Column(JSON)
