from flask import Flask, request, jsonify
from flask_cors import CORS
from pydantic import BaseModel, ValidationError

from functions.encoding import (
    EncoderRxRyCnot,
    EncoderRxyCnot,
    EncoderRyRz,
    EncoderRyRx,
    EncoderRzRyCnot,
)
from routes.hyperparameters import DEFAULT_EPOCH_NUMBER, DEFAULT_LR
from routes.run_circuit import run_circuit as run_circuit_train
from pennylane import numpy as np
from routes.hyperparameters import SEED
from typing import Literal


app = Flask(__name__)
CORS(app)


app.config["ENV"] = "development"  # 'production
app.config["DEBUG"] = True


class CircuitRequest(BaseModel):
    """Pydantic model for /api/run_circuit request body."""

    circuit: Literal[0, 1, 2, 3, 4, 5]
    encoder_name: Literal["RxRyCnot", "RxyCnot", "RyRz", "RyRx", "RzRyCnot"] | None = None


@app.route("/")
def index():
    return "success"


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
            "encoder": EncoderRxRyCnot(),
            "epoch_number": DEFAULT_EPOCH_NUMBER,
            "lr": DEFAULT_LR,
            "dataset_source": "Data/dataset_0.csv",
        },
        1: {
            "encoder": EncoderRxyCnot(),
            "epoch_number": DEFAULT_EPOCH_NUMBER,
            "lr": DEFAULT_LR,
            "dataset_source": "Data/dataset_1.csv",
        },
        2: {
            "encoder": EncoderRxRyCnot(),
            "epoch_number": DEFAULT_EPOCH_NUMBER,
            "lr": DEFAULT_LR,
            "dataset_source": "Data/dataset_2.csv",
        },
        3: {
            "encoder": EncoderRyRz(),
            "epoch_number": DEFAULT_EPOCH_NUMBER,
            "lr": DEFAULT_LR,
            "dataset_source": "Data/dataset_3.csv",
        },
        4: {
            "encoder": EncoderRyRx(),
            "epoch_number": DEFAULT_EPOCH_NUMBER,
            "lr": DEFAULT_LR,
            "dataset_source": "Data/dataset_4.csv",
        },
        5: {
            "encoder": EncoderRzRyCnot(),
            "epoch_number": DEFAULT_EPOCH_NUMBER,
            "lr": 0.2,
            "dataset_source": "Data/dataset_5.csv",
        },
    }

    params = default_params[circuit_id]
    if encoder_name is not None:
        if encoder_name == "RxRyCnot":
            params["encoder"] = EncoderRxRyCnot()
        elif encoder_name == "RxyCnot":
            params["encoder"] = EncoderRxyCnot()
        elif encoder_name == "RyRz":
            params["encoder"] = EncoderRyRz()
        elif encoder_name == "RyRx":
            params["encoder"] = EncoderRyRx()
        elif encoder_name == "RzRyCnot":
            params["encoder"] = EncoderRzRyCnot()
        else:
            raise ValueError(f"Unknown encoder name: {encoder_name}")

    # Call the selected circuit runner and return its result (already plain types)
    np.random.seed(SEED)
    return run_circuit_train(**params)


if __name__ == "__main__":
    app.run(port=3030)
