import json
import pickle
from pathlib import Path

import faiss
from sentence_transformers import SentenceTransformer


ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "data"
INDEX_DIR = ROOT / "index"

INDEX_DIR.mkdir(exist_ok=True)

documents = []

for file_path in DATA_DIR.glob("*.json"):
    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    documents.extend(data)

print(f"Loaded {len(documents)} chunks")

model = SentenceTransformer("all-MiniLM-L6-v2")

texts = [
    f"{doc['service']} {doc['section']} {doc['content']}"
    for doc in documents
]

embeddings = model.encode(
    texts,
    normalize_embeddings=True
)

dimension = embeddings.shape[1]

index = faiss.IndexFlatIP(dimension)
index.add(embeddings)

faiss.write_index(
    index,
    str(INDEX_DIR / "knowledge.index")
)

with open(INDEX_DIR / "documents.pkl", "wb") as f:
    pickle.dump(documents, f)

print("FAISS index created successfully.")
print(f"Total vectors: {index.ntotal}")