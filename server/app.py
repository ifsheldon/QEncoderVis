import os
from flask import Flask, request, jsonify, Response
from flask_cors import CORS
from pydantic import BaseModel, ValidationError

from functions.encoding import (
    EncoderRxxRyyCnot,
    EncoderRxxRyyRyyCnot,
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
from routes.run_circuit import run_circuit as run_circuit_train, get_data
from routes.run_circuit import run_circuit_stream, DELAY_BETWEEN_EPOCHS
from pennylane import numpy as np
from functions.hyperparameters import SEED
from typing import Literal
import uuid
import json
import threading
import time
from datetime import datetime, timedelta
import pickle

encoders = {
    "RxxRyyCnot": EncoderRxxRyyCnot(),
    "RxxRyyRyyCnot": EncoderRxxRyyRyyCnot(),
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
CORS(
    app,
    origins=[
        "http://localhost:3000",
        "https://xqai-encoder.reify.ing",
        "https://q-encoder-vis.vercel.app",
        "https://xqai-eyes.vercel.app",
    ],
)


app.config["ENV"] = "production"  # 'production
app.config["DEBUG"] = False


class CircuitRequest(BaseModel):
    """Pydantic model for /api/run_circuit request body."""

    circuit: Literal[0, 1, 2, 3, 4, 5]
    encoder_name: str | None = None
    epoch_number: int
    lr: float


def get_dataset_source(circuit_id: int):
    return f"Data/dataset_{circuit_id}.csv"


# --- Session management (for streaming control) ---
SESSIONS = {}
SESSION_TTL_SECONDS = 3600


def _now():
    return datetime.utcnow()


def _cleanup_sessions():
    while True:
        try:
            time.sleep(3600)
            deadline = _now() - timedelta(seconds=SESSION_TTL_SECONDS)
            to_delete = []
            for sid, sess in list(SESSIONS.items()):
                last_touch = sess.get("last_touch") or sess.get("created_at")
                if last_touch is None or last_touch < deadline:
                    to_delete.append(sid)
            for sid in to_delete:
                SESSIONS.pop(sid, None)
        except Exception:
            # best-effort cleaner
            pass


cleanup_thread = threading.Thread(target=_cleanup_sessions, daemon=True)
cleanup_thread.start()


@app.route("/")
def index():
    return "success"


@app.route("/api/get_encoders", methods=["GET"])
def get_encoders():
    return jsonify(
        {
            "encoders": {
                name: {
                    "steps": encoder.steps(),
                    "feature_map_formula": encoder.get_feature_mapping().get_formula(),
                }
                for name, encoder in encoders.items()
            },
            "defaults": default_encoders,
        }
    )


@app.route("/api/get_data", methods=["GET"])
def get_all_data_route():
    circuit_id = request.args.get("circuit_id")
    encoder_name = request.args.get("encoder_name")
    encoder = encoders[encoder_name]
    (
        original_features,
        original_labels,
        expvalues,
        probs_measure_q0_1,
        probs_measure_q0_0,
        distribution_map,
    ) = get_data(get_dataset_source(circuit_id), encoder)
    original_features = original_features.tolist()
    original_labels = original_labels.tolist()
    flag_list = encoder.flags()
    result = {
        "original_features": original_features,
        "original_labels": original_labels,
        "distribution_map": distribution_map,
        "encoded_data": {"label": expvalues[flag_list[-1]]},
        "encoded_steps": [{"label": expvalues[f]} for f in flag_list[:-1]],
        "encoded_steps_sub": [
            [
                {"label": probs_measure_q0_1[f]},
                {"label": probs_measure_q0_0[f]},
            ]
            for f in flag_list[:-1]
        ],
    }
    return jsonify(result)


@app.route("/api/run_circuit", methods=["POST"])
def run_circuit():
    payload = request.get_json(silent=True) or {}
    try:
        req = CircuitRequest.model_validate(payload)
    except ValidationError as ve:
        return jsonify({"error": "Validation error", "details": ve.errors()}), 422

    circuit_id = req.circuit
    encoder_name = req.encoder_name
    cache_file_name = f"./cache/encoder_{encoder_name}_circuit_{circuit_id}_lr_{req.lr:.3f}_epoch_{req.epoch_number}.pkl"

    if os.path.exists(cache_file_name):
        with open(cache_file_name, "rb") as f:
            return pickle.load(f)

    # Also check stream cache — reconstruct result from last epoch
    stream_cache = _stream_cache_path(
        encoder_name or default_encoders[circuit_id],
        circuit_id, req.lr, req.epoch_number,
    )
    if os.path.exists(stream_cache):
        with open(stream_cache, "rb") as f:
            cached_updates = pickle.load(f)
        if cached_updates:
            last = cached_updates[-1]
            result = {
                "performance": {
                    "epoch_number": last["epoch_number"],
                    "loss": [u["loss"] for u in cached_updates],
                    "accuracy": [u["accuracy"] for u in cached_updates],
                },
                "trained_data": last["trained_data"],
                "feature_map_formula": encoders.get(
                    encoder_name or default_encoders[circuit_id], list(encoders.values())[0]
                ).get_feature_mapping().get_formula(),
            }
            return result

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
    result = run_circuit_train(**params)
    with open(cache_file_name, "wb") as f:
        pickle.dump(result, f)

    return result


# --- Streaming training with session control ---


def _stream_cache_path(encoder_name, circuit_id, lr, epoch_number):
    return f"./cache/stream_encoder_{encoder_name}_circuit_{circuit_id}_lr_{lr:.3f}_epoch_{epoch_number}.pkl"


@app.route("/api/train/start", methods=["POST"])
def train_start():
    payload = request.get_json(silent=True) or {}
    try:
        req = CircuitRequest.model_validate(payload)
    except ValidationError as ve:
        return jsonify({"error": "Validation error", "details": ve.errors()}), 422

    circuit_id = req.circuit
    encoder_name = req.encoder_name

    if encoder_name is None:
        encoder = encoders[default_encoders[circuit_id]]
        encoder_name = default_encoders[circuit_id]
    else:
        encoder = encoders.get(encoder_name, None)
        if encoder is None:
            return jsonify({"error": f"Unknown encoder name: {encoder_name}"}), 400

    cache_file = _stream_cache_path(encoder_name, circuit_id, req.lr, req.epoch_number)

    session_id = uuid.uuid4().hex
    SESSIONS[session_id] = {
        "created_at": _now(),
        "last_touch": _now(),
        "control": {"paused": False, "stopped": False},
        "cache_file": cache_file,
        "params": {
            "encoder": encoder,
            "dataset_source": get_dataset_source(circuit_id),
            "epoch_number": req.epoch_number,
            "lr": req.lr,
        },
    }
    return jsonify({"session_id": session_id})


@app.route("/api/train/stream", methods=["GET"])
def train_stream():
    session_id = request.args.get("session_id")
    if not session_id or session_id not in SESSIONS:
        return jsonify({"error": "Invalid or missing session_id"}), 400

    sess = SESSIONS[session_id]
    sess["last_touch"] = _now()
    control = sess["control"]
    params = sess["params"]

    cache_file = sess.get("cache_file")

    def sse_gen():
        # Set seed for deterministic behavior
        np.random.seed(SEED)
        # Initial event for confirmation
        init_event = {"type": "session", "session_id": session_id, "status": "started"}
        yield f"data: {json.dumps(init_event)}\n\n"

        # Check for cached results
        if cache_file and os.path.exists(cache_file):
            with open(cache_file, "rb") as f:
                cached_updates = pickle.load(f)
            for update in cached_updates:
                if control.get("stopped"):
                    break
                while control.get("paused") and not control.get("stopped"):
                    time.sleep(0.1)
                sess["last_touch"] = _now()
                payload = {"type": "epoch", **update}
                yield f"data: {json.dumps(payload)}\n\n"
                time.sleep(DELAY_BETWEEN_EPOCHS)
        else:
            all_updates = []
            for update in run_circuit_stream(**params, control=control):
                sess["last_touch"] = _now()
                all_updates.append(update)
                payload = {"type": "epoch", **update}
                yield f"data: {json.dumps(payload)}\n\n"
                if control.get("stopped"):
                    break
            # Save cache if training completed without being stopped
            if cache_file and not control.get("stopped"):
                try:
                    with open(cache_file, "wb") as f:
                        pickle.dump(all_updates, f)
                except OSError:
                    pass

        done_event = {"type": "done"}
        yield f"data: {json.dumps(done_event)}\n\n"

    headers = {
        "Cache-Control": "no-cache",
        "X-Accel-Buffering": "no",
        "Content-Type": "text/event-stream",
        "Connection": "keep-alive",
    }
    return Response(sse_gen(), headers=headers)


@app.route("/api/train/pause", methods=["POST"])
def train_pause():
    payload = request.get_json(silent=True) or {}
    session_id = payload.get("session_id")
    if not session_id or session_id not in SESSIONS:
        return jsonify({"error": "Invalid or missing session_id"}), 400
    SESSIONS[session_id]["control"]["paused"] = True
    SESSIONS[session_id]["last_touch"] = _now()
    return jsonify({"ok": True})


@app.route("/api/train/resume", methods=["POST"])
def train_resume():
    payload = request.get_json(silent=True) or {}
    session_id = payload.get("session_id")
    if not session_id or session_id not in SESSIONS:
        return jsonify({"error": "Invalid or missing session_id"}), 400
    SESSIONS[session_id]["control"]["paused"] = False
    SESSIONS[session_id]["last_touch"] = _now()
    return jsonify({"ok": True})


@app.route("/api/train/stop", methods=["POST"])
def train_stop():
    payload = request.get_json(silent=True) or {}
    session_id = payload.get("session_id")
    if not session_id or session_id not in SESSIONS:
        return jsonify({"error": "Invalid or missing session_id"}), 400
    SESSIONS[session_id]["control"]["stopped"] = True
    SESSIONS[session_id]["last_touch"] = _now()
    return jsonify({"ok": True})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3030)
