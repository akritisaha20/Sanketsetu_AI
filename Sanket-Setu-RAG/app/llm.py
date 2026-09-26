import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

MODEL = "openai/gpt-oss-20b"


# =========================================================
# 1. RAG + LLM
# =========================================================

def generate_answer(query, retrieved_docs):

    if not retrieved_docs:
        return {
            "answer": "I could not find enough verified information in the available government sources.",
            "grounded": False
        }

    context = ""

    for doc in retrieved_docs:
        context += f"""
Service: {doc['service']}
Section: {doc['section']}
Information: {doc['content']}
Source: {doc['source_url']}
---
"""

    prompt = f"""
You are Sanket Setu, an accessibility-focused government information assistant.

Answer the user's question ONLY using the retrieved verified information below.

Rules:
1. Do not invent information.
2. Do not use outside knowledge for government information.
3. Do not add examples, documents, numbers, eligibility conditions,
   dates or facts that are not explicitly present in the context.
4. If the context does not contain enough information, clearly say:
   "I could not find enough verified information in the available government sources."
5. Keep the answer simple and easy to understand.
6. Clearly mention important requirements when available.
7. Do not change official rules or conditions.
8. Mention the official source at the end.

User Question:
{query}

Retrieved Verified Information:
{context}
"""

    response = client.chat.completions.create(
        model=MODEL,
        messages=[
            {
                "role": "system",
                "content": "Answer only from the supplied verified context."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0
    )

    return {
        "answer": response.choices[0].message.content,
        "grounded": True
    }


# =========================================================
# 2. GENERAL LLM
# =========================================================

def generate_general_answer(query):

    response = client.chat.completions.create(
        model=MODEL,
        messages=[
            {
                "role": "system",
                "content": """
You are Sanket Setu, a helpful and accessible AI assistant.

Answer the user's question clearly and simply.

You can answer general questions about:
- Education
- Technology
- Programming
- AI and Machine Learning
- Science
- General knowledge
- Everyday topics

Do not make up facts.
If you are unsure about something, say that you are not certain.

Use simple language and helpful examples when appropriate.
"""
            },
            {
                "role": "user",
                "content": query
            }
        ],
        temperature=0.3
    )

    return response.choices[0].message.content