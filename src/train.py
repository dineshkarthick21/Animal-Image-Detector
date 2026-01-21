from src.data_loader import load_data
from src.model import build_model
import os

def train_model():

    train_dir = "dataset/train"
    test_dir = "dataset/test"

    # Load dataset
    train_data, test_data = load_data(train_dir, test_dir)

    # IMPORTANT: detect number of classes automatically
    num_classes = train_data.num_classes
    print("✅ Number of classes detected:", num_classes)
    print("✅ Class indices:", train_data.class_indices)

    # Build model for multi-class
    model = build_model(num_classes=num_classes)

    # Train model
    model.fit(
        train_data,
        epochs=20,                 # 🔥 increased epochs
        validation_data=test_data
    )

    # Save trained model
    os.makedirs("model", exist_ok=True)
    model.save("model/cnn_model.h5")

    print("✅ Multi-class model trained and saved successfully")

if __name__ == "__main__":
    train_model()
