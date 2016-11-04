import click
import threading
import time

from flask import Flask, render_template
from flask_frozen import Freezer
from livereload import Server
from providers import provider
from export import main as build_geojson


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


def run_task(start_msg, task, task_arg=None):
    click.echo(start_msg, nl=False)
    if task_arg:
        t = threading.Thread(target=task, args=[task_arg])
    else:
        t = threading.Thread(target=task)
    t.start()
    while t.is_alive():
        click.echo('.', nl=False)
        time.sleep(1)
    click.echo(' done.')


@click.group()
def cli():
    pass


@cli.command()
def build():
    """Build the website into the ./build directory."""
    run_task('Building website', freezer.freeze)
    run_task('Fetching latest google sheets data', build_geojson)
    click.echo('Build complete.')


@cli.command()
@click.argument('target', type=click.Choice(['S3']))
def deploy(target):
    """Deploy the website to a hosting provider."""
    run_task('Building website', freezer.freeze)
    run_task('Fetching latest google sheets data', build_geojson)
    run_task('Starting deploy', provider, target)


@cli.command()
def dev():
    """Run a localhost server for development."""
    run_task('Fetching latest google sheets data', build_geojson)
    server.watch('static')
    server.watch('templates')
    server.serve(open_url_delay=True, host='127.0.0.1', port=5000)


# Replace this logic with click library
if __name__ == '__main__':
    cli();
