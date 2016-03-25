const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

const localOptions = {
  //tell local that there is no usernameField
  //or rather, that we are using the email field as the username field
  usernameField: 'email'
}
//
const localLogin = new LocalStrategy(localOptions, function(email, password, done){
  //verify this username and password
  //call done with user if it is correct username and password
  //else call done with false
  User.findOne({email: email}, function(err, user){
    if(err){
      return done(err);
    }
    if(!user){
      return done(null, false)
    }
    //compare passwords: is password supplied equal to user.password?
    //user.comparePassword is a method created on user prototype
    user.comparePassword(password, function(err, isMatch){
      if(err){
        return done(err);
      }
      if(!isMatch){
        return done(null, false);
      }
      //this done call back is applied by passport
      //and user here is applied to req
      return done(null, user);
    });
  });

});

//Setup options for JWT Strategy
const jwtOptions = {
  //whenever a request comes in, look in the header for 'authorization'
  //to find the Jwt
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret,
};

//create JWT Strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done){
  //we want to a) see if the userId in the payload exists in DB
  //if it exists, call done with that userId
  //otherwise, call done without a user object

  //payload.sub is the token that is
  //is made and sent to the user in the authentication controller
  User.findById(payload.sub, function(err, user){
    if(err) {
      //error
      return done(err, false);
    }
    if(user){
      //this user was found
      return done(null, user);
    }else{
      //this person could not be found
      return done(null, false);
      //or create a new account
      /*
      code to create a new account
      */
    }
  });
});

//Tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);
