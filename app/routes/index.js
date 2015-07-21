var SessionHandler = require("./session");
var ProfileHandler = require("./profile");
var ErrorHandler = require("./../middleware/error").errorHandler;
// Middleware to check if a user is logged in
var isLoggedIn = require("./../middleware/isUserLoggedIn").isUserLoggedIn;

var exports = function(app, db) {

    "use strict";

    var sessionHandler = new SessionHandler(db);
    var profileHandler = new ProfileHandler(db);


   // The main page of the app
    app.get("/", sessionHandler.displayWelcomePage);

    // Login form
    app.get("/login", sessionHandler.displayLoginPage);
    app.post("/login", sessionHandler.handleLoginRequest);

    // Logout page
    app.get("/logout", sessionHandler.displayLogoutPage);

    // The main page of the app
    app.get("/dashboard", isLoggedIn, sessionHandler.displayWelcomePage);

    // Pension payout page
    app.get("/payout", isLoggedIn, profileHandler.displayPayoutPage);
    app.post("/payout", isLoggedIn, profileHandler.handlePayoutUpdate);

    // Profile page
    app.get("/profile", isLoggedIn, profileHandler.displayProfile);
    app.post("/profile", isLoggedIn, profileHandler.handleProfileUpdate);


    // Error handling middleware
    app.use(ErrorHandler);
};

module.exports = exports;
