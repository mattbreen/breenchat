import os

from bottle import route, run, static_file, template

MEDIA = os.path.join(os.path.dirname(__file__), 'static')

@route('/static/<filename:path>')
def serve_static(filename):
    return static_file(filename, MEDIA)

@route('/')
def index():
    return template('index')

if __name__ == "__main__":
    run(host='localhost', port=8000, reloader=True)
