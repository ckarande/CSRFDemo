var bcrypt = require("bcrypt-nodejs");

/* The UserDAO must be constructed with a connected database object */
function UserDAO(db) {

    "use strict";

    /* If this constructor is called without the "new" operator, "this" points
     * to the global object. Log a warning and call it correctly. */
    if (false === (this instanceof UserDAO)) {
        console.log("Warning: UserDAO constructor called without 'new' operator");
        return new UserDAO(db);
    }

    var usersCol = db.collection("users");

     this.validateLogin = function(userName, password, callback) {

        // Callback to pass to MongoDB that validates a user document
        function validateUserDoc(err, user) {

            if (err) return callback(err, null);

            if (user) {
                if (comparePassword(password, user.password)) {
                    callback(null, user);
                } else {
                    var invalidPasswordError = new Error("Invalid password");
                    // Set an extra field so we can distinguish this from a db error
                    invalidPasswordError.invalidPassword = true;
                    callback(invalidPasswordError, null);
                }
            } else {
                var noSuchUserError = new Error("User: " + user + " does not exist");
                // Set an extra field so we can distinguish this from a db error
                noSuchUserError.noSuchUser = true;
                callback(noSuchUserError, null);
            }
        }

        // Helper function to compare passwords
        function comparePassword(fromDB, fromUser) {
            return fromDB === fromUser;
            /*
            // Fix for A2-Broken Auth
            // compares decrypted password stored in this.addUser()
            return bcrypt.compareSync(fromDB, fromUser);
            */
        }

        usersCol.findOne({
            userName: userName
        }, validateUserDoc);
    };

    // This is the good one, see the next function
    this.getUserById = function(userId, callback) {
        usersCol.findOne({
            _id: parseInt(userId)
        }, callback);
    };

}

module.exports.UserDAO = UserDAO;
