/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    name: {
  		type:'string',
  		required: true
  	},
  	email:{
  		type:'string',
  		required: true,
  		unique: true
  	},
  	password:{
  		type:'string',
  		required: true
  	},
  	lastLoggedIn:{
  		type:'date',
  		required: true,
  		defaultsTo: new Date(0)
  	}/*,
  	gravatarUrl:{
  		type:'string'
  	}*/
  

});

var User = module.exports = mongoose.model('User', userSchema);

/*module.exports = {
	// Sign User Up
	signup: function(req, res, callback){
		console.log('Backend Signup' + req.params.email);

		var Passwords = require('machinepack-passwords');

		// Encrypt Password
		Passwords.encryptPassword({
			password: req.body.password,
			difficulty: 10,
		}).exec({
			error: function(err){
				console.log(err);
				callback(err, null);
			},
			success: function(encryptedPassword){
				console.log(2);
				require('machinepack-gravatar').getImageUrl({
					emailAddress: req.body.email
				}).exec({
					error: function(err){
						callback(err, null);
					},
					success: function(gravatarUrl){
						// Create User
						User.create({
							name: req.body.username,
							email: req.body.email,
							password: encryptedPassword,
							lastLoggedIn: new Date(),
							gravatarUrl: gravatarUrl
						}, function userCreated(err, newUser){
							if(err){
								console.log('Error: '+err);
                                res.status(500);
								callback(err, newUser);
							}

							//SESSION VAR
                            else {
                                console.log('User Added');

                                callback(err, newUser);
                            }
						})
					}
				})
			}
		})
	},
	login: function(req, res, callback){
		console.log('test');
		// Validate User
		User.findOne({
			email: req.body.email
		}, function foundUser(err, user){
			if(err){
				callback(err, null);
			}
			if(!user){
                res.status(404);
				callback(err, user);
			}
            else {

                require('machinepack-passwords').checkPassword({
                    passwordAttempt: req.body.password,
                    encryptedPassword: user.password
                }).exec({
                    error: function(err){
                        console.log('Password Error');
                        res.status(400);
                        callback(err, null);
                    },
                    incorrect: function(){
                        console.log('Password incorrect');
                        res.status(400);
                        callback(null, null);
                    },
                    success: function(){
                        //req.session.me = user.id;
                        res.status(200);
                        console.log('SUCCESS');
                        callback(null, user);
                    }
                })
        }
		})
	},

	logout: function(req, res, callback){
		User.findOne({id: req.session.me}, function(err, user){
			if(err){
				callback(err, null);
			}
			if(!user){
				callback(err, null);
			}

			req.session.me = null;

		})
	}
};*/

