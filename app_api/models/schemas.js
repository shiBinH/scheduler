var mongoose = require('mongoose');

var announcementSchema = new mongoose.Schema({
	title: {type: String, required: true},
	description: {type: String, required: true},
	author: {type: String, default: 'Admin'},
	time: String
}, {
	timestamps: true
});

var eventSchema = new mongoose.Schema({
	title: {type: String, required: true},
	time: {type: Date, required: true},
	description: String,
	nRegistered: {
		type: Number,
		default: 0,
	},
	open: {type: Boolean, default: true}
});

mongoose.model('announcements', announcementSchema);
mongoose.model('events', eventSchema);