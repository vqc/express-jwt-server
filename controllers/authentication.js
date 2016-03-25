const User = require('../models/user');
const jwt = require('jwt-simple');
const config = require ('../config');

function tokenForUser(user){
  //encode user's id instead of user's email
  const timestamp = new Date().getTime();
  return jwt.encode({sub: user.id, iat: timestamp}, config.secret);
}

exports.signin = function(req, res, next){
  //user has already had their email and password auth'd
  //we need to give them their token
  //passport sets a user onto req.user (see passport.js)
  res.send({token: tokenForUser(req.user)});
}

exports.signup = function(req, res, next){
  console.log('req body email', req.body.email);
  const email = req.body.email;
  const password = req.body.password;
  //check for whether both requests exist
  if(!email || !password){
    return res.status(422).send({error: 'Provide both email and password'});
  }
  //also check to see whether email is valid

  //don't save password in plaintext

  //see if user exists
  User.findOne({email: email}, function(err, existingUser){
    if(err){
      return next(err);
    }
    //if user exists, return error
    if(existingUser){
      return res.status(422).send({error: 'Email is in use'});
    }
    //if email does not exist, create and save user record
    const user = new User({
      email: email,
      password: password
    });
    //note that this user is a mongoose object.
    //calling the save function will trigger the on save hook
    //that is defined in the user model
    user.save(function(err){
      if(err){
        return next(err);
      }
      //respond to request
      //need to provide identifying information that user can use
      //in the future.
      //send back a token
      res.json({token: tokenForUser(user)});
    });
  });

}
