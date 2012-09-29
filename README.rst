=========
BreenChat
=========

http://sandbox.danbreen.net

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

Running it locally
==================

Running the server: ::

    python server/server.py

Running the client: ::

    cd client
    ../bin/bottle.py chat

.. _WebSockets: http://en.wikipedia.org/wiki/WebSocket
.. _Twisted: http://twistedmatrix.com/trac/
.. _Bottle: http://bottlepy.org/docs/dev/
.. _Twitter Bootstrap: http://twitter.github.com/bootstrap/
