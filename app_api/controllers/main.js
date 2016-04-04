var mongoose = require('mongoose');
var announcementsModel = mongoose.model('announcements');

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
				var months = ['Jan', 'Feb', 'Mar', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
				res.status(201);
				for (var i=0; i<announcement.length; i++) {
					announcement[i].time = formatDate(announcement[i].createdAt);
				}
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
