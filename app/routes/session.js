var UserDAO = require("../data/user-dao").UserDAO;

/* The SessionHandler must be constructed with a connected db */
function SessionHandler(db) {
    "use strict";

    var userDAO = new UserDAO(db);


    this.isLoggedInMiddleware = function(req, res, next) {
        if (req.session.userId) {
            next();
        } else {
            console.log("redirecting to login");
            return res.redirect("/login");
        }
    };

    this.displayLoginPage = function(req, res, next) {
        return res.render("login", {
            userName: "",
            password: "",
            loginError: ""
        });
    };

    this.handleLoginRequest = function(req, res, next) {
        var userName = req.body.userName;
        var password = req.body.password;

        userDAO.validateLogin(userName, password, function(err, user) {
            var errorMessage = "Invalid username and/or password";

            if (err) {
                    if(err.noSuchUser || err.invalidPassword) {
                    return res.render("login", {
                        userName: userName,
                        password: "",
                        loginError: errorMessage
                    });

                    } else {
                        return next(err);
                    }
            }

            // Regenerating in each login
            // TODO: Add another vulnerability related with not to do it
            req.session.regenerate(function() {
                req.session.userId = user._id;
                return res.redirect("/dashboard");
            });
        });
    };

    this.displayLogoutPage = function(req, res, next) {
        req.session.destroy(function() {
            res.redirect("/");
        });
    };

    this.displayWelcomePage = function(req, res, next) {
        var userId;

        if (!req.session.userId) {
            console.log("welcome: Unable to identify user...redirecting to login");

            return res.redirect("/login");
        }

        userId = req.session.userId;

        userDAO.getUserById(userId, function(err, doc) {
            if (err) return next(err);

            doc.userId = userId;

            return res.render("dashboard", doc);
        });

    };
}

module.exports = SessionHandler;
