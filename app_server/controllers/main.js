var request = require('request');

module.exports.loginCheck = function(req, res, next) {
	var token = req.session.schedulerToken;
	if (token) {
		var payloadEncoded = new Buffer(token.split('.')[1], 'base64');
		var payload = JSON.parse(payloadEncoded.toString());
		res.locals.isLoggedIn = payload.exp > Date.now() / 1000;
		res.locals.username = payload.login;
	}
	next();
};

module.exports.homeCtrl = function (req, res) {
	res.render('index');
};

module.exports.announceCtrl = function (req, res) {
	var requestOptions = {
		url: 'http://localhost:3002/api/announcements',
		method: 'GET',
		json: {}
	};
	request(requestOptions, function(err, response, body) {
		if(err) console.log(err);
		console.log('@@@@@@@@@@@@\n @@@@@@@@@@@		Get request successful\n @@@@@@@@@@');
		res.render('announcements', {
			announcements: body
		});
	});
};

module.exports.eventsCtrl = function(req, res) {
	res.render('events');
};
module.exports.addEventsCtrl = function(req, res) {
	res.status(200);
	res.render('eventsForm', {
		message: ''
	});
};

module.exports.registerForm = function(req, res) {
	res.render('register', {message: ''});
};
module.exports.registerCtrl = function(req, res) {
	if (!req.body.username || !req.body.password || !req.body.email) {
		res.status('400');
		res.render('register',{
			message: 'All fields required'
		});
	}
	var requestOptions = {
		url: 'http://localhost:3002/api/register',
		method: 'POST',
		json: {
			username: req.body.username,
			password: req.body.password,
			email: req.body.email
		}
	}
	request(requestOptions, function(err, response, body) {
		if (err) {
			console.log('Request error');
			res.status(response.statusCode);
			res.render('register', {
				message: err
			});
		}
		else if (response.statusCode===400) {
			console.log('From SERVER: all fields required');
			res.status(response.statusCode);
			res.render('register', {
				message: 'Username or email already exists'
			});
		}
		else {
			res.status(response.statusCode);
			res.render('register', {
				message: "Successfully registered!"
			});
		}
	});
};

module.exports.loginForm = function(req, res) {
	res.render('login');
};
module.exports.loginCtrl = function(req, res) {
	if (!req.body.login || !req.body.password) {
		res.render('/login', {
			message: 'All fields required'
		});
		return false;
	}
	
	var requestOptions = {
		url: 'http://localhost:3002/api/login',
		method: 'POST',
		json: {
			login: req.body.login,
			password: req.body.password
		}
	}
	
	request(requestOptions, function(err, response, body) {
		if (err) res.send('Login request failed');
		else if (response.statusCode===401) {
			res.status(response.statusCode);
			res.render('login', {
				message: body.message
			});
		}
		else {
			req.session.schedulerToken = body.token;
			res.status(200);
			console.log('@@@@@\n@@@@@	Successfully logged in!\n@@@@@')
			res.redirect('/');
		}
	});
}
module.exports.logoutCtrl = function(req, res) {
	req.session.schedulerToken = null;
	res.status(200);
	res.redirect('/');
};

module.exports.announcementForm = function(req, res) {
	res.render('addAnnouncement');
};
module.exports.createAnnouncement = function(req, res) {
	var requestOptions = {
		url: 'http://localhost:3002/api/announcements/new',
		method: 'POST',
		json: {
			announcement: req.body.announcement,
			author: req.body.author ? req.body.author : undefined,
			details: req.body.details
		}
	};

	request(requestOptions, function(err, response, body) {
		if(err) res.send('Request Error');
		else if (response.statusCode===404) {
		    console.log("invalid token");
		    res.redirect(req.originalUrl);
		}
		else {
			console.log('Announcement successfully made!');
			res.redirect(req.originalUrl);
		}
	});
};