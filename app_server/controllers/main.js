var request = require('request');

var validDate = function(req) {
	var month = req.body.month;
	var day = req.body.day;
	var year = req.body.year;
	if (month===2) {
		if(day>29) return false;
		if (day===29 && year%4!==0) return false;
		return true;
	}
	else if (day===31 && (month!==1 && month!==3 && month!==5 && month!==7 && month!==8 && month!==10 && month!==12)) {
		return false;
	}
	return true;
};

var formatDate = function(body) {
	var hour;
	if (body.morning==='true') {
		if (body.hour===12) hour = 0;
		else hour = body.hour;
	}
	else {
		if (body.hour!==12) hour = parseInt(body.hour) + 12;
		else hour = body.hour;
	}
	return new Date(body.year, body.month - 1, body.day, hour, body.minute);
};

module.exports.loginCheck = function(req, res, next) {
	var token = req.session.schedulerToken;
	if (token) {
		var payloadEncoded = new Buffer(token.split('.')[1], 'base64');
		var payload = JSON.parse(payloadEncoded.toString());
		res.locals.isLoggedIn = payload.exp > Date.now() / 1000;
		res.locals.username = payload.login;
		res.locals._id = payload._id;
		res.locals.email = payload.email;
	}
	req.headers['authorization'] = 'Bearer ' + token;
	res.locals.hostname = 'http://' + req.hostname + ':3002';
	next();
};//needs modification

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
		if(err) {
			console.log(err);
			res.status(400);
			res.send('@@@@@\n@@@@		Request Error\n@@@@@')
		}
		res.render('announcements', {
			announcements: body
		});
	});
};
module.exports.announcementForm = function(req, res) {
	res.render('addAnnouncement');
};
module.exports.createAnnouncement = function(req, res) {
	var tokenHeader = 'Bearer ' + req.session.schedulerToken;
	var requestOptions = {
		url: res.locals.hostname + '/api/announcements/new',
		method: 'POST',
		headers: {
			token: tokenHeader
		},
		json: {
			summary: req.body.summary,
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
			console.log('@@@@@\n@@@@@\tAnnouncement successfully made!\n@@@@@');
			res.redirect(req.originalUrl);
		}
	});
};
module.exports.getAnnouncement = function(req, res) {
	var requestOptions = {
		url: res.locals.hostname + '/api/announcements/' + req.params.announcementId,
		method: 'GET',
		json: {}
	};
	request(requestOptions, function(err, response, body) {
		if (err) {
			console.log(err);
			res.status(400);
			res.send('Request error');
		}
		else if (response.statusCode===200) {
			res.status(200);
			res.render('announcementPage', {
				announcement: body
			});
		}
		else {
			console.log(body);
			res.status(404);
			res.redirect('/');
		}
 	});
};

module.exports.eventsCtrl = function(req, res) {
	var requestOptions = {
		url: 'http://localhost:3002/api/events',
		method: 'GET',
		json: {}
	};
	request(requestOptions, function(err, response, body){
		if(response.statusCode===400) {
			res.status(400);
			res.send(body);
		}
		else {
			res.status(200);
			res.render('events', {
				events: body
			});
		}
	});
};
module.exports.addEventsCtrl = function(req, res) {
	res.status(200);
	res.render('eventsForm', {
		message: ''
	});
};
module.exports.submitEvent = function(req, res) {
	if (!validDate(req)) {
		res.render('eventsForm', {
			message: 'Invalid date'
		});
	}
	var eventTime = formatDate(req.body);
	var requestOptions = {
		url: 'http://localhost:3002/api/events/new',
		method: 'POST',
		json: {
			title: req.body.title,
			summary: req.body.summary,
			time: eventTime,
			location: req.body.location,
			description: req.body.description,
			capacity: req.body.capacity
		}
	};
	request(requestOptions, function(err, response, body) {
		if (response.statusCode===201) {
			console.log('@@@@@\n@@@@@		Event successfully created\n@@@@@');
			res.render('eventsForm', {
				message: 'Event successfully created!'
			});
		}
		else if (response.statusCode===400) {
			res.status(400);
			res.send('DB error creating event');
		}
		else res.status(400).send('Request error');
	});
};
module.exports.joinEvent = function(req, res) {
	var requestOptions = {
		url: res.locals.hostname + '/api/events/' + req.params.eventId+ '/join',
		method: 'PUT',
		qs: {
			userId: res.locals._id,
			username: res.locals.username,
			role: req.body.role
		}
	};
	request(requestOptions, function(err, response, body) {
		if (err) {
			console.log('@@@\n@@@ Server: Failed to make request\n@@@');
			res.status(400);
			res.send(err);
		}
		else if (response.statusCode===400) {
			res.status(400);
			res.send(body);
		}
		else if (response.statusCode===304) {//needs ajax implementation of this
			var requestOptions = {
				url: 'http://localhost:3002/api/events',
				method: 'GET',
				json: {}
			};
			request(requestOptions, function(err, response, body){
				if(response.statusCode===400) {
					res.status(400);
					res.send(body);
				}
				else {
					res.status(200);//needs to redirect to specific event page
					res.render('event', {
						message: 'Event is full',
						events: body
					});
				}
			});
		}
		else {
			res.status(200);
			res.redirect('/events/'+req.params.eventId);
		}
	});
};
module.exports.unjoinEvent = function(req, res) {
	var requestOptions = {
		url: res.locals.hostname+'/api/events/'+req.params.eventId+'/cancel',
		method: 'PUT',
		qs: {
			userId: res.locals._id
		}
	};
	request(requestOptions, function(err, response, body) {
		if(err) {
			console.log('@@@@@\n@@@@@\tServer: Request Error\n@@@@@');
			console.log(err);
			res.status(400);
			res.send('Server: Request Error');
		}
		else if (response.statusCode===400) {
			console.log(response);
			console.log(body);
			res.status(304);
			res.redirect('/events/'+reeq.params.eventId);
		}
		else {
			res.status(200);
			res.redirect('/events/'+req.params.eventId);
		}
	});
}
module.exports.getEvent = function(req, res) {
	var requestOptions = {
		url: res.locals.hostname + '/api/events/' + req.params.eventId,
		method: 'get',
		qs: {userId: res.locals._id},
		json: {}
	};
	request(requestOptions, function(err, response, body) {
		if (err) {
			console.log('request error');
			res.status(400);
			res.send(err);
		}
		else if (response.statusCode===200) {
			res.status(200);
			console.log(body.event);
			res.render('eventPage', {
				participant: body.participant,
				event: body.event
			});
		}
		else {
			console.log(body);
			res.status(400);
			res.redirect('/');
		}
	});
}

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
			email: req.body.email,
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			age: req.body.age,
			gender: req.body.gender,
			bio: req.body.bio
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
	if (!req.body.email || !req.body.password) {
		res.render('/login', {
			message: 'All fields required'
		});
		return false;
	}
	
	var requestOptions = {
		url: 'http://localhost:3002/api/login',
		method: 'POST',
		json: {
			email: req.body.email,
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
			console.log('@@@@@\n@@@@@	Successfully logged in!\n@@@@@')
			res.status(200);
			res.redirect('/');
		}
	});
}
module.exports.logoutCtrl = function(req, res) {
	req.session.schedulerToken = null;
	res.status(200);
	res.redirect('/');
};

module.exports.userPageCtrl = function(req, res) {
	var pastEvents, upcomingEvents;
	pastEvents = [];
	upcomingEvents = [];
	var requestOptions = {
		url: res.locals.hostname + '/api/user/' + req.params.userId,
		method: 'GET',
		json: {}
	};
	request(requestOptions, function(err, response, body) {
		if (err) console.log(err);
		else if (response.statusCode==200) {
			console.log(body);
			for (var i=0; i<body.events.length; i++) {
				var isOver = (new Date(body.events[i].time)).getTime() < Date.now();
				if (isOver) pastEvents.push(body.events[i]);
				else upcomingEvents.push(body.events[i]);
			}
			res.render('user', {
				user: body.user,
				pastEvents: pastEvents,
				upcomingEvents: upcomingEvents
			})
		}
		else {
			console.log(body);
			res.status(400);
			res.redirect('/');
		}
	})
};
module.exports.userEvents = function(req, res) {

}