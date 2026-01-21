from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, Dropout

def build_model(input_shape=(224,224,3), num_classes=5):
    """
    num_classes = number of animal categories
    Example: cat, dog, lion, tiger, elephant → 5
    """

    model = Sequential([
        Conv2D(32, (3,3), activation='relu', input_shape=input_shape),
        MaxPooling2D(2,2),

        Conv2D(64, (3,3), activation='relu'),
        MaxPooling2D(2,2),

        Conv2D(128, (3,3), activation='relu'),
        MaxPooling2D(2,2),

        Flatten(),
        Dense(256, activation='relu'),
        Dropout(0.5),                 # ✅ prevents overfitting

        Dense(num_classes, activation='softmax')  # ✅ MULTI-CLASS
    ])

    model.compile(
        optimizer='adam',
        loss='categorical_crossentropy',  # ✅ for multi-class
        metrics=['accuracy']
    )

    return model
