from flask import Flask, request, jsonify
from flask_cors import CORS
from pydantic import BaseModel, ValidationError

from functions.encoding import (
    EncoderRxxRyyCnot,
    EncoderRxyCnot,
    EncoderRyyRzz,
    EncoderRyyRxx,
    EncoderRzzRyyCnot,
    EncoderRyRz,
    EncoderRyzRyz,
    EncoderRyxRyx,
    EncoderRzyRzy,
    EncoderRzzRyy,
)
from routes.hyperparameters import DEFAULT_EPOCH_NUMBER, DEFAULT_LR
from routes.run_circuit import run_circuit as run_circuit_train
from pennylane import numpy as np
from routes.hyperparameters import SEED
from typing import Literal

encoders = {
    "RxxRyyCnot": EncoderRxxRyyCnot(),
    "RxyCnot": EncoderRxyCnot(),
    "RyyRzz": EncoderRyyRzz(),
    "RyyRxx": EncoderRyyRxx(),
    "RzzRyyCnot": EncoderRzzRyyCnot(),
    "RyRz": EncoderRyRz(),
    "RyzRyz": EncoderRyzRyz(),
    "RyxRyx": EncoderRyxRyx(),
    "RzyRzy": EncoderRzyRzy(),
    "RzzRyy": EncoderRzzRyy(),
}

default_encoders = {
    0: "RxxRyyCnot",
    1: "RxyCnot",
    2: "RyyRzz",
    3: "RyyRxx",
    4: "RzzRyyCnot",
    5: "RzzRyyCnot",
}

app = Flask(__name__)
CORS(app)


app.config["ENV"] = "development"  # 'production
app.config["DEBUG"] = True


class CircuitRequest(BaseModel):
    """Pydantic model for /api/run_circuit request body."""

    circuit: Literal[0, 1, 2, 3, 4, 5]
    encoder_name: str | None = None


@app.route("/")
def index():
    return "success"


@app.route("/api/get_encoders", methods=["GET"])
def get_encoders():
    return jsonify(
        {
            "encoders": {name: encoder.steps() for name, encoder in encoders.items()},
            "defaults": default_encoders,
        }
    )


@app.route("/api/run_circuit", methods=["POST"])
def run_circuit():
    payload = request.get_json(silent=True) or {}
    try:
        req = CircuitRequest.model_validate(payload)
    except ValidationError as ve:
        return jsonify({"error": "Validation error", "details": ve.errors()}), 422

    circuit_id = req.circuit
    encoder_name = req.encoder_name

    default_params = {
        0: {
            "epoch_number": DEFAULT_EPOCH_NUMBER,
            "lr": DEFAULT_LR,
            "dataset_source": "Data/dataset_0.csv",
        },
        1: {
            "epoch_number": DEFAULT_EPOCH_NUMBER,
            "lr": DEFAULT_LR,
            "dataset_source": "Data/dataset_1.csv",
        },
        2: {
            "epoch_number": DEFAULT_EPOCH_NUMBER,
            "lr": DEFAULT_LR,
            "dataset_source": "Data/dataset_2.csv",
        },
        3: {
            "epoch_number": DEFAULT_EPOCH_NUMBER,
            "lr": DEFAULT_LR,
            "dataset_source": "Data/dataset_3.csv",
        },
        4: {
            "epoch_number": DEFAULT_EPOCH_NUMBER,
            "lr": DEFAULT_LR,
            "dataset_source": "Data/dataset_4.csv",
        },
        5: {
            "epoch_number": DEFAULT_EPOCH_NUMBER,
            "lr": 0.2,
            "dataset_source": "Data/dataset_5.csv",
        },
    }

    params = default_params[circuit_id]
    if encoder_name is None:
        encoder = encoders[default_encoders[circuit_id]]
    else:
        encoder = encoders.get(encoder_name, None)
        if encoder is None:
            raise ValueError(f"Unknown encoder name: {encoder_name}")
    params["encoder"] = encoder

    # Call the selected circuit runner and return its result (already plain types)
    np.random.seed(SEED)
    return run_circuit_train(**params)


if __name__ == "__main__":
    app.run(port=3030)
