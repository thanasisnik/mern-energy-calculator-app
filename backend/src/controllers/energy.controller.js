const energyService = require('../services/energy.report.service');


exports.getDailyConsumption = async (req, res) => {
    try {
        const data = await energyService.getDailyConsumption();
        res.status(200).json({status: true, data: data})
    } catch (err) {
        res.status(500).json({status: false, error: err.message });
    }
}