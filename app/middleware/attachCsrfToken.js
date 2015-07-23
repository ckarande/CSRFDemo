// Make csrf token available to views
var attachCsrfToken = function(req, res, next) {
    res.locals.csrfToken = req.csrfToken();
    next();
};

module.exports = attachCsrfToken;
