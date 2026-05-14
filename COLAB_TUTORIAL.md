# Pneumonia Detection Tutorial & Training Notebook

This section provides the logic for training a custom Deep Learning model on Google Colab using the Kaggle Pneumonia dataset.

## 1. Google Colab Training Script (Python)

Copy and paste the following code into a [Google Colab](https://colab.research.google.com/) cell.

```python
# --- INSTALL & IMPORTS ---
!pip install tensorflow matplotlib seaborn sklearn

import os
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import AveragePooling2D, Dropout, Flatten, Dense, Input
from tensorflow.keras.models import Model
from tensorflow.keras.optimizers import Adam
from sklearn.metrics import classification_report, confusion_matrix

# --- DATASET SETUP ---
# You need to upload your kaggle.json to Colab or download the dataset manually
# dataset_path = 'chest_xray' 

# --- PREPROCESSING ---
INIT_LR = 1e-4
EPOCHS = 20
BS = 32

trainAug = ImageDataGenerator(
    rotation_range=15,
    fill_mode="nearest",
    rescale=1./255
)

valAug = ImageDataGenerator(rescale=1./255)

# --- MODEL BUILDING (Transfer Learning) ---
# Why MobileNetV2? It is lightweight and perfect for mobile/web deployment.
baseModel = MobileNetV2(weights="imagenet", include_top=False,
    input_tensor=Input(shape=(224, 224, 3)))

headModel = baseModel.output
headModel = AveragePooling2D(pool_size=(7, 7))(headModel)
headModel = Flatten(name="flatten")(headModel)
headModel = Dense(128, activation="relu")(headModel)
headModel = Dropout(0.5)(headModel)
headModel = Dense(2, activation="softmax")(headModel)

model = Model(inputs=baseModel.input, outputs=headModel)

# Freeze base layers
for layer in baseModel.layers:
    layer.trainable = False

# --- TRAINING ---
opt = Adam(learning_rate=INIT_LR)
model.compile(loss="binary_crossentropy", optimizer=opt, metrics=["accuracy"])

# Assuming you have trainGen and valGen set up from directory
# H = model.fit(trainGen, ...)

# --- SAVING ---
model.save("pneumonia_model.h5")
```

## 2. Python FastAPI Backend (main.py)

This is the code for the local Python backend using FastAPI.

```python
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import tensorflow as tf
import numpy as np
from PIL import Image
import io

app = FastAPI()

# Enable CORS for React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the trained model
MODEL = tf.keras.models.load_model("pneumonia_model.h5")
CLASS_NAMES = ["NORMAL", "PNEUMONIA"]

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    # Read image
    image = Image.open(io.BytesIO(await file.read())).convert('RGB')
    image = image.resize((224, 224))
    image_array = np.array(image) / 255.0
    image_array = np.expand_dims(image_array, axis=0)

    # Predict
    predictions = MODEL.predict(image_array)
    predicted_class = CLASS_NAMES[np.argmax(predictions[0])]
    confidence = float(np.max(predictions[0]))

    return {
        "label": predicted_class,
        "confidence": confidence
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

## 3. Key Concepts Explained

### What is a CNN?
A **Convolutional Neural Network (CNN)** is a type of deep learning model specialized for processing structured grid data, such as images. It uses "filters" (kernels) to automatically detect patterns like edges, textures, and eventually complex features like "lung opacities."

### What is Transfer Learning?
Transfer Learning is a technique where we take a model trained on a massive dataset (like ImageNet with 1 million images) and "fine-tune" it for our specific task. This saves time and requires much less data to achieve high accuracy.

### Why MobileNetV2?
MobileNetV2 is optimized for speed and low memory usage. In a medical context, it allows for fast analysis on standard hardware without needing high-end GPUs.
