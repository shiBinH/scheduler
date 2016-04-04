module.exports.announceCtrl = function (req, res) {
	res.render('announcements', {
		announcements: [{
			title: 'Reminder',
			description: 'Attention!! Please fill in the fields when registering. Thank you!',
			author: 'Admin',
			time: 'March 24th, 2016'
		}, {
			title: 'Announcement 3',
			description: 'Listen up all!!! This is the third announcement since god created this website. Please check the announcements tab for past announcements and the games tab for upcoming/past games.',
			author: 'Admin',
			time: 'March 24th, 2016'
		}, {
			title: 'Announcement 2',
			description: 'Listen up all!!! This is the second announcement since god created this website. Please check the announcements tab for past announcements and the games tab for upcoming/past games.',
			author: 'Admin',
			time: 'March 23rd, 2016',
		}, {
			title: 'Welcome!',
			description: 'God created this website on the 3rd day.',
			author: 'Admin',
			time: 'March 22nd, 2016'
		}]
	});
};