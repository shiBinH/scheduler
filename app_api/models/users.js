var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var userSchema = new mongoose.Schema({
	login: {type: String, unique: true, required: true},
  email: {type: String, unique: true, required: true},
  firstName: String,
	lastName: String,
	gender: String,
	age: Number,
	bio: String,
	hash: String,
  salt: String,
	admin: {type: Boolean, default: false},
	events: [{
		type: String,
		unique: true
	}]
});

userSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 2000, 64).toString('hex');
};

userSchema.methods.validPassword = function(password) {
  var entered = crypto.pbkdf2Sync(password, this.salt, 2000, 64).toString('hex');
  return entered === this.hash;
};

userSchema.methods.generateJwt = function() {
  var expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate()+3);

  return jwt.sign({
			admin: this.admin,
      _id: this.id,
      login: this.login,
      email: this.email,
      exp: parseInt(expirationDate.getTime() / 1000)
  }, process.env.JWT_SECRET);
};

userSchema.methods.addEvent = function(id) {
	this.events.push(id);
};

mongoose.model('User', userSchema);