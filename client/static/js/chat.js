var ChatServer = function(endpoint) {
    this.endpoint = endpoint;
    this.socket = undefined;

    this.color_count = 8;
};

$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})

ChatServer.prototype = {
    send: function(params) {
        this.socket.send(JSON.stringify(params));
    },

    login: function(handle, avatar) {
        var me = this;
        this.socket = new WebSocket('ws://'+this.endpoint+'/');
        //ON LOGIN MESSAGE
        this.socket.onopen = function () {
            me.log("What up!","","","","");
            me.send({'type': 'login', 'handle': handle, 'avatar': avatar});
        };
        //HANDLE MESSAGE TYPE
        this.socket.onmessage = function(event) {
            message = $.parseJSON(event.data);
            switch(message.type) {
                case 'message':
                    me.log(message.message, message.handle, message.avatar, message.id);
                    break;
                case 'user_joined':
                    me.log(message.handle + " has joined the chat", message.handle, message.avatar, message.id, "Joined");
                    me.add_user(message.id, message.handle, message.avatar);
                    break;
                case 'rename':
                    me.log(message.handle + " changed their name.", message.handle, message.avatar, message.id, "Ignore");
                    break;
                case 'user_left':
                    me.log(message.handle + " has left the chat", message.handle, message.avatar, message.id, "Left");
                    me.remove_user(message.id);
                    break;
                case 'clear':
                    me.log(message.handle + " has cleared their chat.", message.handle, message.avatar, message.id, "Ignore");
                    break;
                case 'trivia':
                    me.log(message.trivia, message.handle, message.avatar, message.id, "Trivia");
                    me.trivia_timer(true);
                    break;
                case 'trivia_timer':
                    me.trivia_timer(false);
                    break;
                case 'trivia_error':
                    me.log("There was a problem trying to load trivia.", message.handle, message.avatar, message.id);
                    break;
                case 'userlist':
                    $.each(message.users, function(idx, user) {
                        me.add_user(user.id, user.handle, user.avatar);
                    });
                    break;
            }
        };
        //ON LOGOUT MESSAGE
        this.socket.onclose = function () {
            me.log("Chat connection closed.",message.handle,"","","Disconnected");
        };
    },

    add_user: function(id, handle, avatar) {
        var color_id = id % this.color_count,
            $el = $('<li id="user-'+id+'" class="list-group-item user-color-'+color_id+'">' + '<img src="'+ avatar +'" width=40 height=40 "> <a href="#">  ' + handle +'</a></li>').hide();
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
        return (hrs < 10 ? "0" : "") + hrs + ":" + (mins < 10 ? "0" : "") + mins + ampm + " ";
    },

    //When trivia starts, disable the button so more questions can't be asked, when trivia ends re-enable button
    trivia_timer: function(t) {
        if (t)
            $('#trivia').attr('disabled','disabled');
        else
            $('#trivia').removeAttr('disabled');
    },

    log: function(msg, user, avatar, id, msgType) {
        var system = msgType != undefined,
            color_id = id % this.color_count,
            $ts = $('<span class="time">').html(this.timestamp()),
            $message = $('<div class="message">').append($ts),
            $content = $('<span>');
        
        //TRIVIA QUESTIONS
        if (msgType == 'Trivia') {
            $message.addClass('message-trivia');
            $content.html(msg);
        //SYSTEM MESSAGES
        } else if (system) {
            $message.addClass('message-system');
            $content.html(msg);
        //USER MESSAGES
        } else {
            //eventually have text checking function to verify valid content
            if(msg==""){
                return false;
            }
            //create hyperlinks
            if(msg.substring(0,4)=="http" || msg.substring(0,3)=="www"){
                msg = "<a href=\"" + msg + "\" target=\"_blank\">" + msg + "</a>";
            }
            var $user = $('<span class="user">').html(" " + '<img src="'+ avatar +'" width=40 height=40 "> ' + user + ":  ");
            $content.addClass('user-color-'+color_id).append($user).append(msg);
        }
        $message.append($content);
        $('#log').append($message);
        $('#log').scrollTop($('#log')[0].scrollHeight);

        //Browser Tab Notifications
        var mess = msgType;
        switch(msgType){
            case 'Ignore':
                mess = "";
                break;
            case 'Disconnected':
                mess = (user + " lost connection");
                break;
            case 'Joined':
                mess = (user + " joined");
                break;
            case 'Left':
                mess = (user + " left");
                break;
            case 'Trivia':
                mess = (user + "\'s got trivia!");
                break;
            default:
                mess = (user + " said something");
        }
        if(mess != 'Ignore'){
            $.titleAlert(mess, {
                requireBlur:true,
                stopOnFocus:true,
                duration:0,
                interval:500
            });
        }
        
    }
};

$(function() {
    $('#password-error').hide();
    $('#otheruser-dlg').hide();
    $('#alert-banner').hide();

    $('#news-pop').hide();

	$('#handle-dlg').modal('show')
		.on('shown.bs.modal', function() {
            if(!checkCookie()){
                $('#handle').val(getCookie("username"));
                $('#loginPassword').val(getCookie("password"));
                $('#avatar').val(getCookie("avatar"));
            }
			$('#handle').focus();
			$('#handle-form').submit(function() {
                if($('#loginPassword').val() == "catinthewall"){
                    setCookie("username", $('#handle').val(), 30);
                    setCookie("password", $('#loginPassword').val(), 30);
                    setCookie("avatar", $('#avatar').val(), 30);
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

    $('#clear').click(function() {
        $('#log .message').remove();
        window.chat.send({'type': 'clear'});
        return false;
    });

    $('#jt').click(function() {
        window.chat.message('<img src="https://s.blogcdn.com/www.stylelist.com/media/2013/03/justin-timberlake-hair-2-1363298081.jpg" height="268" width="169">');
        return false;
    });

    $('#trivia').click(function() {
        window.chat.send({'type': 'trivia'});
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
        return false;
    });

});

function setCookie(cname, cvalue, exp){
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
