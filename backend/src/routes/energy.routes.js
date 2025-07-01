const express = require('express');
const router = express.Router();
const energyController = require('../controllers/energy.controller');

router.get('/daily', energyController.getDailyConsumption);
router.get('/daily/:id', energyController.getDailyConsumptionById)
router.get('/monthly', energyController.getMontlyConsumption);
router.get('/monthly/:id', energyController.getMonthlyConsumptionById)
router.get('/year', energyController.getFullYearConsumption);
router.get('/year/:id', energyController.getFullYearConsumptionById)



module.exports = router;