"use strict";

var express = require("express");
var favicon = require("serve-favicon");
var bodyParser = require("body-parser");
var session = require("express-session");
var consolidate = require("consolidate"); // Templating library adapter for Express
var swig = require("swig");
var MongoClient = require("mongodb").MongoClient; // Driver for connecting to MongoDB
var http = require("http");
var csrf = require('csurf');

var routes = require("./app/routes");
var config = require("./config/config"); // Application config properties

MongoClient.connect(config.db, function(err, db) {
    if (err) {
        console.log("Error connecting DB" , err);
        process.exit(1);
    }
    console.log("Connected to the database: " + config.db);

    var app = express(); // Web framework to handle routing requests

     app.use(favicon(__dirname + "/app/assets/favicon.ico"));
    // Register templating engine
    app.engine(".html", consolidate.swig);
    app.set("view engine", "html");
    app.set("views", __dirname + "/app/views");
    app.use(express.static(__dirname + "/app/assets"));

    // Express middleware to populate "req.body" so we can access POST variables
      app.use(bodyParser.urlencoded({
        // Mandatory in Express v4
        extended: false
    }));

    // Enable session management using express middleware
    app.use(session({
        secret: config.cookieSecret,
        saveUninitialized: true,
        resave: true
    }));

    // Enable Express csrf protection
    app.use(csrf());

    // Make csrf token available to views
    app.use(function(req, res, next) {
        res.locals.csrfToken = req.csrfToken();
        console.log(1);
        next();
    });


    // Application routes
    routes(app, db);

    // Start HTTP connection
    http.createServer(app).listen(config.port, function() {
        console.log("Express http server listening on port " + config.port);
    });


});
