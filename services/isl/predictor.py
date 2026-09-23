"""
ISL Gesture Predictor
----------------------
Placeholder wrapper around Aditi's model.
Jab Aditi ka real model (.pkl/.joblib) aa jaye, sirf
`load_model()` aur `predict_gesture()` ke andar ka code replace karna hai —
baaki backend ko kuch pata bhi nahi chalega.
"""

import random

# TODO: Aditi ka model yahan load karna hai, e.g.:
# import joblib
# model = joblib.load("services/isl/model.pkl")

MOCK_GESTURES = ["scholarship", "ration_card", "pension"]

# Aditi se confirm hone ke baad yeh value update karna
CONFIDENCE_THRESHOLD = 0.75


def predict_gesture(landmarks: list) -> dict:
    """
    Input: landmarks (list/array) — MediaPipe se nikla hua 84-D vector
           (21 points/hand x 2 hands x 2 coords), ya jo bhi Aditi confirm kare.

    Output: {"gesture": str, "confidence": float}
    """
    # TODO: replace with real inference:
    # prediction = model.predict([landmarks])
    # confidence = model.predict_proba([landmarks]).max()
    # return {"gesture": prediction[0], "confidence": float(confidence)}

    # --- Mock behaviour for now ---
    gesture = random.choice(MOCK_GESTURES)
    confidence = round(random.uniform(0.6, 0.99), 2)
    return {"status": "success", "label": gesture, "confidence": confidence}
   


def is_confident(confidence: float) -> bool:
    return confidence >= CONFIDENCE_THRESHOLD