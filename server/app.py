from flask import Flask, request, jsonify
from flask_cors import CORS

from routes.run_circuit_0 import run_circuit_0
from routes.run_circuit_1 import run_circuit_1
from routes.run_circuit_2 import run_circuit_2
from routes.run_circuit_3 import run_circuit_3
from routes.run_circuit_4 import run_circuit_4
from routes.run_circuit_5 import run_circuit_5

from routes.run_circuit_21 import run_circuit_21


app = Flask(__name__)
CORS(app)


app.config["ENV"] = "development"  # 'production
app.config["DEBUG"] = True


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
        circuit_id = payload.get("circuit")

        circuit_map = {
            0: run_circuit_0,
            1: run_circuit_1,
            2: run_circuit_2,
            3: run_circuit_3,
            4: run_circuit_4,
            5: run_circuit_5,
            21: run_circuit_21,
        }

        if circuit_id not in circuit_map:
            return jsonify(
                {
                    "error": "Invalid circuit id",
                    "allowed": sorted(list(circuit_map.keys())),
                }
            ), 400

        # Call the selected circuit runner and return its result (already plain types)
        return circuit_map[circuit_id]()

    except Exception as e:
        print(e)
        return "error"


if __name__ == "__main__":
    app.run(port=3030)
