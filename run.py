import sys

from flask import Flask, render_template
from flask_frozen import Freezer
from livereload import Server
from providers import provider


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


@app.route('/project/')
def project():
    return render_template('project.html')


# Replace this logic with click library
if __name__ == '__main__':
    if len(sys.argv) > 1 and sys.argv[1] == 'build':
        print('Building static site')
        freezer.freeze()
        print('Static site built to ./build directory')
    elif len(sys.argv) > 1 and sys.argv[1] == 'deploy':
        deploy_target = provider(sys.argv[2])  # This language could be cleaned up. Provider? Deploy target? What's does each mean?
        deploy_target.deploy()
    else:
        server.watch('static')
        server.watch('templates')
        server.serve(open_url_delay=True, host='127.0.0.1', port=5000)
