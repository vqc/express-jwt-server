const Authentication = require('./controllers/authentication');

const passportService = require('./services/passport');
const passport = require('passport');

//make session false because we aren't using sessions with JWT
const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });

module.exports = function(app){
  //requireAuth tests whether the token you've provided is "correct"
  app.get('/', requireAuth, function(req, res, next){
    //req = the actual requests
    //res = response we will send back
    //next = error handling
    res.send({message: 'hidden information'});
  });
  //requireSignin test whether the email and password is correct
  //then Authentication.signup provides you with the accompanying token
  app.post('/signup', Authentication.signup);
  //authentication.signup provides a token after you provide an email and password
  app.post('/signin', requireSignin, Authentication.signin);
}
