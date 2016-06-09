=========
BreenChat
=========

http://chat.danbreen.net

BreenChat is a simple, web-based chat server and client running on WebSockets_
and Twisted_. It was created as a proof of concept just playing around with
WebSockets and it turned out to be quite fun to work with.

It's also using Bottle_, a cool little Python micro framework for web. Site
design is using `Twitter Bootstrap`_ since I have no creativity and Bootstrap
is awesome.

Installation
============

It's recommended to use a virtual environment to separate dependencies:

::

    git clone https://github.com/dbreen/breenchat.git
    cd breenchat
    virtualenv --no-site-packages .

Source the environment: ::

    source bin/activate

To install the dependencies: ::

    pip install -r requirements.txt

Configuration
=============

To configure: ::

    cp client/config_local.py.dist client/config_local.py
    ...edit config_local.py to change server/port if so desired...

The server and port should point to the Twisted reactor running for the server, and that's what the client WebSocket will connect on. E.g.: ::

    CHAT_SERVER = 'chat.danbreen.net'
    CHAT_PORT = 8080

Running it locally
==================

Running the server: ::

    python server/server.py

Running the client: ::

    cd client
    python chat.py

To run the client in production, you can use `../bin/bottle.py -b localhost:8000 chat`. Bottle
is WSGI-ready, so you can hook it up to Apache or another WSGI interface.

.. _WebSockets: http://en.wikipedia.org/wiki/WebSocket
.. _Twisted: http://twistedmatrix.com/trac/
.. _Bottle: http://bottlepy.org/docs/dev/
.. _Twitter Bootstrap: http://twitter.github.com/bootstrap/
