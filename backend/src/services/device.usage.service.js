const Device = require('../models/device.model');
const DeviceUsage = require('../models/device.usage.model');

// Create a new device usage record 
async function createDeviceUsage(device) {
    const now = new Date();

    // for 'always-on' mode, we assume the device is always active
    if (device.mode === 'always-on') {
        return new DeviceUsage({
            deviceId: device._id,
            startTime: device.alwaysOnActivatedAt,
            endTime: now,
            duration: (now - device.alwaysOnActivatedAt) / 1000,
            source: 'always-on'
        });
    }
    

}

