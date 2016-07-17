import sys

from flask import Flask, render_template
from flask_frozen import Freezer
from livereload import Server


DEBUG = True

app = Flask(__name__)
app.config.from_object(__name__)
freezer = Freezer(app)
server = Server(app.wsgi_app)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/map/')
def map():
    return render_template('map.html')

@app.route('/cluster-map/')
def time_map():
    return render_template('cluster-map.html')

@app.route('/pick-train/')
def pick_train():
    return render_template('pick-train.html')

@app.route('/project/')
def project():
    return render_template('project.html')

@app.route('/individual/')
def individual():
    return render_template('individual.html')

if __name__ == '__main__':
    if len(sys.argv) > 1 and sys.argv[1] == 'create':
        freezer.freeze()
    else:
        server.watch('static')
        server.watch('templates')
        server.serve(open_url_delay=True, host='0.0.0.0', port=5000)
