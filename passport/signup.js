var LocalStrategy   = require('passport-local').Strategy;
var User = require('../models/userController');
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport){

	passport.use('signup', new LocalStrategy({
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {
            console.log("Username: "+username);
            findOrCreateUser = function(){
                // find a user in Mongo with provided username
                User.findOne({ 'email' :  req.body.email }, function(err, user) {
                    // In case of any error, return using the done method
                    if (err){
                        console.log('Error in SignUp: '+err);
                        return done(err);
                    }
                    // already exists
                    if (user) {
                        console.log('User already exists with username: '+username);
                        return done(null, false, req.flash('message','Email already in use'));
                    } else {
                        // if there is no user with that email
                        // create the user
                        var newUser = new User();
                        console.log(JSON.stringify(req.params, null, 4));
                        // set the user's local credentials
                        newUser.name = req.body.username;
                        newUser.password = createHash(password);
                        newUser.email = req.body.email;
                        newUser.lastLoggedIn = new Date(0);
                        //newUser.lastName = req.param('lastName');

                        // save the user
                        newUser.save(function(err) {
                            if (err){
                                console.log('Error in Saving user: '+err);  
                                throw err;  
                            }
                            console.log('User Registration succesful');    
                            return done(null, newUser);
                        });
                    }
                });
            };
            // Delay the execution of findOrCreateUser and execute the method
            // in the next tick of the event loop
            process.nextTick(findOrCreateUser);
        })
    );

    // Generates hash using bCrypt
    var createHash = function(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    }

}