var router = require('express').Router();
var user = require('../services/user.srv.js');
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();

router.get("/", user.getUsers);
router.post("/update", jsonParser, user.updateUser);
router.post("/add", jsonParser, user.addUser);
router.post("/delete", jsonParser, user.deleteUser);
router.post("/getIdAbonent", jsonParser, user.gerIdAbonent);

module.exports = router;