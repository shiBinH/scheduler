var mongoose = require('mongoose');
var passport = require('passport');
var announcementsModel = mongoose.model('announcements');
var eventModel = mongoose.model('events');
var userModel = mongoose.model('User');

var formatDate = function (date) {
  var months = ['Jan', 'Feb', 'Mar','Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var hour = date.getHours();
  var timeOfDay = 'AM';
  if (hour===22 || hour===23) {
    timeOfDay = 'PM';
    hour = hour - 12;
  }
  else if (hour > 12) {
    hour = hour - 12;
    timeOfDay = 'PM';
  }
  else timeOfDay = 'PM';
  var formatedDate =  months[date.getMonth()] + ' '
                    + date.getDate() + ', '
                    + date.getFullYear() + ' '
                    + hour + ':';
  formatedDate = formatedDate.concat(date.getMinutes().toString().length < 2 ? '0' + date.getMinutes() : date.getMinutes());
  formatedDate += ' ' + timeOfDay;
  return formatedDate;
}
/*
module.exports.announceList = function(req, res) {
	announcementsModel
		.find({}, null, {sort:{createdAt:-1}, limit: 3}, //3rd param takes mongdb cursor methods
			function(err, data) {
				if(err) console.log(err);
				else {
					var announcement = data;
					var months = ['Jan', 'Feb', 'Mar', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
					for (var i=0; i<announcement.length; i++) {
						announcement[i].time = formatDate(announcement[i].createdAt);
					}
					res.status(200);
					res.json(announcement);
			}}
		);
};
*/
module.exports.getAnnounce = function(req, res) {
	announcementsModel
		.findOne({_id: req.params.id})
		.exec(function(err, data) {
			if (err) {
				console.log('\n\t\tDB Error\n')
				res.status(400);
				res.json(err);
			}
			else if (!data) {
				console.log('\n\tCannot find user\n');
				res.status(404);
				res.json(data);
			}
			else {
				console.log('\n\t\tQuery was successful!\n');
				data.time = formatDate(data.createdAt);
				res.status(200);
				res.json(data);
			}
		});
};
module.exports.addAnnounce = function (req, res) {
	if (!req.payload.admin) {
		res.status(403);
		res.json({});
		return;
	}
	var newAnnouncement = new announcementsModel({
		summary: req.body.summary,
		title: req.body.announcement,
		description: req.body.details,
		author: req.payload.login
	});
	newAnnouncement.save(function(err, data) {
		if (err) {
			console.log(err);
			res.status(401);
			res.json(err);
		}
		else {
			res.status(201);
			res.json(data);
		}
	});
};
module.exports.submitAnnounceComment = function(req, res) {
	announcementsModel
		.findOne({_id: req.params.announcementId})
		.exec(
			function(err, announcement) {
				if (err) {
					console.log('\n\tDB Error\n');
					res.status(400);
					res.json(err);
				}
				console.log(announcement);
				announcement.comments.push({
					userId: req.payload._id,
					userName: req.payload.login, 
					comment: req.body.comment
				});
				announcement
					.save(
						function(err2, data) {
							if (err2) {
								console.log('\n\tAPI: failed to add comment');
								res.status(400);
								res.json(err2);
							}
							else {
								console.log('\n\nAPI: Successfully updated DB');
								res.status(200);
								res.json(data);
							}
						}
					);
			}
		);
}
module.exports.moreAnnouncements = function(req, res) {
	announcementsModel
		.find(
			{createdAt:{$lt:req.body.time ? req.body.time : new Date()}},
			null,
			{sort: {createdAt:-1}, limit: 4},
			function(err, announcements){
				if (err) {
					console.log('\n\tFailed to get more annoucements');
					res.status(400);
					res.json({});
				} 
				else {
					console.log('\n\tGot more announcements form DB\n');
					for (var i=0; i<announcements.length; i++) {
						announcements[i].time = formatDate(announcements[i].createdAt);
					}
					res.status(200);
					res.json(announcements);
				}
			}
		)
};
module.exports.moreEvents = function(req, res) {
	eventModel
		.find(
			{time: {$lt: req.body.time}},
			null,
			{sort: {time:-1}, limit: 3},
			function(err, events) {
				if (err) {
					console.log('DB Error: ' + err);
					res.status(400);
					res.json(err);
				} else {
					console.log('\n\tFound events\n');
					res.status(200);
					res.json(events);
				}
			}
		)
}//needs improvement

module.exports.eventsList = function(req, res) {
	eventModel
		.find()
		.sort({time: -1})
		.limit(3)
		.exec(function(err, events){
			if (err) {
				console.log('DB Error: ' + err);
				res.status(400);
				res.json(err);
			}
			else {
				res.status(200);
				res.json(events);
			}
		});
};//chaining sort() to find()
module.exports.addEvent = function(req, res) {
	if (!req.payload.admin) {
		res.status(403);
		res.jeson({});
		return;
	}
	var newEvent = new eventModel({
		title: req.body.title,
		summary: req.body.summary,
		description: req.body.description,
		location: req.body.location,
		time: req.body.time,
		capacity: req.body.capacity ? req.body.capacity : undefined
	});
	newEvent.save(function(err, data) {
		if(err) {
			res.status(400);
			res.json(err);
		}
		else {
			res.status(201);
			res.json(data);
		}
	});
};
module.exports.joinEvent = function(req, res){
	userModel
		.update(
			{_id: req.payload._id}, 
			{$addToSet: {events: req.params.eventId}},
			function(err, response) {
				if (err) {
					console.log('\n\tDB Error\n');
					res.status(400);
					res.json(err);
				} else {
					console.log('\n\tSuccessfully updated user\n');
				}
			}
		)
	eventModel
		.update(
			{_id: req.params.eventId}, 
			{$addToSet: {
					participants: {
						_id: req.payload._id,
						name: req.query.username,
						role: req.query.role
					} 
				}
			},
			function (err, response) {
				if (err) {
					console.log('\n\tDB Error\n');
				} else {
					console.log('\n\tSuccessfully updated event');
				}
			});
	eventModel
		.findById(req.params.eventId)
		.exec(
			function(err, event){
				event.fixNRegistered();
				event.save(
					function(err2, data) {
						if (err2) { 
							console.log('\n\tFailed to update nRegistered\n');
							res.status(400);
							res.json(err);
						} else {
							console.log('\n\tSuccessfully updated nRegistered');
							res.status(200);
							res.json(data);
						}
					}
				);
			}
		);
};
module.exports.unjoinEvent = function(req, res) {
	userModel// get user
		.update({_id:req.payload._id}, {
			$pull: {// remove event from events field
				events: req.params.eventId
			}
		}, function(err, response){
				if (err) {
					console.log('@@@@@\n@@@@@\tDB Error:\n@@@@@');
				}
				else {
					console.log('@@@@@\n@@@@@\tSuccessfully updated\n@@@@@');
					console.log(response);
				}
	});
	eventModel.update({_id: req.params.eventId}, {// get event
		$pull: {//($pull removes elements from an array matching a condition)
			participants: {_id: req.payload._id}// remove user
		}
	}, function(err, response) {// (response is the "full resposne from mongo")
			if (err) {
				console.log('@@@@@\n@@@@@\tDB Error:\n@@@@@');
				res.status(400);
				res.json(err);
			}
			else {// if updated
				eventModel// get event again
					.findById(req.params.eventId)
					.exec(function(err2, event) {
									if(err2) {
										console.log('\n\t\tFailed to update nRegistered\n');
										res.status(400)
									}
									else {
										event.fixNRegistered();// fix nRegistered field
										event.save(function(err3, data) {
																	console.log('\n\t\tnRegistered successfully changed');
																	res.status(200);
																	res.json(data);
															}
										)
									} 
							}
				);
			}
	});
};
module.exports.getEvent = function(req, res) {
	eventModel
		.findOne({_id: req.params.eventId}) 
		.exec(function(err, event) {//get event
				if (err) {
					console.log('\n\tEvent Not Round\n');
					res.status(400);
					res.json(err);
				}
				else {//get event containing user info
					eventModel
						.findOne({_id: req.params.eventId, 'participants._id': req.query._id},
										{'participants.$': 1}, {},//project participants array
										function(err, event2) {
											if (event2) {
												console.log('\n\t\tSuccessfully queried DB\n');
												res.status(200);
												res.json({
													participant: event2.participants[0],
													event: event
												});
												return;
											}
											else if (err) {
												console.log(err);
											}
											else if (!event2) {
												console.log('\n\t\tUser have not joined the event DB\n');
											}
											res.status(200);
											res.json({event: event});
										}
						);
				}
			}
		);
};
module.exports.submitEventComment = function(req, res) {
	eventModel
		.findOne({_id: req.params.eventId})
		.exec(
			function(err, event) {
				if (err) {
					console.log('\n\tDB Error\n');
					res.status(400);
					res.json(err);
				}
				console.log(event);
				event.comments.push({
					userId: req.payload._id,
					userName: req.payload.login, 
					comment: req.body.comment
				})
				event.save(
					function(err2, data) {
						if (err2) {
							console.log;
							res.status(400);
							res.json(err2);
						}
						else {
							console.log('\n\tAPI: Successfully updated DB\n');
							res.status(200);
							res.json(data);
						}
					}
				);
			}
		);
};

module.exports.userPage = function(req, res) {
	userModel//find user
		.findOne(
			{_id: req.params.userId}, 
			null,
			{},
			function(err, user) {
				if (err) {
					console.log('\n\tDB Server Error\n');
					res.status(400);
					res.json(err);
				}
				else if (!user) {
					console.log('\n\tFailed to find user\n');
					res.status(404);
					res.json(user);
				}
				else {
					console.log('\n\tFound user!\n');
					eventModel.find(//find events
						{_id: {$in: user.events}},//query criteria
						{time: true, title: true},//projections
						{sort: {time:-1}},//other options
						function(err2, events) {//callback
							if (err2) {
								console.log('\n\tFail to find events\n');
								res.status(400);
								res.json(err);
							}
							else {
								console.log('\n\tFound user events!\n');
								res.status(200);
								res.json({
									user: user,
									events: events
								});
							}
						}
					);
				}
			}
		);
};
module.exports.userUpdate = function(req, res) {
	passport.authenticate('local', function(err, user, info) {
		if (err) {
			console.log('\n\tAuthenticate Error\n');
			res.status(404);
			res.json(err);
		} else if (user) {
			console.log('\n\tAuthentication Successful\n');
			var change = {};
			change[req.body.newField] = req.body.newFieldValue;
			userModel
				.update(
					{email: req.body.email},
					{$set: change},
					function(err, response) {
						if (err) {
							console.log('\n\tUpdate Error\n');
							console.log(err);
							res.status(400);
							res.json({});
						}
						else if (!response.nModified) {
							console.log('\n\tUser info unchanged\n');
							res.status(304);
							res.json({});
						}
						else {
							console.log('\n\tUser info updated\n');
							res.status(200);
							res.json(response);
						}
					}
				);		
		} else {
			console.log('\n\tFailed authetication');
			res.status(401);
			res.json({});
		}
	})(req,res);
}
module.exports.userEvents = function(req, res) {
	
};