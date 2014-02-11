
var express = require('express') 
  , http = require('http')
  , path = require('path')
  , fs = require('fs');
  ;
  
var app = express();

app.configure(function(){
	  app.set('port', process.env.PORT || 4000); 	 
	  app.use(express.logger('dev'));
	  app.use(express.bodyParser());
	  app.use(express.methodOverride());
	  app.use(express.cookieParser('cookie_secret'));   
	  app.use(express.cookieSession({ secret: 'session_secret'}));   
	  app.use(app.router);
	  app.use(express.static(path.join(__dirname, 'public')));	   
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

function Game(filename){
	this.lines = fs.readFileSync(filename).toString().split("\n");	
}

Game.prototype.punish = function(){
	while(true){
		var ret = this.lines[Math.floor(Math.random() * this.lines.length)];
		if(ret.trim().length){
			return ret;
		}
	}	
}

Game.prototype.q_a = function(){
	while(true){
		var q_a = this.lines[Math.floor(Math.random() * this.lines.length)].split("？");
		if(q_a.length == 2)
			return {question: q_a[0], answer: q_a[1]};
	}	
}

var punishs = new Game('真心话大冒险.txt');
var qa = new Game('一站到底.txt');

app.get('/punish', function (req, res) { res.send(punishs.punish()); });
app.get('/q_a', function (req, res) { res.send(qa.q_a()); });

var server = http.createServer(app);
server.listen(app.get('port'), function(){	console.log("Express server listening on port " + app.get('port'));  });

