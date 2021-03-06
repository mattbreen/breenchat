from contextlib import contextmanager as _contextmanager
from fabric.api import cd, env, run, prefix, task


env.user = 'matt'
env.hosts = ['mattbreen.net']
project_dir = '/home/matt/www/mattbreen.net/breenchat'
env.activate = 'source {}/../bin/activate'.format(project_dir)


@_contextmanager
def virtualenv():
    """
    Wrap calls in this to activate the virtualenv. E.g.:

        @task
        def run_pip():
            with virtualenv():
                run('pip install -r requirements.txt')
    """
    with cd(project_dir):
        with prefix(env.activate):
            yield


@task
def deploy():
    with cd(project_dir):
        run('git pull origin master')
        with virtualenv():
            run('pip install -r requirements.txt')
        run('sudo supervisorctl restart mattchat-server')
        run('sudo supervisorctl restart mattchat-client')

