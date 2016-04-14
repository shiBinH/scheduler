var express = require('express');
var router = express.Router();
var mainCtrl = require('../controllers/main');
var authCtrl = require('../controllers/authentication');
var jwt = require('express-jwt');

var auth = jwt({
  secret: process.env.JWT_SECRET,
  userProperty: 'payload'
});

var setAuthHeader = function(req, res, next) {
	req.headers.authorization = req.headers.token;
	next();
};

router.use(setAuthHeader);
router.get('/announcements', mainCtrl.announceList);
router.get('/announcements/:id', mainCtrl.getAnnounce);
router.post('/announcements/new', auth, mainCtrl.addAnnounce);
router.put('/announcements/:announcementId/comments/add', auth, mainCtrl.submitAnnounceComment);

router.get('/events', mainCtrl.eventsList);
router.post('/events/new', auth, mainCtrl.addEvent);
router.put('/events/:eventId/join', auth, mainCtrl.joinEvent);
router.put('/events/:eventId/cancel', auth, mainCtrl.unjoinEvent);
router.get('/events/:eventId', mainCtrl.getEvent);
router.put('/events/:eventId/comments/add', auth, mainCtrl.submitEventComment);

router.post('/register', authCtrl.register);
router.post('/login', authCtrl.login);

router.get('/user/:userId', auth, mainCtrl.userPage);
router.get('/user/events', mainCtrl.userEvents);

module.exports = router;