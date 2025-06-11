const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/device.controller');

router.post('/', deviceController.createDevice);
router.get('/', deviceController.getAllDevices);
router.get('/:id', deviceController.getDeviceById);
router.put('/:id', deviceController.updateDeviceById);
router.delete('/:id', deviceController.deleteDeviceById);


module.exports = router;