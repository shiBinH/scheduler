var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
	userId: Schema.Types.ObjectId,
	userName: String,
	comment: String
}, {timestamps: true});
var announcementSchema = new Schema({
	title: {type: String, required: true},
	summary: {type: String, required: true},
	description: {type: String, required: true},
	author: {type: String, default: 'Admin'},
	time: String,
	comments: [commentSchema]
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
	}],
	comments: [commentSchema]
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