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

router.get('/events', mainCtrl.eventsList);
router.post('/events/new', mainCtrl.addEvent);
router.put('/events/join', mainCtrl.joinEvent);
router.put('/events/cancel', mainCtrl.unjoinEvent);
router.get('/events/:eventId', mainCtrl.getEvent);

router.post('/register', authCtrl.register);
router.post('/login', authCtrl.login);

module.exports = router;