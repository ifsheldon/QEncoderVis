from flask import Flask, render_template
from flask_cors import CORS, cross_origin

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


# Jiang - bad
@app.route("/api/run_circuit_0")
def run_circuit0():
    try:
        return run_circuit_0()

    except Exception as e:
        print(e)
        return "error"


# wavy - bad
@app.route("/api/run_circuit_1")
def run_circuit1():
    try:
        return run_circuit_1()

    except Exception as e:
        print(e)
        return "error"


# circle - bad
@app.route("/api/run_circuit_2")
def run_circuit2():
    try:
        return run_circuit_2()

    except Exception as e:
        print(e)
        return "error"


# circle - bad
@app.route("/api/run_circuit_21")
def run_circuit21():
    try:
        return run_circuit_21()

    except Exception as e:
        print(e)
        return "error"


# semicircle - good
@app.route("/api/run_circuit_3")
def run_circuit3():
    try:
        return run_circuit_3()

    except Exception as e:
        print(e)
        return "error"


# diagnal_slit - good
@app.route("/api/run_circuit_4")
def run_circuit4():
    try:
        return run_circuit_4()

    except Exception as e:
        print(e)
        return "error"


# triangle - good
@app.route("/api/run_circuit_5")
def run_circuit5():
    try:
        return run_circuit_5()

    except Exception as e:
        print(e)
        return "error"


if __name__ == "__main__":
    app.run(port=3030)
