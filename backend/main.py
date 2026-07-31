from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import database, models, schemas, auth
from typing import List

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Explainable AI Mental Health API - Backend by Rekha")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/token", response_model=schemas.Token)
def login_for_access_token(form_data: auth.OAuth2PasswordRequestForm = Depends(), db: Session = Depends(database.get_db)):
    user = auth.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = auth.create_access_token(
        data={"sub": user.email}, expires_delta=auth.timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/register", response_model=schemas.UserResponse)
def register(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(email=user.email, password_hash=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.post("/predict", response_model=schemas.PredictionResponse)
def predict(request: schemas.PredictionRequest, current_user: models.User = Depends(auth.get_current_user)):
    # MOCKING THE ML MODEL - Since Member A and B did not complete their parts
    input_lower = request.input_text.lower()
    if any(word in input_lower for word in ["sad", "depress", "hopeless", "down", "cry"]):
        mock_prediction = "Depression"
        mock_features = [{"word": w, "importance": 0.4} for w in request.input_text.split() if w in ["sad", "depressed", "hopeless", "down", "crying"]]
        if not mock_features: mock_features = [{"word": "sadness", "importance": 0.5}]
    elif any(word in input_lower for word in ["anxious", "panic", "worry", "fear", "nervous"]):
        mock_prediction = "Anxiety"
        mock_features = [{"word": w, "importance": 0.4} for w in request.input_text.split() if w in ["anxious", "panic", "worry", "fear", "nervous"]]
        if not mock_features: mock_features = [{"word": "worry", "importance": 0.5}]
    else:
        mock_prediction = "Normal"
        mock_features = [{"word": "good", "importance": 0.3}, {"word": "okay", "importance": 0.2}]

    mock_confidence = 0.88
    
    mock_explanation = {
        "model": request.model_used,
        "method": "SHAP" if request.model_used in ["logreg", "nb", "svm", "rf"] else "LIME/Attention",
        "features": mock_features
    }
    
    return {
        "input_text": request.input_text,
        "predicted_label": mock_prediction,
        "confidence": mock_confidence,
        "explanation": mock_explanation
    }
