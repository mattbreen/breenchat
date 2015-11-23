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
        this.socket = new WebSocket('ws://'+this.endpoint+'/');
        this.socket.onopen = function () {
            me.log("This chat is fucking anonymous");
            me.send({'type': 'login', 'handle': handle, 'avatar': avatar});
        };
        this.socket.onmessage = function(event) {
            message = $.parseJSON(event.data);
            switch(message.type) {
                case 'message':
                    me.log(message.message, message.handle, message.avatar, message.id);
                    break;
                case 'user_joined':
                    me.log(message.handle + " has joined the chat");
                    me.add_user(message.id, message.handle, message.avatar);
                    break;
                case 'rename':
                    me.log(message.handle + " changed their name.");
                    break;
                case 'user_left':
                    me.log(message.handle + " has left the chat");
                    me.remove_user(message.id);
                    break;
                case 'clear':
                    me.log(message.handle + " has cleared their chat. Suspicious.");
                    break;
                case 'userlist':
                    $.each(message.users, function(idx, user) {
                        me.add_user(user.id, user.handle, user.avatar);
                    });
                    break;
            }
        };
        this.socket.onclose = function () {
            me.log("Chat connection closed");
        };
    },

    add_user: function(id, handle, avatar) {
        console.log(avatar)
        var color_id = id % this.color_count,
            $el = $('<li id="user-'+id+'" class="list-group-item user-color-'+color_id+'">' + '<img src="'+ avatar +'" width=40 height=40 ">  ' + handle +'</li>').hide();
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
            if(msg.substring(0,4)=="http" || msg.substring(0,3)=="www"){
                msg = "<a href=\"" + msg + "\" target=\"_blank\">" + msg + "</a>";
                console.log(msg);
            }
            //var $user = $('<span class="user">').html(user + ': ');
            var $user = $('<span class="user">').html('<img src="'+ avatar +'" width=40 height=40 ">  ');
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
            if(!checkCookie()){
                console.log("checkforst");
                $('#handle').val(getCookie("username"));
                $('#loginPassword').val(getCookie("password"));
                $('#avatar').val(getCookie("avatar"));
                $('#saveCheck').prop("true");
            }
			$('#handle').focus();
			$('#handle-form').submit(function() {
                if($('#loginPassword').val() == "test"){
                    $('#handle-dlg').modal('hide');
                    if(checkCookie()){
                        console.log("check");
                        setCookie("username", $('#handle').val(), 30);
                        setCookie("password", $('#loginPassword').val(), 30);
                        setCookie("avatar", $('#avatar').val(), 30);
                    }
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
            //need better error checking on avatar eventually
            if(avatar==""){
                avatar = "/static/img/noavatar.png";
            }
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

    $('#temp').click(function() {
        window.chat.message('<p><font size="30">I\'m a faggot.</font>');
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
        window.chat.send({'type': 'rename'});
        $('#change-name-dlg').modal('hide');
        $('#chat').focus();
        window.chat.message('<b><font size="16">I\'m a faggot.</font></b>');
        return false;
    });

});

function setCookie(cname, cvalue, exp){
    console.log("sup");
    var d = new Date();
    d.setTime(d.getTime() + (exp*24*60*60*1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}
function checkCookie(){
    var user = getCookie("username");
    if(user == ""){
        return true;//No Cookie
    }
    return false;
}
