var mongoose = require('mongoose');
var announcementsModel = mongoose.model('announcements');
var eventModel = mongoose.model('events');

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

module.exports.announceList = function(req, res) {
	announcementsModel
		.find()
		.exec(function(err, data) {
			if (err) console.log(err);
			else {
				var announcement = data;
				res.status(201);
				res.json(announcement);
			}
		});
};
module.exports.getAnnounce = function(req, res) {
	
};
module.exports.addAnnounce = function (req, res) {
	var newAnnouncement = new announcementsModel({
		title: req.body.announcement,
		description: req.body.details,
		author: req.body.author
	});
	newAnnouncement.save(function(err, data) {
		if (err) console.log(err);
		else {
			res.status(201);
			res.json(data);
		}
	});
};

module.exports.eventsList = function(req, res) {
	eventModel
		.find()
		.exec(function(err, events){
			if (err) {
				console.log('DB Error: ' + err);
				res.status(400);
				res.json(err);
			}
			else {
				for (var i=0; i<events.length; i++) {
					
				}
				res.status(200);
				res.json(events);
			}
	});
};
module.exports.addEvent = function(req, res) {
	var newEvent = new eventModel({
		title: req.body.title,
		description: req.body.description,
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
	eventModel
		.findById(req.query.eventId)
		.exec(function(err, event) {
			if (err) {
				console.log('@@@@@\n@@@@@ API: Failed to query database\n@@@@@');
				res.status(400);
				res.json(err);
			}
			if (event.nRegistered===event.capacity) {
				console.log('@@@@@\n@@@@@ API: Event Full\n@@@@@')
				res.status(304);
				res.json({
					full: true
				});
			}
			else {
				event.participants.push(req.query.userId);
				event.nRegistered++;
				event.save(function(err, data) {
					if (err) {
						console.log('@@@@@\n@@@@@	From API: failed to save changes to DB\n@@@@@');
						res.status(400);
						res.json(data);
					}
					else {
						console.log('@@@@@\n@@@@@ From API: successfully updated DB\n@@@@@');
						console.log(data);
						res.status(200);
						res.json(data);
					}
				});
			}
		});
};
module.exports.unjoinEvent = function(req, res) {
	eventModel.update({_id: req.query.eventId}, {
		$pull: {//$pull removes elements from an array matching a condition
			participants: req.query.userId
		},
		$inc: {
			nRegistered: -1
		}
	}, function(err, response) {//response is the "full resposne from mongo"
		if (err) {
			console.log('@@@@@\n@@@@@\tDB Error:\n@@@@@');
			res.status(400);
			res.json(err);
		}
		else {
			console.log('@@@@@\n@@@@@\tSuccessfully updated\n@@@@@')
			res.status(200);
			res.json(response);
		}
	});
};