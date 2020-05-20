const express = require('express');
const router = express.Router();
const lgModule = require('./controllers/login.controller');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { errorMsg: '' });
});
router.get('/login', function(req, res, next) {
    res.render('index', { errorMsg: '' });
});
router.get('/webcam', function(req, res, next) {
    res.render('webcam', { title: 'webcam' });
});

router.get('/home', function(req, res, next) {
    res.render('main', { title: 'Express' });
});

router.use('/app', lgModule.demologin);

router.get('/conference', function(req, res, next) {
    res.render('conference', { title: 'Express' });
});
router.get('/authenticate', function(req, res, next) {
    res.render('preloading', { title: 'Express' });
});
router.get('/doctor', function(req, res, next) {
    res.render('doctorconference', { title: 'Express' });
});
/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

module.exports = router;