var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');

passport.use(new LocalStrategy({
		usernameField: 'login'
	}, function(username, password, done) {
    User.findOne({ login: username }, function(err, user) {
      if (err) {return done(err);}
      if (!user || !user.validPassword(password)) {
        return done(null, false, {
          message: 'Incorrect username or password'
        });
      }
      return done(null, user);
    });
  }
));