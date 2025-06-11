const Device = require('../models/device.model');
const DeviceUsage = require('../models/device.usage.model');

// Create a new device
exports.createDevice = async (req, res) => {
    
    let data = req.body;

    // Validate required fields
    if (!data.type ) {
        return res.status(400).json({status: false, message: "Device type is required"});
    }
    if (!data.name) {
        return res.status(400).json({status: false, message: "Device name is required"});
    }
    if (!data.mode) {
        return res.status(400).json({status: false, message: "Device mode is required"});
    }
    if (!data.consumptionPerHour) {
        return res.status(400).json({status: false, message: "Consumption per hour is required"});
    }
    if (data.mode === 'daily-fixed' && !data.dailyHours) {
        return res.status(400).json({status: false, message: "Daily hours are required for daily-fixed mode"});
    }
    if (data.mode === 'daily-fixed' && data.dailyHours < 0) {
        return res.status(400).json({status: false, message: "Daily hours must be a positive number"});
    }

    // Create a new device instance
    const device = new Device({
        type: data.type,
        name: data.name,
        mode: data.mode,
        consumptionPerHour: data.consumptionPerHour,
        dailyHours: data.dailyHours || 0, // Default to 0 if not provided
        isActive: data.isActive || false, // Default to false if not provided
        location: data.location || 'other' // Default to 'other' if not provided
    });

    // Save the device to the database
    try {
        const result = await device.save();
        res.status(201).json({status: true, message: "Device created successfully", device: result});
    } catch (error) {
        res.status(400).json({status: false, message: "Error creating device", error: error.message});
    }
}


// Get all devices
exports.getAllDevices = async (req, res) => {
    try {
        const devices = await Device.find();
        res.status(200).json({status: true, devices: devices});
    } catch (error) {
        res.status(500).json({status: false, message: "Error fetching devices", error: error.message});
    }
}

// Get a device by ID
exports.getDeviceById = async (req, res) => {
    const deviceId = req.params.id;

    try {
        const device = await Device.findById(deviceId);
        if (!device) {
            return res.status(404).json({status: false, message: "Device not found"});
        }
        res.status(200).json({status: true, device: device});
    } catch (error) {
        res.status(500).json({status: false, message: "Error fetching device", error: error.message});
    }
}

// Update a device by ID
exports.updateDeviceById = async (req, res) => {
    const deviceId = req.params.id;
    const data = req.body;
    try {
        const device = await Device.findByIdAndUpdate(deviceId, data, { new: true });
        if (!device) {
            return res.status(404).json({status: false, message: "Device not found"});
        }
        res.status(200).json({status: true, device: device});
    } catch (error) {
        res.status(500).json({status: false, message: "Error updating device", error: error.message});
    }
}

// Delete a device by ID
exports.deleteDeviceById = async (req, res) => {
    const deviceId = req.params.id;
    try {
        const device = await Device.findByIdAndDelete(deviceId);
        if (!device) {
            return res.status(404).json({status: false, message: "Device not found"});
        }
        res.status(200).json({status: true, message: "Device deleted successfully"});
    } catch (error) {
        res.status(500).json({status: false, message: "Error deleting device", error: error.message});
    }
}