from app.rag import retrieve
from app.llm import generate_answer, generate_general_answer


# =========================================================
# INTENT → MODULE ROUTING
# =========================================================

INTENT_ROUTING = {
    "government_information": "rag",
    "sign_translation": "sign",
    "object_description": "vision",
    "document_simplification": "lexi",
    "general_question": "llm"
}


# =========================================================
# INTENT UNDERSTANDING
# =========================================================

def understand_intent(input_type, content):

    text = content.lower().strip()

    # Sign input
    if input_type == "sign":
        return "government_information"

    # Image input
    if input_type == "image":
        return "object_description"

    # Document input
    if input_type == "document":
        return "document_simplification"

    # Text input
    if input_type == "text":

        government_keywords = [
            "pension",
            "scholarship",
            "udid",
            "disability",
            "certificate",
            "government",
            "scheme",
            "eligibility",
            "documents",
            "apply",
            "application",
            "benefits",
            "subsidy",
            "allowance",
            "government service"
        ]

        if any(keyword in text for keyword in government_keywords):
            return "government_information"

        return "general_question"

    return "general_question"


# =========================================================
# MAIN ORCHESTRATOR
# =========================================================

def orchestrate(input_type, content, confidence=None):

    # -----------------------------------------
    # 1. Understand user intent
    # -----------------------------------------

    intent = understand_intent(input_type, content)

    # -----------------------------------------
    # 2. Select module
    # -----------------------------------------

    module = INTENT_ROUTING.get(intent, "llm")


    # =====================================================
    # GOVERNMENT INFORMATION → RAG
    # =====================================================

    if module == "rag":

        retrieved_docs = retrieve(content, top_k=3)

        # No verified information found
        if not retrieved_docs:

            return {
                "success": False,
                "input_type": input_type,
                "prediction": content if input_type == "sign" else None,
                "intent": intent,
                "module_used": "rag",
                "response": (
                    "I could not find enough verified information "
                    "in the available government sources."
                ),
                "confidence": confidence,
                "sources": [],
                "grounded": False
            }

        # Generate grounded answer
        result = generate_answer(
            content,
            retrieved_docs
        )

        # -----------------------------------------
        # Collect unique sources
        # -----------------------------------------

        sources = []

        for doc in retrieved_docs:

            source = {
                "title": doc["title"],
                "section": doc["section"],
                "url": doc["source_url"]
            }

            if source not in sources:
                sources.append(source)

        return {
            "success": result["grounded"],
            "input_type": input_type,
            "prediction": content if input_type == "sign" else None,
            "intent": intent,
            "module_used": "rag",
            "response": result["answer"],
            "confidence": confidence,
            "sources": sources,
            "grounded": result["grounded"]
        }


    # =====================================================
    # GENERAL QUESTION → LLM
    # =====================================================

    if module == "llm":

        answer = generate_general_answer(content)

        return {
            "success": True,
            "input_type": input_type,
            "prediction": None,
            "intent": "general_question",
            "module_used": "llm",
            "response": answer,
            "confidence": confidence,
            "sources": [],
            "grounded": False
        }


    # =====================================================
    # OTHER MODULES — SIGN / VISION / LEXI
    # =====================================================

    return {
        "success": True,
        "input_type": input_type,
        "prediction": content if input_type == "sign" else None,
        "intent": intent,
        "module_used": module,
        "response": f"{module} module will handle this request.",
        "confidence": confidence,
        "sources": [],
        "grounded": False
    }