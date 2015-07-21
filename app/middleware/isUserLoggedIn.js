// isUserLoggedIn middleware handling middleware

var isUserLoggedIn = function(req, res, next) {
    if (req.session.userId) {
        next();
    } else {
        console.log("redirecting to login");
        return res.redirect("/login");
    }
};

exports.isUserLoggedIn = isUserLoggedIn;
