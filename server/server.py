import json
import sys
from twisted.internet import protocol, reactor
from txws import WebSocketFactory


MESSAGE_TYPES = ('login', 'message', 'clear')
PORT = 8081


class Chatter(protocol.Protocol):
    def __init__(self, factory, id):
        self.factory = factory
        self.id = id
        self.handle = 'unknown'
        self.avatar = 'unknown'

    def _build(self, type_, params=None):
        if params is None:
            params = {}
        params.update({
            'type': type_,
        })
        return json.dumps(params)

    def _print(self, message):
        print message.encode('ascii', 'ignore')
        sys.stdout.flush()

    def _write(self, message):
        self._print(u"[%s,%d] OUT: %s" % (self.handle, self.id, message))
        self.transport.write(message)

    def reply(self, type_, params):
        self._write(self._build(type_, params))

    def broadcast(self, type_, params):
        self.factory.broadcast(self._build(type_, params))

    def error(self, message):
        self._print(u"ERROR: %s" % message)
        self.reply('error', {'message': message})

    def dataReceived(self, data):
        self._print(u"[%s,%d]  IN: %s" % (self.handle, self.id, data))
        try:
            json_data = json.loads(data)
        except ValueError:
            self.error('Invalid message sent')
            return
        type_ = json_data.get('type')
        if not type_ or type_ not in MESSAGE_TYPES:
            self.error('Invalid message type')
        getattr(self, 'handle_%s' % type_)(json_data)

    def handle_message(self, params):
        self.broadcast('message', {
            'handle': self.handle,
            'avatar': self.avatar,
            'message': params['message'],
            'id': self.id,
        })

    def handle_login(self, params):
        self.handle = params['handle']
        self.reply('userlist', {
            'users': [
                {'id': u.id, 'handle': u.handle}
                for u in self.factory.chatters
                if u != self
            ]
        })
        self.broadcast('user_joined', {
            'handle': self.handle,
            'id': self.id
        })

    def handle_clear(self, params):
        self.broadcast('clear', {'handle':self.handle,})

    def handle_rename(self, params):
        self.handle = params['handle']

        self.broadcast('user_rename', {
            'handle': self.handle,
            'id': self.id
        })

    def connectionLost(self, reason):
        params = {
            'handle': self.handle,
            'id': self.id
        }
        self.factory.remove(self)
        self.broadcast('user_left', params)


class ChatterFactory(protocol.Factory):
    chatters = []
    next_id = 0

    def buildProtocol(self, addr):
        self.next_id += 1
        chatter = Chatter(self, self.next_id)
        self.chatters.append(chatter)
        return chatter

    def broadcast(self, message):
        for chatter in self.chatters:
            chatter._write(message)

    def remove(self, chatter):
        self.chatters.remove(chatter)


print "Starting reactor..."
reactor.listenTCP(PORT, WebSocketFactory(ChatterFactory()))
print "Listening on port %d..." % PORT
reactor.run()

