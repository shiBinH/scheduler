var express = require('express');
var router = express.Router();
var mainCtrl = require('../controllers/main.js');
var jwt = require('express-jwt');

var auth = jwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'payload'
})

/* GET home page. */
router.get('/', mainCtrl.homeCtrl);
router.get('/announcements', mainCtrl.announceCtrl);
router.get('/events', mainCtrl.eventsCtrl);
router.get('/register', mainCtrl.registerForm);
router.post('/register', mainCtrl.registerCtrl);
router.get('/login', mainCtrl.loginForm);
router.post('/login', mainCtrl.loginCtrl);
router.get('/newAnnouncement', function(req, res, next){
	req.headers['authorization'] = 'Bearer ' +  req.session.schedulerToken;
	next();
}, auth, mainCtrl.announcementForm);
router.post('/newAnnouncement', mainCtrl.createAnnouncement);

module.exports = router;
