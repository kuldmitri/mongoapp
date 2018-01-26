const router = require('express').Router();
const {userService} = require('../services');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

router.get('/all', jsonParser, (req, res, next) => {
  userService.findAll((err, users) => {
    if (err) return next(err);
    res.send(users);
  });
});

router.post('/add', jsonParser, (req, res, next) => {
  userService.addUser(req.body, (err, user) => {
    if (err) return next(err);
    res.send({user});
  });
});

router.post('/delete', jsonParser, (req, res, next) => {
  userService.deleteUser(req.body, (err, user) => {
    if (err) return next(err);
    res.send({user});
  });
});

router.post('/find', jsonParser, (req, res, next) => {
  userService.findUser(req.body, (err, users) => {
    if (err) return next(err);
    res.send(users);
  });
});

module.exports = router;
