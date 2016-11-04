import boto3
import botocore
import json
import os
import yaml
import mimetypes
import logging
import sys

#from PIL import Image

BOTO_ERRORS = {
    'SignatureDoesNotMatch': 'The AWS key credential appears to be incorrect. Check config.yml or your AWS_SECRET_ACCESS_KEY_ID environment variable.',
    'InvalidAccessKeyId': 'The AWS ID credential appears to be incorrect. Check config.yml or your AWS_ACCESS_KEY_ID environment variable.',
}
THUMBNAIL_SIZE = (128, 128)

with open("config.yml", 'r') as config_file:
    config = yaml.load(config_file)


class S3:
    def __init__(self):
        """Special handling on bucket path as yaml empty string returns a
        tuple of ('',), which is janky to parse :S
        """
        self.id = os.getenv('AWS_ACCESS_KEY_ID', config['aws']['id'])
        self.key = os.getenv('AWS_SECRET_ACCESS_KEY', config['aws']['key'])
        self.bucket = os.getenv('AWS_BUCKET', config['aws']['bucket'])
        if os.getenv('AWS_BUCKET_PATH', config['aws']['bucket_path']):
            self.bucket_path = os.getenv(
                'AWS_BUCKET_PATH', config['aws']['bucket_path']
            )
        else:
            self.bucket_path = ''
        self.img_dir = os.getenv('IMG_DIR', config['img_dir'])
        self.client = self.create_client()
        self.deploy()
        self.upload_images()

    def create_client(self):
        return boto3.client(
            's3',
            aws_access_key_id=self.id,
            aws_secret_access_key=self.key
        )

    def __upload_file(self, local_path, remote_path):
        try:
            with open(local_path, 'rb') as f:
                self.client.put_object(
                    Body=f,
                    Bucket=self.bucket,
                    Key=remote_path,
                    ContentType=mimetypes.guess_type(local_path)[0] or 'application/octet-stream',
                    StorageClass='REDUCED_REDUNDANCY'
                )
                logging.info('Uploaded {local} to {remote}'.format(
                    local=local_path,
                    remote=remote_path
                ))
        except botocore.exceptions.ClientError as e:  # Find more specific boto and file exceptions
            try:
                logging.error(
                    'Error while uploading {local} to {remote}.\n{error}'.format(
                        local=local_path,
                        remote=remote_path,
                        error=BOTO_ERRORS[e.response['Error']['Code']]
                    )
                )
            except KeyError:
                logging.error('Uh oh. We\'re haven\'t covered this error.\n{error}'.format(error=e))
            sys.exit()

    def deploy(self):
        for root, dirs, files in os.walk('build'):
            for file in files:
                local_path = os.path.join(root, file)
                remote_path = local_path.replace('build/', self.bucket_path)
                self.__upload_file(local_path, remote_path)

    def upload_images(self):
        req_images = required_images()
        for root, dirs, files in os.walk(self.img_dir):
            for file in files:
                if file in req_images:
                    try:
                        self.client.head_object(
                            Bucket=self.bucket,
                            Key='static/img/' + file
                        )
                    except botocore.exceptions.ClientError:
                        local_path = os.path.join(root, file)
                        remote_path = self.bucket_path + 'static/img/'
                        thumbnail_path, thumbnail_file = create_thumbnail(local_path, file)
                        self.__upload_file(local_path, remote_path + file)
                        self.__upload_file(thumbnail_path, remote_path + thumbnail_file)


def create_thumbnail(local_path, file):
    thumbnail = 'thumb_' + file
    thumbnail_path = local_path.replace(file, thumbnail)
    im = Image.open(local_path)
    im.thumbnail(THUMBNAIL_SIZE)
    im.save(thumbnail_path, 'JPEG')
    return thumbnail_path, thumbnail


def required_images():
    with open('static/data.geojson') as f:
        data = json.load(f)
    img_lists = [data['geojson'][x]['documents'] for x in data['geojson'] if data['geojson'][x]['documents']]
    return [item for sublist in img_lists for item in sublist]


def provider(target):
    """Return instance of desired provider.
    See discussion of string to class here -> http://stackoverflow.com/questions/1176136/convert-string-to-python-class-object
    Eval is 'bad' but in this context is fine:
        - don't need to worry about 'evil' users
        - input is being limited via click CLI library
    """
    return eval(target)()
