var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports.register = function(req, res) {
  if(!req.body.username || !req.body.email || !req.body.password) {
    res.status(400);
    res.json({message: "All fields required"})
		return;
  }
  
  var user = new User({
    login: req.body.username,
    email: req.body.email
  });
  user.setPassword(req.body.password);
  
  user.save(function(err) {
    if (err) {
      res.status(400);
			console.log(err);
      res.json(err);
    } else {
      res.status(201);
      res.end();
    }
  });
};

module.exports.login = function(req, res) {
  if(!req.body.login || !req.body.password) {
    res.status(400);
    res.json({
      message: "All fields required"
    });
    return;
  }
  
  passport.authenticate('local', function(err, user, info) {
    var token;
    
    if (err) {
      res.status(404);
      res.json(err);
      return;
    }
    if (user) {
      token = user.generateJwt();
      res.status(200);
      res.json({
        token: token
      });
    } else {
      res.status(401);
      res.json(info);
    }
  })(req, res);
};
