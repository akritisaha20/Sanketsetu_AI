from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

app = FastAPI(title="Sanket Setu AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class ProcessRequest(BaseModel):
    input_type: str          # "sign" | "voice" | "text" etc.
    input: str
    confidence: Optional[float] = None
    session_id: str

@app.get("/api/v1/health")
def health():
    return {"status": "ok"}

@app.post("/api/v1/process")
def process(req: ProcessRequest):
    # TODO: replace with real ISL -> Orchestrator -> RAG pipeline
    return {
        "status": "success",
        "intent": "government_information",
        "response": {
            "title": "Scholarship Information",
            "summary": "Mock summary — real data coming once RAG is connected.",
            "eligibility": ["Mock eligibility point 1", "Mock eligibility point 2"],
            "documents": ["Aadhaar Card", "Income Certificate"],
            "source": "mock-data"
        },
        "accessible_output": {
            "text": "This is a mock response for testing.",
            "audio_available": False
        }
    }