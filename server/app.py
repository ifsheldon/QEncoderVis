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
from routes.get_original_data import get_original_data

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
    epoch_number: int
    lr: float


def get_dataset_source(circuit_id: int):
    return f"Data/dataset_{circuit_id}.csv"


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


@app.route("/api/get_original_data", methods=["GET"])
def get_original_data_route():
    circuit_id = request.args.get("circuit_id")
    return jsonify(get_original_data(get_dataset_source(circuit_id)))


@app.route("/api/run_circuit", methods=["POST"])
def run_circuit():
    payload = request.get_json(silent=True) or {}
    try:
        req = CircuitRequest.model_validate(payload)
    except ValidationError as ve:
        return jsonify({"error": "Validation error", "details": ve.errors()}), 422

    circuit_id = req.circuit
    encoder_name = req.encoder_name

    params = {}
    if encoder_name is None:
        encoder = encoders[default_encoders[circuit_id]]
    else:
        encoder = encoders.get(encoder_name, None)
        if encoder is None:
            raise ValueError(f"Unknown encoder name: {encoder_name}")
    params["encoder"] = encoder
    params["dataset_source"] = get_dataset_source(circuit_id)
    params["epoch_number"] = req.epoch_number
    params["lr"] = req.lr

    # Call the selected circuit runner and return its result (already plain types)
    np.random.seed(SEED)
    return run_circuit_train(**params)


if __name__ == "__main__":
    app.run(port=3030)
