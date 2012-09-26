var socket;

function startChat(handle) {
	socket = new WebSocket('ws://sandbox.danbreen.net:8080/');
	socket.onopen = function () {
	    log("Chat connection opened");
		login(handle);
	};
	socket.onmessage = function(event) {
		message = $.parseJSON(event.data);
		switch(message.type) {
			case 'message':
				log(message.message, message.handle);
				break;
			case 'system':
				log(message.message);
				break;
			case 'usercount':
				$('#user-count').html(message.count);
				break;
		}
	};
	socket.onclose = function () {
	    log("Chat connection closed");
	};
}

function sendChat(message) {
	socket.send(JSON.stringify({
		type: 'message',
		message: message
	}));
}

function login(handle) {
	var json = JSON.stringify({
		type: 'login',
		handle: handle
	});
	socket.send(json);
}

function timestamp() {
	var date = new Date(),
		hrs = date.getHours(),
		mins = date.getMinutes(),
		secs = date.getSeconds();
	return (hrs < 10 ? "0" : "") + hrs + ":" + (mins < 10 ? "0" : "") + mins + ":" + (secs < 10 ? "0" : "") + secs;
}

function log(msg, user) {
	var system = user == undefined;
    $('#log').append('<div class="message'+(system ? ' message-system' : '')+'"><span class="time">'+timestamp()+'</span>: '+ (system ? '' : '<span class="user">'+user+':</span> ') +msg+'</div>');
    $('#log').scrollTop($('#log')[0].scrollHeight);
}

$(function() {
	$('#handle-dlg').modal('show')
		.on('shown', function() {
			$('#handle').focus();
			$('#handle-form').submit(function() {
				$('#handle-dlg').modal('hide');
				return false;
			});
		})
		.on('hide', function() {
			var handle = $('#handle').val();
			startChat(handle);
			$('#chat-panel').fadeIn();
			$('#chat').focus();
			$('#my-handle').html(handle);
		});

	$('#chatform').submit(function() {
	    sendChat($('#chat').val());
	    $('#chat').val('');
	    return false;
	});

});
