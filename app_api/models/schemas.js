var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var announcementSchema = new Schema({
	title: {type: String, required: true},
	summary: {type: String, required: true},
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
	summary: String,
	location: String,
	capacity: {
		type: Number,
		default: 999999999
	},
	nRegistered: {
		type: Number,
		default: 0,
		min: 0
	},
	participants: [{
		name: String,
		role: String
	}]
});

eventSchema.methods.add = function(participant) {
	this.participants.push(participant);
	this.fixNRegistered();
};
eventSchema.methods.fixNRegistered = function() {
	this.nRegistered = this.participants.length;
};

mongoose.model('announcements', announcementSchema);
mongoose.model('events', eventSchema);