import os
import mlflow
import mlflow.tensorflow

from src.data_loader import load_data
from src.model import build_model



mlflow.set_tracking_uri("sqlite:///mlflow.db")
mlflow.set_experiment("Animal_Image_Detection")
print("Tracking URI:", mlflow.get_tracking_uri())

def train_model():

    # Dataset paths
    train_dir = "dataset/train"
    test_dir = "dataset/test"

    # Set MLflow Experiment
    mlflow.set_experiment("Animal_Image_Detection")

    with mlflow.start_run():

        # ===========================
        # Load Dataset
        # ===========================
        train_data, test_data = load_data(train_dir, test_dir)

        # Detect number of classes automatically
        num_classes = train_data.num_classes

        print("\n✅ Number of classes detected:", num_classes)
        print("✅ Class indices:", train_data.class_indices)

        # ===========================
        # Log Parameters
        # ===========================
        mlflow.log_param("epochs", 20)
        mlflow.log_param("num_classes", num_classes)
        mlflow.log_param("batch_size", train_data.batch_size)
        mlflow.log_param("image_width", train_data.target_size[0])
        mlflow.log_param("image_height", train_data.target_size[1])

        # ===========================
        # Build Model
        # ===========================
        model = build_model(num_classes=num_classes)

        # ===========================
        # Train Model
        # ===========================
        history = model.fit(
            train_data,
            epochs=20,
            validation_data=test_data,
            verbose=1
        )

        # ===========================
        # Evaluate Model
        # ===========================
        test_loss, test_accuracy = model.evaluate(
            test_data,
            verbose=0
        )

        # ===========================
        # Log Final Metrics
        # ===========================
        mlflow.log_metric(
            "train_accuracy",
            history.history["accuracy"][-1]
        )

        mlflow.log_metric(
            "train_loss",
            history.history["loss"][-1]
        )

        mlflow.log_metric(
            "validation_accuracy",
            history.history["val_accuracy"][-1]
        )

        mlflow.log_metric(
            "validation_loss",
            history.history["val_loss"][-1]
        )

        mlflow.log_metric(
            "test_accuracy",
            test_accuracy
        )

        mlflow.log_metric(
            "test_loss",
            test_loss
        )

        # ===========================
        # Save Model
        # ===========================
        os.makedirs("model", exist_ok=True)

        model_path = "model/cnn_model.h5"

        model.save(model_path)

        print("\n✅ Model saved successfully.")

        # ===========================
        # Log Model in MLflow
        # ===========================
        mlflow.tensorflow.log_model(
            model=model,
            artifact_path="cnn_model"
        )

        # Save model file as artifact
        mlflow.log_artifact(model_path)

        print("✅ Model logged to MLflow")

        print("\n==============================")
        print(" Training Completed Successfully ")
        print("==============================")

        print(f"Training Accuracy   : {history.history['accuracy'][-1]:.4f}")
        print(f"Validation Accuracy: {history.history['val_accuracy'][-1]:.4f}")
        print(f"Test Accuracy      : {test_accuracy:.4f}")

        print("\nMLflow Run Completed Successfully")


if __name__ == "__main__":
    train_model()