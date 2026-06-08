import argparse
from pathlib import Path

import cv2
import imutils
import numpy as np
from tensorflow.keras.layers import (
    Activation,
    BatchNormalization,
    Conv2D,
    Dense,
    Flatten,
    Input,
    MaxPooling2D,
    ZeroPadding2D,
)
from tensorflow.keras.models import Model


def build_model(input_shape=(240, 240, 3)):
    x_input = Input(input_shape)
    x = ZeroPadding2D((2, 2))(x_input)
    x = Conv2D(32, (7, 7), strides=(1, 1), name="conv0")(x)
    x = BatchNormalization(axis=3, name="bn0")(x)
    x = Activation("relu")(x)
    x = MaxPooling2D((4, 4), name="max_pool0")(x)
    x = MaxPooling2D((4, 4), name="max_pool1")(x)
    x = Flatten()(x)
    x = Dense(1, activation="sigmoid", name="fc")(x)
    return Model(inputs=x_input, outputs=x, name="BrainDetectionModel")


def crop_brain_contour(image):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    gray = cv2.GaussianBlur(gray, (5, 5), 0)

    thresh = cv2.threshold(gray, 45, 255, cv2.THRESH_BINARY)[1]
    thresh = cv2.erode(thresh, None, iterations=2)
    thresh = cv2.dilate(thresh, None, iterations=2)

    cnts = cv2.findContours(thresh.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    cnts = imutils.grab_contours(cnts)
    c = max(cnts, key=cv2.contourArea)

    ext_left = tuple(c[c[:, :, 0].argmin()][0])
    ext_right = tuple(c[c[:, :, 0].argmax()][0])
    ext_top = tuple(c[c[:, :, 1].argmin()][0])
    ext_bot = tuple(c[c[:, :, 1].argmax()][0])

    return image[ext_top[1] : ext_bot[1], ext_left[0] : ext_right[0]]


def preprocess_image(image_path: Path):
    image = cv2.imread(str(image_path))
    if image is None:
        raise ValueError(f"Could not read image: {image_path}")

    image = crop_brain_contour(image)
    image = cv2.resize(image, (240, 240), interpolation=cv2.INTER_CUBIC)
    image = image / 255.0
    return np.expand_dims(image, axis=0)


def main():
    parser = argparse.ArgumentParser(description="Run brain tumor detection on one MRI image")
    parser.add_argument("image", type=Path, help="Path to MRI image file")
    parser.add_argument(
        "--weights",
        type=Path,
        default=Path("models/cnn-parameters-improvement-23-0.91.h5"),
        help="Path to model weights in .h5 format",
    )
    args = parser.parse_args()

    if not args.weights.exists():
        raise FileNotFoundError(
            f"Weights file not found: {args.weights}.\n"
            "If you only have .model file, copy or rename it to .h5 first."
        )

    model = build_model((240, 240, 3))
    model.load_weights(str(args.weights))

    x = preprocess_image(args.image)
    prob = float(model.predict(x, verbose=0)[0][0])
    label = "yes (tumor)" if prob >= 0.5 else "no (no tumor)"

    print(f"Image: {args.image}")
    print(f"Tumor probability: {prob:.4f}")
    print(f"Prediction: {label}")


if __name__ == "__main__":
    main()
