from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd

app = FastAPI(title="MedLeak AI API")

# Enable CORS for the dashboard
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load trained model
model = joblib.load("medleak_model.pkl")


class UserFeatures(BaseModel):
    mean_hour: float
    min_hour: int
    max_hour: int
    unique_pcs: int
    event_count: int
    device_events: float
    device_unique_pcs: float
    total_files: float
    unique_files: float
    doc: float
    exe: float
    jpg: float
    pdf: float
    txt: float
    zip: float
    sensitive_files: float


@app.get("/")
def home():
    return {
        "message": "MedLeak AI Backend Running",
        "status": "online"
    }


@app.post("/analyze-user")
def analyze_user(data: UserFeatures):

    features = pd.DataFrame([{
        "mean_hour": data.mean_hour,
        "min_hour": data.min_hour,
        "max_hour": data.max_hour,
        "unique_pcs": data.unique_pcs,
        "event_count": data.event_count,
        "device_events": data.device_events,
        "device_unique_pcs": data.device_unique_pcs,
        "total_files": data.total_files,
        "unique_files": data.unique_files,
        "doc": data.doc,
        "exe": data.exe,
        "jpg": data.jpg,
        "pdf": data.pdf,
        "txt": data.txt,
        "zip": data.zip,
        "sensitive_files": data.sensitive_files
    }])

    prediction = model.predict(features)[0]
    probability = model.predict_proba(features)[0][1]

    risk_score = round(float(probability) * 100, 2)

    # Risk Level Classification
    if risk_score >= 80:
        risk_level = "Critical"
    elif risk_score >= 50:
        risk_level = "High"
    elif risk_score >= 20:
        risk_level = "Medium"
    else:
        risk_level = "Low"

    return {
        "is_high_risk": bool(prediction),
        "risk_score": risk_score,
        "risk_level": risk_level,
        "message": (
            f"User classified as {risk_level} risk "
            f"with confidence score of {risk_score}%."
        )
    }