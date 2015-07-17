var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var consolidate = require('consolidate');
var swig = require('swig');
var MongoClient = require('mongodb').MongoClient;
var http = require('http');
var csrf = require('csurf');

// Application specific modules
var routes = require('./app/routes');
var config = require('./config/config');

MongoClient.connect(config.db, function(err, db) {

    var app = express();
    app.engine('.html', consolidate.swig);
    app.set('view engine', 'html');
    app.set('views', __dirname + '/app/views');

    // Serve static contents from local dir
    app.use(express.static(__dirname + '/app/assets'));

    // Express middleware to populate 'req.body' with Form POST variables
    app.use(bodyParser.urlencoded({extended: false}));

    // Enable session management using express middleware
    app.use(session({secret: 'sEcur3', saveUninitialized: true, resave: true}));

    // Enable Express csrf protection
    app.use(csrf());

    // Make csrf token available to views
    app.use(function(req, res, next) {
        res.locals.csrfToken = req.csrfToken();
        next();
    });

    // Application routes
    routes(app, db);

    // Start HTTP connection
    http.createServer(app).listen(config.port, function() {
        console.log('Express http server listening on port ' + config.port);
    });

});
