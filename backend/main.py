import os
from typing import List, Literal, Optional

from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field

from services.isl.predictor import predict_gesture, is_confident

# .env se config load karo
load_dotenv()
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")

app = FastAPI(title="Sanket Setu AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------- Request schema (with validation) ----------
class ProcessRequest(BaseModel):
    input_type: Literal["sign", "voice", "text"]
    input: str = Field(min_length=1)
    confidence: Optional[float] = Field(default=None, ge=0.0, le=1.0)
    session_id: str = Field(min_length=1)


# ---------- Response schema ----------
class SchemeResponse(BaseModel):
    title: str
    summary: str
    eligibility: List[str]
    documents: List[str]
    source: str


class AccessibleOutput(BaseModel):
    text: str
    audio_available: bool


class ProcessResponse(BaseModel):
    status: str  # "success" | "low_confidence"
    intent: Optional[str] = None
    response: Optional[SchemeResponse] = None
    accessible_output: AccessibleOutput


# ---------- Error handlers (consistent error format) ----------
def error_body(code: str, message: str, details=None):
    return {
        "status": "error",
        "error": {"code": code, "message": message, "details": details or []},
        "accessible_output": {
            "text": "Sorry, something went wrong. Please try again.",
            "audio_available": False,
        },
    }


@app.exception_handler(RequestValidationError)
async def validation_error_handler(request: Request, exc: RequestValidationError):
    details = [
        {"field": ".".join(str(p) for p in e["loc"]), "message": e["msg"]}
        for e in exc.errors()
    ]
    return JSONResponse(
        status_code=422,
        content=error_body("INVALID_REQUEST", "Request body is invalid.", details),
    )


@app.exception_handler(Exception)
async def unhandled_error_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content=error_body("INTERNAL_ERROR", "Unexpected server error."),
    )


# ---------- Routes ----------
@app.get("/api/v1/health")
def health():
    return {"status": "ok"}


@app.post("/api/v1/process", response_model=ProcessResponse)
def process(req: ProcessRequest):

    if req.input_type == "sign":
        result = predict_gesture(req.input)
        label = result["label"]
        confidence = result["confidence"]

        if not is_confident(confidence):
            return {
                "status": "low_confidence",
                "intent": None,
                "response": None,
                "accessible_output": {
                    "text": "Could you please repeat the sign?",
                    "audio_available": True,
                },
            }
    else:
        label = req.input

    # TODO: Orchestrator + RAG yahan connect honge
    return {
        "status": "success",
        "intent": "government_information",
        "response": {
            "title": f"{label.title()} Information",
            "summary": "Mock summary — real data coming once RAG is connected.",
            "eligibility": ["Mock eligibility point 1", "Mock eligibility point 2"],
            "documents": ["Aadhaar Card", "Income Certificate"],
            "source": "mock-data",
        },
        "accessible_output": {
            "text": f"Here is information about {label}.",
            "audio_available": False,
        },
    }