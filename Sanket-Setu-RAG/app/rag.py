from pathlib import Path
import pickle

import faiss
from sentence_transformers import SentenceTransformer


ROOT = Path(__file__).resolve().parents[1]

INDEX_PATH = ROOT / "index" / "knowledge.index"
DOCS_PATH = ROOT / "index" / "documents.pkl"

model = SentenceTransformer("all-MiniLM-L6-v2")

index = faiss.read_index(str(INDEX_PATH))

with open(DOCS_PATH, "rb") as f:
    documents = pickle.load(f)


# Minimum similarity required to consider a document relevant
SIMILARITY_THRESHOLD = 0.65


def retrieve(query: str, top_k: int = 3):

    query_embedding = model.encode(
        [query],
        normalize_embeddings=True
    )

    scores, indices = index.search(
        query_embedding,
        top_k
    )

    results = []

    for score, idx in zip(scores[0], indices[0]):

        if idx == -1:
            continue

        # Ignore weak / irrelevant matches
        if float(score) < SIMILARITY_THRESHOLD:
            continue

        doc = documents[idx].copy()

        doc["score"] = float(score)

        results.append(doc)

    return results