var ChatServer = function(endpoint) {
    this.endpoint = endpoint;
    this.socket = undefined;

    this.color_count = 5;
};

ChatServer.prototype = {
    send: function(params) {
        this.socket.send(JSON.stringify(params));
    },

    login: function(handle, avatar) {
        var me = this;
        //this.handle = handle;
        this.socket = new WebSocket('ws://'+this.endpoint+'/');
        this.socket.onopen = function () {
            me.log("This chat is fucking anonymous");
            me.send({'type': 'login', 'handle': handle});
        };
        this.socket.onmessage = function(event) {
            message = $.parseJSON(event.data);
            switch(message.type) {
                case 'message':
                    me.log(message.message, message.handle, message.avatar, message.id);
                    break;
                case 'user_joined':
                    me.log(message.handle + " has joined the chat");
                    me.add_user(message.id, message.handle);
                    break;
                case 'user_rename':
                    me.log(message.handle + " now goes by " + message.handle);
                    break;
                case 'user_left':
                    me.log(message.handle + " has left the chat");
                    me.remove_user(message.id);
                    break;
                case 'clear':
                    me.log(message.handle + " has cleared their chat... Suspicious.");
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
        var color_id = id % this.color_count,
            $el = $('<li id="user-'+id+'" class="list-group-item user-color-'+color_id+'">'+handle+'</li>').hide();
        $('#userlist').append($el);
        $el.fadeIn(500, this.update_count);
    },

    rename_user: function(handle) {
        //TODO
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
            ampm = hrs >= 12 ? 'pm' : 'am';
        hrs = hrs % 12;
        hrs = hrs ? hrs : 12;
        return (hrs < 10 ? "0" : "") + hrs + ":" + (mins < 10 ? "0" : "") + mins + ampm;
    },

    log: function(msg, user, avatar, id) {
        var system = user == undefined,
            color_id = id % this.color_count,
            $ts = $('<span class="time">').html(this.timestamp() + ': '),
            $message = $('<div class="message">').append($ts),
            $content = $('<span>');
        if(system) {
            $message.addClass('message-system');
            $content.html(msg);
        } else {
            //eventually have text checking function to verify valid content
            if(msg==""){
                return false;
            }
            //create hyperlinks
            console.log(msg);
            if(msg.substring(0,4)=="http" || msg.substring(0,3)=="www"){
                msg = "<a href=\"" + msg + "\" target=\"_blank\">" + msg + "</a>";
                console.log(msg);
            }
            var $user = $('<span class="user">').html(user + ': ');
            $content.addClass('user-color-'+color_id).append($user).append(msg);
        }
        $message.append($content);
        $('#log').append($message);
        $('#log').scrollTop($('#log')[0].scrollHeight);

        //Browser Tab Notifications
        $.titleAlert(system ? "A New Guy!" : (user + " said something"), {
            requireBlur:true,
            stopOnFocus:true,
            duration:0,
            interval:500
        });
    }
};

$(function() {
    $('#password-error').hide();

	$('#handle-dlg').modal('show')
		.on('shown.bs.modal', function() {
			$('#handle').focus();
			$('#handle-form').submit(function() {
                if($('#loginPassword').val() == "test"){
                    $('#handle-dlg').modal('hide');
                }else{
                    $('#password-error').show();
                    $('#loginPassword').focus();
                }
				return false;
			});
		})
		.on('hide.bs.modal', function() {
			var handle = $('#handle').val();
            var avatar = $('#avatar').val();
			window.chat.login(handle, avatar);
			$('#chat-panel').fadeIn();
			$('#chat').focus();
			$('#my-handle').html(handle);
		});

	$('#chatform').submit(function() {
        window.chat.message($('#chat').val());
	    $('#chat').val('');
	    return false;
	});

    $('#cats').click(function() {
        var date = new Date();
        window.chat.message('<img src="http://thecatapi.com/api/images/get?format=src&type=gif&c=' + date.getSeconds() +'" height="200" width="200">');
        return false;
    });

    $('#goat').click(function() {
        window.chat.message('<img src="http://ak-hdl.buzzfed.com/static/enhanced/webdr03/2013/9/5/10/anigif_enhanced-buzz-17427-1378391009-7.gif" height="200" width="200">');
        return false;
    });

    $('#clear').click(function() {
        $('#log .message').remove();
        window.chat.send({'type': 'clear'});
        return false;
    });

    $('#change-name').click(function() {
        $('#change-name-dlg').modal('show');
        return false;
    });
    $('#rename-form').submit(function() {
        var newname = $('#new-name').val();
        window.chat.rename_user(newname);
        $('#change-name-dlg').modal('hide');
        $('#chat').focus();
        return false;
    });

});
