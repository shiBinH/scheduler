var express = require('express');
var router = express.Router();
var mainCtrl = require('../controllers/main');
var authCtrl = require('../controllers/authentication');
var jwt = require('express-jwt');

var auth = jwt({
  secret: process.env.JWT_SECRET,
  userProperty: 'payload'
});

router.get('/announcements', mainCtrl.announceList);
router.get('/announcements/:id', mainCtrl.getAnnounce);
router.post('/announcements/new', mainCtrl.addAnnounce);

router.post('/events/new', mainCtrl.addEvent);

router.post('/register', authCtrl.register);
router.post('/login', authCtrl.login);

module.exports = router;