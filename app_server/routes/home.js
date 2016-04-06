var express = require('express');
var router = express.Router();
var mainCtrl = require('../controllers/main.js');
var jwt = require('express-jwt');

var auth = jwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'payload'
})

router.use(mainCtrl.loginCheck);

router.get('/', mainCtrl.homeCtrl);

router.get('/announcements', mainCtrl.announceCtrl);
router.get('/announcements/new', auth, mainCtrl.announcementForm);
router.post('/announcements/new', mainCtrl.createAnnouncement);

router.get('/events', mainCtrl.eventsCtrl);
router.get('/events/new', auth, mainCtrl.addEventsCtrl);
router.post('/events/new', mainCtrl.submitEvent);
router.post('/events/:eventId/join', mainCtrl.joinEvent);
router.post('/events/:eventId/cancel', mainCtrl.unjoinEvent);

router.get('/register', mainCtrl.registerForm);
router.post('/register', mainCtrl.registerCtrl);

router.get('/login', mainCtrl.loginForm);
router.post('/login', mainCtrl.loginCtrl);
router.get('/logout',mainCtrl.logoutCtrl);


module.exports = router;
