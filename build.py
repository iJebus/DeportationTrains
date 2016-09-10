import sys

from flask import Flask, render_template
from flask_frozen import Freezer
from livereload import Server
import boto3
import mimetypes
import os


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
    return render_template('map2.html')


@app.route('/project/')
def project():
    return render_template('project.html')


# Todo make this s3 stuff into a class
def upload_file(file, bucket, key, s3_client):
    with open(file, 'rb') as f:
        if mimetypes.guess_type(file)[0]:
            content_type = mimetypes.guess_type(file)[0]
        else:
            content_type = 'application/octet-stream'
        return s3_client.put_object(
            Body=f,
            Bucket=bucket,
            Key=key,
            ContentType=content_type
        )


# Todo make this s3 stuff into a class
def deploy_to_s3(s3_client):
    for root, dirs, files in os.walk('build'):
        for filename in files:
            local_path = os.path.join(root, filename)
            remote_path = local_path.replace('build/', '')
            upload = upload_file(
                local_path,
                'deportation-trains',
                remote_path,
                s3_client
            )
            if upload['ResponseMetadata']['HTTPStatusCode'] == 200:
                print('Uploaded {local} to {remote}'.format(
                    local=local_path,
                    remote=remote_path
                ))
            else:
                print('Error uploading {local} to {remote}'.format(
                    local=local_path,
                    remote=remote_path
                ))


def init_s3_client():
    return boto3.client(
        's3',
        aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID', 'default_value'),
        aws_secret_access_key=os.getenv(
            'AWS_SECRET_ACCESS_KEY', 'default_value'
        )
    )


if __name__ == '__main__':
    if len(sys.argv) > 1 and sys.argv[1] == 'create':
        freezer.freeze()
    if len(sys.argv) > 1 and sys.argv[1] == 'deploy':
        s3_client = init_s3_client()
        deploy_to_s3(s3_client)
    else:
        server.watch('static')
        server.watch('templates')
        server.serve(open_url_delay=True, host='127.0.0.1', port=5000)
