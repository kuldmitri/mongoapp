var router = require('express').Router();
var user = require('../models/userModel.js');
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();

router.get("/", user.get);
router.post("/update", jsonParser, user.update);
router.post("/add", jsonParser, user.add);
router.post("/delete", jsonParser, user.delete);

module.exports = router;