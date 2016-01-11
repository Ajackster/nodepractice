var express = require('express');
var pg = require('pg');
var bodyParser = require('body-parser');

var conString = "postgres://ajackster:helloworld@localhost:5432/crowdsafedb";
var client = new pg.Client(conString);
client.connect();

var app = express();

app.set('port', process.env.PORT || 3000);
var port = app.get('port');

app.use(express.static(__dirname + '/public'));

app.post('/#/Home/agression', function(req, res){
res.render('/public/agression.html', {report : req.body.reType, subreport : req.body.subreType, comments : req.body.txtField});
client.query("INSERT INTO reports(reporttype, subreporttype, comments) values($1, $2, $3)"[report, subreport, comments]);

});

app.use(function(req, res) {
	res.type('text/plain');
	res.status(404);
	res.send('404 - Not Found');
});

app.use(function(err, req, res, next){
	console.error(err.stack);
	res.type('text/plain');
	res.status(500);
	res.send('500 - Server Error');
});

app.listen(port, function() {
	console.log('Server started on http://(website):' + port);
});
