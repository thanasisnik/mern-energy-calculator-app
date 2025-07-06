const Device = require('../models/device.model');
const { nanoid } = require("nanoid");
const {recordEnergyUsage} = require("../services/energy.usage.service")
const logger = require('../logger/logger')

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
    if (!data.powerWatts) {
        return res.status(400).json({status: false, message: "Consumption per hour is required"});
    }
    if (data.mode === 'daily-fixed' && !data.dailyFixedSchedule) {
        return res.status(400).json({status: false, message: "Daily schedule is required for daily-fixed mode"});
    }
    if (data.mode === 'daily-fixed' && (!data.dailyFixedSchedule.startTime || !data.dailyFixedSchedule.endTime)) {
        return res.status(400).json({status: false, message: "Start and end time are required for daily-fixed mode"});
    }

    // If device mode is 'always-on', then set alwaysOnActivatedAt to current time
    if (data.mode === 'always-on') {
        data.alwaysOnActivatedAt = new Date();
        data.isActive = true; 
    }

    // Create a new device instance
    const device = new Device({
        deviceId: data.deviceId || nanoid(), // if not given, then a gets a random uuid
        type: data.type,
        name: data.name,
        mode: data.mode,
        powerWatts: data.powerWatts, 
        alwaysOnActivatedAt: data.alwaysOnActivatedAt,
        dailyFixedSchedule: data.dailyFixedSchedule ,
        isActive: data.isActive ?? false , // Default to false if not provided. Nullish operator checks for null or undefined.
        location: data.location || 'other', // Default to 'other' if not provided
        user: req.user._id
    });

    // Save the device to the database
    try {
        const result = await device.save();
        logger.info("Device created succesfully")
        res.status(201).json({status: true, message: "Device created successfully", device: result});
    } catch (error) {
        logger.error("Device not created.")
        res.status(400).json({status: false, message: "Error creating device", error: error.message});
    }
}


// Get all devices
exports.getAllDevices = async (req, res) => {
    try {
        const devices = await Device.find({ user: req.user._id });
        logger.info("Return all devices succesfully");
        res.status(200).json({status: true, devices: devices});
    } catch (error) {
        logger.error("Error fetching devices")
        res.status(500).json({status: false, error: error.message});
    }
}

// Get a device by ID
exports.getDeviceById = async (req, res) => {
    const id = req.params.id;

    try {
        const device = await Device.findById(id);

        if (!device) {
            logger.warn("Device not found")
            return res.status(404).json({status: false, message: "Device not found"});
        }

        if (device.user.toString() !== req.user._id){
            logger.warn("Unauthorized access ")
            return res.status(403).json({status: false, message: "Unauthorized access"})
        }

        res.status(200).json({status: true, device: device});
    } catch (error) {
        logger.error("Error to fetch device", error)
        res.status(500).json({status: false, message: "Error fetching device", error: error.message});
    }
}

// Update a device by ID
exports.updateDeviceById = async (req, res) => {
    const id = req.params.id;
    const data = req.body;

    // if device is updated to daily-fixed , secure that user gives dailyFixedSchedule
    if (data.mode === 'daily-fixed' && !data.dailyFixedSchedule) {
        return res.status(400).json({status: false, message: "Daily schedule is required for daily-fixed mode"});
    }

    if (data.mode === 'daily-fixed' && (!data.dailyFixedSchedule.startTime || !data.dailyFixedSchedule.endTime)) {
        return res.status(400).json({status: false, message: "Start and end time are required for daily-fixed mode"});
    }   

    // if device updated to always on , then set alwaysOnActivatedAt to current time
    if (data.mode === 'always-on') {
        data.alwaysOnActivatedAt = new Date();
        data.isActive = true;
    }

    try {
        const device = await Device.findById(id);
        if (!device) {
            return res.status(404).json({status: false, message: "Device not found"});
        }

        if (device.user.toString() !== req.user._id){
            logger.warn("Unauthorized access ")
            return res.status(403).json({status: false, message: "Unauthorized access"})
        }

        const updatedDevice = await Device.findByIdAndUpdate(id, data, {new: true});

        res.status(200).json({status: true, device: updatedDevice});
    } catch (error) {
        res.status(500).json({status: false, message: "Error updating device", error: error.message});
    }
}

// Delete a device by ID
exports.deleteDeviceById = async (req, res) => {
    const id = req.params.id;
    try {
        const device = await Device.findById(id);
        if (!device) {
            return res.status(404).json({status: false, message: "Device not found"});
        }

        if (device.user.toString() !== req.user._id){
            logger.warn("Unauthorized access ")
            return res.status(403).json({status: false, message: "Unauthorized access"})
        }
        const deletedDevice = await Device.findByIdAndDelete(id);
        res.status(200).json({status: true, message: "Device deleted", device: deletedDevice});
    } catch (error) {
        res.status(500).json({status: false, message: "Error deleting device", error: error.message});
    }
}

// Delete all devices
exports.deleteAllDevices = async (req, res) => {
    try {
        await Device.deleteMany({user: req.user._id});
        res.status(200).json({status: true, message: "All devices deleted successfully"});
    } catch (error) {
        res.status(500).json({status: false, message: "Error deleting devices", error: error.message});
    }
}

exports.toggleManualDevice = async(req, res) => {
    const id = req.params.id;

    try {
        const device = await Device.findById(id);
        if (!device) {
            return res.status(404).json({status: false, message: "Device not found"})
        }

        // check if device has manual mode
        if (device.mode !== 'manual') {
            return res.status(400).json({status:false, message: "Only manual device can be toggled"})
        }

        if (device.user.toString() !== req.user._id){
            logger.warn("Unauthorized access ")
            return res.status(403).json({status: false, message: "Unauthorized access"})
        }

        if (device.isActive) {
            const startTime = device.manualActivatedAt;
            const endTime = new Date();

            if (!startTime){
                return res.status(400).json({status:false, message: "No start time found"})
            }

            await recordEnergyUsage({
                deviceId: device.deviceId,
                startTime,
                endTime,
                powerWatts: device.powerWatts,
                user: device.user,
            })

            device.manualActivatedAt = null;
            device.isActive = false;
            await device.save();
            res.status(200).json({status: true, message: "Device turned OFF and usage recorded!"})
        } else {
            device.manualActivatedAt = new Date();
            device.isActive = true;
            await device.save();
            res.status(200).json({status: true, message: `Device turned ${device.isActive? "ON" : "OFF"}`})
        }
        
        

    } catch (err) {
        res.status(500).json({status: false, message: "Error toggling device", error: err.message })
    }
}
