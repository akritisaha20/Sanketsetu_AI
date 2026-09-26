from fastapi import FastAPI
from pydantic import BaseModel

from app.orchestrator import orchestrate


app = FastAPI(title="Sanket Setu API")


class QueryRequest(BaseModel):
    input_type: str = "text"
    input: str
    confidence: float | None = None


@app.get("/")
def home():
    return {
        "message": "Sanket Setu API is running"
    }


@app.post("/query")
def query(request: QueryRequest):

    result = orchestrate(
        input_type=request.input_type,
        content=request.input,
        confidence=request.confidence
    )

    return result