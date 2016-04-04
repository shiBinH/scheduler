var mongoose = require('mongoose');

var announcementSchema = new mongoose.Schema({
	title: {type: String, required: true},
	description: {type: String, required: true},
	author: {type: String, default: 'Admin'},
	time: String
}, {
	timestamps: true
});

mongoose.model('announcements', announcementSchema);