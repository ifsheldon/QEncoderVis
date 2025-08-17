from flask import Flask, request, jsonify
from flask_cors import CORS
from pydantic import BaseModel, Field, ValidationError, field_validator
from functions.feature_mapping import (
    ALLOWED_FEATURE_MAP_NAMES,
    get_feature_map_by_name,
    DEFAULT_FEATURE_MAP_BY_CIRCUIT,
)

from routes.run_circuit_0 import run_circuit_0
from routes.run_circuit_1 import run_circuit_1
from routes.run_circuit_2 import run_circuit_2
from routes.run_circuit_3 import run_circuit_3
from routes.run_circuit_4 import run_circuit_4
from routes.run_circuit_5 import run_circuit_5
from pennylane import numpy as np
from routes.hyperparameters import SEED


app = Flask(__name__)
CORS(app)


app.config["ENV"] = "development"  # 'production
app.config["DEBUG"] = True


# Allowed circuit ids
ALLOWED_CIRCUITS = {0, 1, 2, 3, 4, 5}


class CircuitRequest(BaseModel):
    """Pydantic model for /api/run_circuit request body."""

    circuit: int = Field(..., description="Circuit id (one of 0,1,2,3,4,5)")
    feature_map: str | None = Field(
        None,
        description="Feature map class name, e.g., 'FMArcsin'. Optional; defaults per circuit.",
    )

    @field_validator("circuit")
    @classmethod
    def circuit_must_be_allowed(cls, value: int) -> int:
        if value not in ALLOWED_CIRCUITS:
            raise ValueError(
                f"Invalid circuit id {value}. Allowed: {sorted(list(ALLOWED_CIRCUITS))}"
            )
        return value

    @field_validator("feature_map")
    @classmethod
    def feature_map_must_be_known(cls, value: str | None) -> str | None:
        if value is None:
            return value
        if value not in ALLOWED_FEATURE_MAP_NAMES:
            raise ValueError(
                f"Unknown feature map '{value}'. Allowed: {sorted(list(ALLOWED_FEATURE_MAP_NAMES))}"
            )
        return value


@app.route("/")
# @cross_origin(origin='*')
def index():
    try:
        return "success"

    except Exception as e:
        print(e)
        return "error"


@app.route("/api/run_circuit", methods=["POST"])
def run_circuit():
    try:
        payload = request.get_json(silent=True) or {}
        try:
            req = CircuitRequest.model_validate(payload)
        except ValidationError as ve:
            return jsonify({"error": "Validation error", "details": ve.errors()}), 422

        circuit_id = req.circuit
        feature_map_name = req.feature_map or DEFAULT_FEATURE_MAP_BY_CIRCUIT.get(circuit_id)

        circuit_map = {
            0: run_circuit_0,
            1: run_circuit_1,
            2: run_circuit_2,
            3: run_circuit_3,
            4: run_circuit_4,
            5: run_circuit_5,
        }

        # Call the selected circuit runner and return its result (already plain types)
        np.random.seed(SEED)
        circuit = circuit_map[circuit_id]
        return circuit(feature_map_name)

    except Exception as e:
        print(e)
        return "error"


if __name__ == "__main__":
    app.run(port=3030)
