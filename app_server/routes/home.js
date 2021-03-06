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
router.get('/announcements/new', mainCtrl.announcementForm);
router.post('/announcements/new', auth,mainCtrl.createAnnouncement);
router.get('/announcements/:announcementId/:announcementTitle', mainCtrl.getAnnouncement);
router.post('/announcements/:announcementId/comments/add', mainCtrl.submitAnnounceComment);
router.post('/announcements/more', mainCtrl.announcementsMore);

router.get('/events', mainCtrl.eventsCtrl);
router.get('/events/new', auth, mainCtrl.addEventsCtrl);
router.post('/events/new', mainCtrl.submitEvent);
router.post('/events/:eventId/join', mainCtrl.joinEvent);
router.post('/events/:eventId/cancel', mainCtrl.unjoinEvent);
router.get('/events/:eventId', mainCtrl.getEvent);
router.post('/events/:eventId/comments/add', mainCtrl.submitEventComment);
router.post ('/events/more', mainCtrl.moreEvents);

router.get('/register', mainCtrl.registerForm);
router.post('/register', mainCtrl.registerCtrl);

router.get('/login', mainCtrl.loginForm);
router.post('/login', mainCtrl.loginCtrl);
router.get('/logout',mainCtrl.logoutCtrl);

router.get('/user/:userId', mainCtrl.userPageCtrl);
router.post('/user/:userId/update', mainCtrl.userUpdate);
router.get('/user/:userId/events', mainCtrl.userEvents);

module.exports = router;
