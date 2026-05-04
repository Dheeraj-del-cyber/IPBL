import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import EfficientNetB0
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
from tensorflow.keras.models import Model
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau
import os
import numpy as np
from sklearn.utils import class_weight

# Configuration
TRAIN_DIR = 'dataset_combined/train'
VAL_DIR = 'dataset_combined/val'
MODEL_NAME = 'model.h5'
IMG_SIZE = (224, 224)
BATCH_SIZE = 16 
EPOCHS = 15 # More epochs for actual learning

def train_model():
    print("--- [ACCURACY BOOST] Loading Data with EfficientNet Preprocessing ---")
    
    # EfficientNet has its own preprocessing (standardizing pixels)
    from tensorflow.keras.applications.efficientnet import preprocess_input

    train_datagen = ImageDataGenerator(
        preprocessing_function=preprocess_input,
        rotation_range=30,
        width_shift_range=0.2,
        height_shift_range=0.2,
        shear_range=0.2,
        zoom_range=0.3,
        horizontal_flip=True,
        vertical_flip=True, # Added for leaf orientation variety
        fill_mode='nearest'
    )
    
    val_datagen = ImageDataGenerator(preprocessing_function=preprocess_input)

    train_generator = train_datagen.flow_from_directory(
        TRAIN_DIR,
        target_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        class_mode='categorical'
    )

    val_generator = val_datagen.flow_from_directory(
        VAL_DIR,
        target_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        class_mode='categorical'
    )

    num_classes = len(train_generator.class_indices)
    print(f"Detected {num_classes} categories.")

    print("--- Building High-Precision Architecture (EfficientNetB0) ---")
    
    # Load base model with ImageNet weights
    base_model = EfficientNetB0(weights='imagenet', include_top=False, input_shape=(*IMG_SIZE, 3))
    
    # Unfreeze top layers for fine-tuning
    base_model.trainable = True
    
    x = base_model.output
    x = GlobalAveragePooling2D()(x)
    x = Dropout(0.3)(x) # Add dropout to prevent overfitting
    x = Dense(512, activation='relu')(x)
    predictions = Dense(num_classes, activation='softmax')(x)

    model = Model(inputs=base_model.input, outputs=predictions)

    # Low learning rate is critical when unfreezing the base
    model.compile(
        optimizer=Adam(learning_rate=0.0001),
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )

    # Handle class imbalance (if some diseases have fewer photos)
    class_indices = train_generator.classes
    weights = class_weight.compute_class_weight(
        class_weight='balanced',
        classes=np.unique(class_indices),
        y=class_indices
    )
    class_weights = dict(enumerate(weights))

    # Callbacks to keep training efficient
    callbacks = [
        EarlyStopping(monitor='val_loss', patience=5, restore_best_weights=True),
        ReduceLROnPlateau(monitor='val_loss', factor=0.5, patience=3, min_lr=1e-6)
    ]

    print(f"--- Starting High-Accuracy Training ({EPOCHS} Epochs Max) ---")
    history = model.fit(
        train_generator,
        epochs=EPOCHS,
        validation_data=val_generator,
        class_weight=class_weights,
        callbacks=callbacks
    )

    # Save the model
    model.save(MODEL_NAME)
    print(f"--- Boosted Model saved as {MODEL_NAME} ---")

    final_val_acc = history.history['val_accuracy'][-1]
    print(f"\nTraining Complete. Final Validation Accuracy: {final_val_acc:.4f}")

if __name__ == "__main__":
    if os.path.exists(TRAIN_DIR):
        train_model()
    else:
        print(f"Error: Dataset not found at {TRAIN_DIR}")
