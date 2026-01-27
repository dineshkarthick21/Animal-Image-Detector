"""
Strips optimizer state from the model to reduce memory usage for deployment.
Run this once before deploying to Render.
"""
import tensorflow as tf

print("Loading original model...")
model = tf.keras.models.load_model("model/cnn_model.h5", compile=False)

print("Saving optimized model without optimizer state...")
model.save("model/cnn_model_optimized.h5", include_optimizer=False)

print("✅ Done! Use cnn_model_optimized.h5 for deployment")
print(f"File size comparison:")
import os
original_size = os.path.getsize("model/cnn_model.h5") / (1024**2)
optimized_size = os.path.getsize("model/cnn_model_optimized.h5") / (1024**2)
print(f"  Original:  {original_size:.2f} MB")
print(f"  Optimized: {optimized_size:.2f} MB")
print(f"  Saved:     {original_size - optimized_size:.2f} MB")
