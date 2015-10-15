<!doctype html>
<html>
<head>
<title>BreenChat</title>
<link href="/static/css/bootstrap.css" rel="stylesheet">
<link href="/static/css/styles.css" rel="stylesheet">
<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.8.1/jquery.min.js"></script>
<script type="text/javascript" src="/static/js/bootstrap.min.js"></script>
<script type="text/javascript" src="/static/js/chat.js"></script>
<script type="text/javascript" src="/static/js/jquery.titlealert.js"></script>
</head>
<body>

<div class="container">
	<div class="navbar navbar-inverse">
	  <div class="navbar-inner">
	      <p class="navbar-text span4">BreenChat</p>
	      <p class="navbar-text aright">
              In case you forget, you are: <span id="my-handle" class="label label-info">?</span>
	      </p>
	  </div>
	</div>

	<div id="chat-panel">

        <div class="row">
    		<div class="span8">
                <div id="log"></div>
                <form id="chatform">
                    <div class="input-append">
                        <input id="chat" type="text" class="span4" />
                        <button class="btn" id="send">Send It</button>
                    </div>
                </form>
    		</div>
            <div id="user-panel" class="span3">
                <h4><i class="icon-user"></i> Users (<span id="usercount"></span>)</h4>
                <ul id="userlist" class="styled"></ul>
            </div>
            <br><br>
            <!-- <div id="power-panel" class="span3">
                <h4>Functions</h4>
                <button class="btn btn-info" id="cats">Cat in the Wall</button>
            </div> -->
            
        </div>
	</div>

	<div class="modal hide fade" id="handle-dlg" data-backdrop="static" data-keyboard="false">
		<div class="modal-header">
			<h3>Log In</h3>
		</div>
		<div class="modal-body">
				<div class="form-group">
				<div class="alert alert-danger hide" role="alert" id="password-error">Incorrect password.</div>
				<label>Name:</label>
				<input type="text" class="span4" id="handle" placeholder="Your Name"><p><p>
				<label>Password:</label>
				<input type="password" class="span4" id="loginPassword" placeholder="Password">
				</div>
		</div>
		<div class="modal-footer">
		<a href="#" class="btn btn-primary" id="submit">Send It</a>
		</div>
	</div>

</div>

<script>
window.chat = new ChatServer('{{endpoint}}');
</script>
</body>
</html>

