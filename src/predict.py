import tensorflow as tf
import numpy as np
import cv2
import os

def predict_image(image_path):

    if not os.path.exists(image_path):
        print("❌ Image not found:", image_path)
        return

    # Load trained multi-class model
    model = tf.keras.models.load_model("model/cnn_model.h5")

    # Read & preprocess image
    img = cv2.imread(image_path)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)   # ✅ IMPORTANT
    img = cv2.resize(img, (224,224))
    img = img / 255.0
    img = np.expand_dims(img, axis=0)

    # Predict
    predictions = model.predict(img)
    predicted_index = np.argmax(predictions)
    confidence = np.max(predictions)

    # ⚠️ MUST MATCH training class order
    class_names = ["cat", "dog", "elephant", "lion", "tiger"]

    result = f"{class_names[predicted_index]} ({confidence*100:.2f}%)"

    print("🧠 Prediction:", result)
