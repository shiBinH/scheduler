var mongoose = require('mongoose');
var gracefulShutdown;
var readLine = require('readline');
var dbURI = 'mongodb://localhost/scheduler';
if (process.env.NODE_ENV === 'production') {
	dbURI = process.env.MONGODB_URI;
}
mongoose.connect(dbURI);

if (process.platform ==="win32") {
	var rl= readLine.createInterface ({
		input: process.stdin,
		output: process.stdout
	});
	rl.on ("SIGINT", function () {
		process.emit ("SIGINT");
	});
};

gracefulShutdown = function(msg, callback) {
	mongoose.connection.close(function() {
		console.log('Mongoose disconnected through ' + msg);
		callback();
	});
};

mongoose.connection.once('open', function() {
	console.log('Database connection opened');
});
mongoose.connection.on('connected', function() {
	console.log('Mongoose connected to ' + dbURI);
});
mongoose.connection.on('disconnected', function() {
	console.log('Mongoose disconnected from ' + dbURI);
});
mongoose.connection.on('error', function(err) {
	console.log('Mongoose connection error: ' + err);
});

process.once('SIGUSR2', function() {
	gracefulShutDown('nodemon restart', function() {
		process.kill(process.pid, 'SIGUSR2');
	});
});

process.on('SIGINT', function() {
	gracefulShutdown('app termination', function() {
		process.exit(0);
	});
});

require('./schemas');
require('./users');