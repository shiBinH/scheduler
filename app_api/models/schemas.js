var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var announcementSchema = new Schema({
	title: {type: String, required: true},
	description: {type: String, required: true},
	author: {type: String, default: 'Admin'},
	time: String
}, {
	timestamps: true
});

var eventSchema = new Schema({
	title: {type: String, required: true},
	time: {type: Date, required: true},
	description: String,
	capacity: {
		type: Number,
		required: true
	},
	nRegistered: {
		type: Number,
		default: 0,
		max: 10
	},
	participants: [Schema.Types.ObjectId]
});

mongoose.model('announcements', announcementSchema);
mongoose.model('events', eventSchema);