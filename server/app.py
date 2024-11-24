from flask import Flask, render_template
from flask_cors import CORS, cross_origin

from routes.run_circuit_0 import run_circuit_0
# from routes.run_circuit_1 import run_dataset_1


app = Flask(__name__)
CORS(app)


app.config['ENV'] = 'development' # 'production
app.config['DEBUG'] = True






@app.route('/')
# @cross_origin(origin='*')
def index():
    try:
        return 'success'

    except Exception as e:
        print(e)
        return 'error'
    








@app.route('/api/run_circuit_0')
def run_circuit0():
    try:

        return run_circuit_0()

    except Exception as e:
        print(e)
        return 'error'






@app.route('/api/run_dataset_1')
def run_dataset1():
    try:

        return run_dataset_1()

    except Exception as e:
        print(e)
        return 'error'











if __name__ == '__main__':
    app.run(port=3030)