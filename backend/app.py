from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
import cv2
import os

# Memory optimization for low-RAM environments
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
os.environ['TF_FORCE_GPU_ALLOW_GROWTH'] = 'true'
tf.config.threading.set_inter_op_parallelism_threads(1)
tf.config.threading.set_intra_op_parallelism_threads(1)

app = Flask(__name__)
CORS(app)

# Load model ONCE without optimizer (saves memory)
model = tf.keras.models.load_model("model/cnn_model_optimized.h5", compile=False)

# ⚠️ MUST match training class order
class_names = ["cat", "dog", "elephant", "lion", "tiger"]

@app.route("/")
def home():
    return "Backend is running ✅"

@app.route("/predict", methods=["POST"])
def predict():
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    file = request.files["image"]

    image_path = "temp.png"
    file.save(image_path)

    # Read & preprocess image
    img = cv2.imread(image_path)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img = cv2.resize(img, (224,224))
    img = img / 255.0
    img = np.expand_dims(img, axis=0)

    # Predict
    predictions = model.predict(img)
    predicted_index = int(np.argmax(predictions))
    confidence = float(np.max(predictions))

    animal = class_names[predicted_index]

    os.remove(image_path)

    return jsonify({
        "animal": animal,
        "confidence": round(confidence * 100, 2)
    })

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
