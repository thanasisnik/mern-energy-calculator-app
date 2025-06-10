const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/device.controller');

router.post('/create', deviceController.createDevice);
router.get('/all', deviceController.getAllDevices);


module.exports = router;