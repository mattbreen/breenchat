import os

from bottle import route, run, static_file, template

import config

MEDIA = os.path.join(os.path.dirname(__file__), 'static')

@route('/static/<filename:path>')
def serve_static(filename):
    return static_file(filename, MEDIA)

@route('/')
def index():
    endpoint = "%s:%s" % (config.CHAT_SERVER, config.CHAT_PORT)
    return template('index', endpoint=endpoint)

if __name__ == "__main__":
    run(host='localhost', port=8000, reloader=True)
