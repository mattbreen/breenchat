import json
import sys
import requests
from twisted.internet import protocol, reactor
from txws import WebSocketFactory


MESSAGE_TYPES = ('login', 'message', 'clear', 'rename', 'trivia')
PORT = 8081

CHAT_MODE = ('CHAT', 'TRIVIA')


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

    #Called by 'send' in chat.js
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
        self.avatar = params['avatar']
        self.reply('userlist', {
            'users': [
                {'id': u.id, 'handle': u.handle, 'avatar': u.avatar}
                for u in self.factory.chatters
                if u != self
            ]
        })
        self.broadcast('user_joined', {
            'handle': self.handle,
            'avatar': self.avatar,
            'id': self.id
        })

    def handle_clear(self, params):
        self.broadcast('clear', {'handle':self.handle,})

    def handle_trivia(self, params):
        response = requests.get('https://opentdb.com/api.php?amount=1', verify=False)
        if(response.status_code == 200):
            data = response.json()
            results = data['results']
            question = results[0]
            q_text = question['question']
            q_answ = question['correct_answer'].encode('utf-8')
            q_incor = question['incorrect_answers']
            temp = [s.encode('utf-8') for s in q_incor]
            temp = ", ".join(temp)
            temp = temp + ", " + q_answ
            #temp = q_answ.encode('utf-8') + q_incor.encode('utf-8')
            self.broadcast('trivia', {'handle':self.handle, 'trivia':q_text})
            self.broadcast('trivia', {'handle':self.handle, 'trivia':temp})

    def handle_rename(self, params):
        self.broadcast('rename', {'handle':self.handle,})

        #self.handle = params['handle']

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

    #SENDS MESSAGE TO CHAT CLIENT -- called by any self.broadcast call
    def broadcast(self, message):
        for chatter in self.chatters:
            chatter._write(message)

    def remove(self, chatter):
        self.chatters.remove(chatter)


print "Starting reactor..."
reactor.listenTCP(PORT, WebSocketFactory(ChatterFactory()))
print "Listening on port %d..." % PORT
reactor.run()

