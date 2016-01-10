var express = require('express');
var pg = require('pg');

var conString = "postgres://ajackster:helloworld@localhost:5432/crowdsafedb";

var app = express();

app.set('port', process.env.PORT || 3000);
var port = app.get('port');

app.use(express.static(__dirname + '/public'));

var client = new pg.Client(conString);
client.connect();

app.get('/agression', function(req, res) {

var data = {reporttype: req.body.agressionReportType, subreport: req.body.agressionSubreportType, text: req.body.agressionText};

		client.query("INSERT INTO reports(reporttype, subreport, comments) values($1, $2, $3)", [data.reporttype, data.subreport, data.text]);
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
