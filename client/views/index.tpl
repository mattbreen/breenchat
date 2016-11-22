<!doctype html>
<html>
<head>
<title>BreenChat</title>
<script src="/static/js/snowstorm.js"></script>
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
			            <li id="change-avatar"><a href="#">Change Avatar (soon)</a></li>
			            <li id="change-color"><a href="#">Change Color (soon)</a></li>
			            <li role="separator" class="divider"></li>
			            <li><a href="javascript:history.go(0)">Log Out</a></li><!-- Need to confirm and clear cookies (eventually) -->
			          </ul>
			        </li>
	  	</ul>
	  </div>
	</div>

	<!-- TOP BANNER FOR SITE MESSAGES -->
	<div class="alert alert-danger alert-dismissible" role="alert" id="alert-banner">
  		<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
  		<strong>Attension:</strong> It's Monday.
	</div>


	<div id="chat-panel">

        <div class="row">
    		<div class="col-sm-9 col-lg-9">
                <div id="log"></div>
                <form id="chatform">
                	<div class="alert alert-danger alert-dismissible fade in" role="alert" id="news-pop">
                		<center>
                		<h2>Someone has news!</h2>
                		<p>
                			<button type="button" class="btn btn-danger" id="news-hide">Alright</button>
                		</p>
                	</center>
                	</div>

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
                		<center>
                		<li class="list-group-item"><button class="btn btn-default" id="clear">Clear</button></li>
                		<li class="list-group-item"><button class="btn btn-default" id="cats">Cats</button></li>
                		<li class="list-group-item"><button class="btn btn-default" id="jt">JT</button></li>
                		<li class="list-group-item"><button class="btn btn-danger" id="news" data-toggle="tooltip" data-placement="right" title="Got News?">NEWS</button></li>
                		</center>
                	</ul> 
            	</div>
        	</div>

		</div>
	</div>

	<div class="modal fade" id="handle-dlg" role="dialog" data-backdrop="static" data-keyboard="false">
		<div class="modal-dialog" role="dialog">
		<div class="modal-content">
				<div class="modal-body">
					<form id="handle-form">
						<center>
							<div class="alert alert-danger" role="alert" id="password-error"><strong>Incorrect password.</strong></div>
						<div class="input-group input-group-lg">
							<input type="text" class="form-control" placeholder="Name" id="handle" autocomplete="off">
						</div>
						<br>
						<div class="input-group input-group-lg">
							<input type="password" class="form-control" placeholder="Password" id="loginPassword" autocomplete="off">
						</div>
						<br>
						<div class="input-group input-group-lg">
							<input type="text" class="form-control" placeholder="Avatar URL" id="avatar" autocomplete="off">
						</div>
						<br>
						<div class="input-group">
							<span class="input-group-btn">
								<button class="btn btn-primary btn-lg btn-block">Send It</button>
							</span>
						</div>
					</center>
					</form>
				</div>
			</div>
		</div>
	</div>

	<div class="modal fade" id="otheruser-dlg" role="dialog">
		<div class="modal-dialog" role="dialog">
		<div class="modal-content">
				<div class="modal-body">
					<form id="otheruser-form">
						<center>
						<div class="input-group">
							<span class="input-group-btn">
								<button class="btn btn-primary btn-lg btn-block">Vote to Kick</button>
							</span>
						</div>
						<br>
						<div class="input-group">
							<span class="input-group-btn">
								<button class="btn btn-primary btn-lg btn-block">Mute</button>
							</span>
						</div>
					</center>
					</form>
				</div>
			</div>
		</div>
	</div>

	<div class="modal fade bs-example-modal-md" id="change-name-dlg" tabindex="-1" role="dialog">
  		<div class="modal-dialog modal-md" role="dialog">
    	<div class="modal-content">
    		<div class="modal-body">
    		<form id="rename-form">
      		<div class="input-group input-group-lg">
				<input type="text" class="form-control" placeholder="New Name" id="new-name" autocomplete="off">
			</div>
			</form>
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

