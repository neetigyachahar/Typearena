const raceOrganiser = require('../backendService/raceOrganiser');
const raceCon = require('../controllers/race.js');

const express = require('express');
const router = express.Router();

router.get('/', raceOrganiser.selectRoom, raceCon.race);

module.exports = router;
