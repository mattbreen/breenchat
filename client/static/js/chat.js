var ChatServer = function(endpoint) {
    this.endpoint = endpoint;
    this.socket = undefined;
};

ChatServer.prototype = {
    send: function(params) {
        this.socket.send(JSON.stringify(params));
    },

    login: function(handle) {
        var me = this;
        this.handle = handle;
        this.socket = new WebSocket('ws://'+this.endpoint+'/');
        this.socket.onopen = function () {
            me.log("Chat connection opened");
            me.send({'type': 'login', 'handle': handle});
        };
        this.socket.onmessage = function(event) {
            message = $.parseJSON(event.data);
            switch(message.type) {
                case 'message':
                    me.log(message.message, message.handle);
                    break;
                case 'user_joined':
                    me.log(message.handle + " has joined the channel");
                    me.add_user(message.id, message.handle);
                    break;
                case 'user_left':
                    me.log(message.handle + " has left the channel");
                    me.remove_user(message.id);
                    break;
                case 'userlist':
                    $.each(message.users, function(idx, user) {
                        me.add_user(user.id, user.handle);
                    });
                    break;
            }
        };
        this.socket.onclose = function () {
            me.log("Chat connection closed");
        };
    },

    add_user: function(id, handle) {
        var $el = $('<li id="user-'+id+'">'+handle+'</li>').hide();
        $('#userlist').append($el);
        $el.fadeIn(500, this.update_count);
    },

    remove_user: function(id) {
        var $el = $('#userlist #user-'+id),
            me = this;
        $el.fadeOut(500, function() {
            $(this).remove();
            me.update_count();
        });
    },

    update_count: function() {
        $('#usercount').text($('#userlist li').length);
    },

    message: function(message) {
        this.send({'type': 'message', 'message': message});
    },

    timestamp: function() {
        var date = new Date(),
            hrs = date.getHours(),
            mins = date.getMinutes(),
            secs = date.getSeconds();
        return (hrs < 10 ? "0" : "") + hrs + ":" + (mins < 10 ? "0" : "") + mins + ":" + (secs < 10 ? "0" : "") + secs;
    },

    log: function(msg, user) {
        var system = user == undefined;
        $('#log').append('<div class="message'+(system ? ' message-system' : '')+'"><span class="time">'+this.timestamp()+'</span>: '+ (system ? '' : '<span class="user">'+user+':</span> ') +msg+'</div>');
        $('#log').scrollTop($('#log')[0].scrollHeight);
    }
};

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
			window.chat.login(handle);
			$('#chat-panel').fadeIn();
			$('#chat').focus();
			$('#my-handle').html(handle);
		});

	$('#chatform').submit(function() {
        window.chat.message($('#chat').val());
	    $('#chat').val('');
	    return false;
	});

});
