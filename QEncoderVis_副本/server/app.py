from flask import Flask, render_template
from flask_cors import CORS, cross_origin

from routes.get_original_data import func_get_original_data
from routes.run_Jiang_dataset import run_Jiang_dataset


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
    








@app.route('/api/run_Jiang_dataset')
def run_JiangDataset():
    try:

        return run_Jiang_dataset()

    except Exception as e:
        print(e)
        return 'error'











if __name__ == '__main__':
    app.run(port=3030)