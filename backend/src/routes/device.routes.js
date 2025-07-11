const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/device.controller');
const verifyToken = require('../middlewares/auth.middleware')

router.post('/',verifyToken, deviceController.createDevice);
router.get('/',verifyToken, deviceController.getAllDevices);
router.get('/:id',verifyToken, deviceController.getDeviceById);
router.put('/:id',verifyToken, deviceController.updateDeviceById);
router.delete('/:id',verifyToken, deviceController.deleteDeviceById);
router.patch('/:id/toggle',verifyToken, deviceController.toggleManualDevice);
router.delete('/', verifyToken, deviceController.deleteAllDevices);


module.exports = router;