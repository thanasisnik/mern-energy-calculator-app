const express = require('express');
const router = express.Router();
const energyController = require('../controllers/energy.controller');

router.get('/', energyController.getDailyConsumption);

module.exports = router;