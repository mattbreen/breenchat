<!doctype html>
<html>
<head>
<title>BreenChat</title>
<link href="/static/css/bootstrap.css" rel="stylesheet">
<link href="/static/css/styles.css" rel="stylesheet">
<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
<script type="text/javascript" src="/static/js/bootstrap.min.js"></script>
<script type="text/javascript" src="/static/js/chat.js"></script>
<script type="text/javascript" src="/static/js/jquery.titlealert.js"></script>
</head>
<body>

<div class="container">

	<div class="navbar navbar-default">
	  <div class="container-fluid">
	  	<div class="navbar-header">
	  		<a class="navbar-brand">BREENCHAT</a>
	  	</div>
	  	<ul class="nav navbar-nav navbar-right">
	  		<li class="dropdown">
			          <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><span id="my-handle"></span><span class="caret"></span></a>
			          <ul class="dropdown-menu">
			            <li id="change-name"><a href="#">Change Name (soon)</a></li>
			            <li><a href="#">Change Color (soon)</a></li>
			            <li role="separator" class="divider"></li>
			            <li><a href="javascript:window.open('','_self').close();">Leave Chat</a></li>
			          </ul>
			        </li>
	  	</ul>
	  </div>
	</div>

	<div id="chat-panel">

        <div class="row">
    		<div class="col-sm-9 col-lg-9">
                <div id="log"></div>
                <form id="chatform">
                    <div class="input-group">
                        <input id="chat" type="text" class="form-control input-lg" autocomplete="off" />
                        <span class="input-group-btn">
                        	<button class="btn btn-lg btn-primary" id="send">Send It</button>
                    	</span>
                    </div>
                </form>
    		</div>

    		<div class="col-sm-3 col-lg-3">
            	<div id="user-panel" class="panel panel-primary">
            		<div class="panel-heading">
                		Users <span id="usercount" class="badge"></span>
                	</div>
                	<ul id="userlist" class="list-group"></ul>
            	</div>
        	</div>
        	<div class="col-sm-3 col-lg-3">
            	<div id="power-panel" class="panel panel-primary">
            		<div class="panel-heading">
                		Functions <span id="usercount" class="badge"></span>
                	</div>
                	<ul class="list-group">
                		<li class="list-group-item"><button width=30% class="btn btn-default" id="clear">Clear</button></li>
                		<li class="list-group-item"><button class="btn btn-default" id="cats">Cats</button></li>
                	</ul>
            	</div>
        	</div>

		</div>
	</div>

	<div class="modal fade bs-example-modal-sm" id="handle-dlg" role="dialog" data-backdrop="static" data-keyboard="false">
		<div class="modal-dialog" role="dialog">
		<div class="modal-content">
				<div class="modal-header">Log In</div>
				<div class="modal-body">
					<form id="handle-form">
						<center>
							<div class="alert alert-danger hide" role="alert" id="password-error"><strong>Incorrect password.</strong></div>
						<div class="input-group input-group-lg">
							<input type="text" class="form-control" placeholder="Name" id="handle" autocomplete="off">
						</div>
						<div class="input-group input-group-lg">
							<input type="password" class="form-control" placeholder="Password" id="loginPassword" autocomplete="off">
						</div>
						<div class="input-group">
				<span class="input-group-btn">
					<button class="btn btn-lg">Send It</button>
				</span>
						</div>
					</center>
					</form>
				</div>
			</div>
		</div>
	</div>

	<div class="modal fade bs-example-modal-md" id="change-name-dlg" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel">
  		<div class="modal-dialog modal-md">
    	<div class="modal-content">
      		<div class="input-group input-group-lg">
				<input type="text" class="form-control" placeholder="New Name" id="new-name" autocomplete="off">
			</div>
    	</div>
  	</div>
	</div>

</div>

<script>
window.chat = new ChatServer('{{endpoint}}');
</script>
</body>
</html>

