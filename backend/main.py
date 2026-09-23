from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

from services.isl.predictor import predict_gesture, is_confident

app = FastAPI(title="Sanket Setu AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class ProcessRequest(BaseModel):
    input_type: str
    input: str
    confidence: Optional[float] = None
    session_id: str


@app.get("/api/v1/health")
def health():
    return {"status": "ok"}


@app.post("/api/v1/process")
def process(req: ProcessRequest):

    if req.input_type == "sign":
        result = predict_gesture(req.input)
        gesture = result["label"]
        confidence = result["confidence"]
        

        if not is_confident(confidence):
            return {
                "status": "low_confidence",
                "intent": None,
                "response": None,
                "accessible_output": {
                    "text": "Could you please repeat the sign?",
                    "audio_available": True
                }
            }
    else:
        gesture = req.input
        confidence = req.confidence or 1.0

    return {
        "status": "success",
        "intent": "government_information",
        "response": {
            "title": f"{gesture.title()} Information",
            "summary": "Mock summary — real data coming once RAG is connected.",
            "eligibility": ["Mock eligibility point 1", "Mock eligibility point 2"],
            "documents": ["Aadhaar Card", "Income Certificate"],
            "source": "mock-data"
        },
        "accessible_output": {
            "text": f"Here is information about {gesture}.",
            "audio_available": False
        }
    }