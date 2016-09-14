import boto3
import botocore
import os
import yaml
import mimetypes
import logging
import sys


BOTO_ERRORS = {
    'SignatureDoesNotMatch': 'The AWS key credential appears to be incorrect. Check config.yml or your AWS_SECRET_ACCESS_KEY_ID environment variable.',
    'InvalidAccessKeyId': 'The AWS ID credential appears to be incorrect. Check config.yml or your AWS_ACCESS_KEY_ID environment variable.',
}


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
        self.client = self.create_client()

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
        print('Deploying to S3...')
        for root, dirs, files in os.walk('build'):
            for file in files:
                local_path = os.path.join(root, file)
                remote_path = local_path.replace('build/', self.bucket_path)
                self.__upload_file(local_path, remote_path)
        print('Deploy complete!')


def provider(target):
    """Return instance of desired provider.
    See discussion of string to class here -> http://stackoverflow.com/questions/1176136/convert-string-to-python-class-object
    Eval is 'bad' but in this context is fine:
        - don't need to worry about 'evil' users
        - input is being limited via click CLI library
    """
    return eval(target)()
