//express framework USE THIS
var express = require('express');
//postgres connections and querys module
var pg = require('pg');
//body-parser is a populates the req.body with the variable
var bodyParser = require('body-parser');
//cors module allows cross origin resource sharing.
var cors = require('cors');

//connection string is postgress://dbusername:dbpassword@dbipaddress:5432/dbname
var conString = "postgres://ajackster:helloworld@localhost:5432/crowdsafe";
var client = new pg.Client(conString);
client.connect();

var app = express();

//serves all the static files in folder public
app.use(express.static(__dirname + '/public'));

//parses the form to get variables for 'post' functions
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//enables cross origin resource sharing
app.use(cors());

//use post to submit data from a form. To get the variables from the webpage, make sure that the input tags on html have a name.

app.post('/aggression', function(req, res){
    response = {
        report:req.body.reType, //req.body.reType getting the variable from the form with the name reType.
        subreport:req.body.subreType,
        comments:req.body.txtField
    };
    //datatype on postgresql called serial for auto-generating id
    client.query('INSERT INTO missing(report, subreport, text) values($1, $2, $3)', [response.report, response.subreport, response.comments]);
    console.log(response.report);
    console.log(response.subreport);
    console.log(response.comments);
    res.send(response.report + response.subreport + response.comments);
});

app.get('/allReportsMissing', function(req, res) {
	//see results on localhost:3000/allReportsMissing
	var query = 'SELECT * FROM missing';
	client.query(query, function(err, results) {
		console.log(results.rows);
		//results.rows[0].report would show the text from column report on row 0.
		res.send(results.rows[0]);	
	})
})
//setting port to 3000
var port = process.env.PORT || 3000
app.listen(port, function() {
	console.log('Server started on http://localhost' + ':' + port);
});
