// Create web server 

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next){
	// do logging
	console.log('Something is happening.');
	next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/',function(req, res){
	res.json({message: 'hooray! welcome to our api!'});
});

// more routes for our API will happen here

// on routes that end in /comments
// ----------------------------------------------------
router.route('/comments')

	// create a comment (accessed at POST http://localhost:8080/api/comments)
	.post(function(req, res){
		console.log(req.body);
		fs.readFile('./comments.json',function(err,data){
			var comments = JSON.parse(data);
			comments.push(req.body);
			fs.writeFile('./comments.json',JSON.stringify(comments,null,4),function(err){
				res.json({message: 'Comment created!'});
			});
		});
	})

	// get all the comments (accessed at GET http://localhost:8080/api/comments)
	.get(function(req, res){
		fs.readFile('./comments.json',function(err,data){
			var comments = JSON.parse(data);
			res.json(comments);
		});
	});

// on routes that end in /comments/:comment_id
// ----------------------------------------------------
router.route('/comments/:comment_id')

	// get the comment with that id (accessed at GET http://localhost:8080/api/comments/:comment_id)
	.get(function(req, res){
		fs.readFile('./comments.json',function(err,data){
			var comments = JSON.parse(data);
			var comment = comments[req.params.comment_id];
			res.json(comment);
		});
	})
