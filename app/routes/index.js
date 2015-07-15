var SessionHandler = require("./session");
var ProfileHandler = require("./profile");
var ErrorHandler = require("./error").errorHandler;

var exports = function(app, db) {

    "use strict";

    var sessionHandler = new SessionHandler(db);
    var profileHandler = new ProfileHandler(db);

    // Middleware to check if a user is logged in
    var isLoggedIn = sessionHandler.isLoggedInMiddleware;

   // The main page of the app
    app.get("/", sessionHandler.displayWelcomePage);

    // Login form
    app.get("/login", sessionHandler.displayLoginPage);
    app.post("/login", sessionHandler.handleLoginRequest);

    // Logout page
    app.get("/logout", sessionHandler.displayLogoutPage);

    // The main page of the app
    app.get("/dashboard", isLoggedIn, sessionHandler.displayWelcomePage);

    // Profile page
    app.get("/profile", isLoggedIn, profileHandler.displayProfile);
    app.post("/profile", isLoggedIn, profileHandler.handleProfileUpdate);


    // Error handling middleware
    app.use(ErrorHandler);
};

module.exports = exports;
