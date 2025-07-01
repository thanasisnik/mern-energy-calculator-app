const energyService = require('../services/energy.report.service');


exports.getDailyConsumption = async (req, res) => {
    try {
        const data = await energyService.getDailyConsumption();
        res.status(200).json({status: true, data: data})
    } catch (err) {
        res.status(500).json({status: false , error: err.message });
    }
}

exports.getMontlyConsumption = async(req, res) => {
    try {
        const data = await energyService.getMontlyConsumption();
        res.status(200).json({status:true , data: data})
    } catch(err) {
        res.status(500).json({status: false, error: err.message})
    }
}

exports.getFullYearConsumption = async(req, res) => {
    try {
        const data = await energyService.getFullYearConsumption();
        res.status(200).json({status: true, data: data})
    } catch (err) {
        res.status(500).json({status: false, error: err.message})
    }
}


exports.getDailyConsumptionById = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ status: false, error: "Device ID is required"});
        }

        const data = await energyService.getDailyConsumptionById(id);
        res.status(200).json({status: true, data: data})
    } catch (err) {
        console.error('Error: ' , err)
        res.status(500).json({status: false, error: err.message})
    }
}

exports.getMonthlyConsumptionById = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ status: false, error: "Device ID is required"});
        }

        const data = await energyService.getMonthlyConsumptionById(id);
        res.status(200).json({status: true, data: data})
    } catch (err) {
        console.error('Error: ' , err)
        res.status(500).json({status: false, error: err.message})
    }
}

exports.getFullYearConsumptionById = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ status: false, error: "Device ID is required"});
        }

        const data = await energyService.getFullYearConsumptionById(id);
        res.status(200).json({status: true, data: data})
    } catch (err) {
        console.error('Error: ' , err)
        res.status(500).json({status: false, error: err.message})
    }
}