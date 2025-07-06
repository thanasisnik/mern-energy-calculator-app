
const mongoose = require("mongoose");
const Device = require('../models/device.model')

async function recordEnergyUsage({deviceId, startTime, endTime, powerWatts, user}){
    const duration = (endTime - startTime ) / 1000 / 60 / 60;  // from ms to hour
    const consumption = duration * powerWatts;

    // this looks ugly but i need it to access my time-series collection
    await mongoose.connection.db.collection("energy_usage").insertOne({
        deviceId,
        startTime,
        endTime,
        duration,
        powerWatts,
        consumption,
        user
    })
}

async function recordAlwaysOnUsage() {
    const now = new Date();
    const devices = await Device.find({
        mode: 'always-on',
        isActive: true,
        $or: [
            { lastRecordedAt: { $exists: false }}, 
            { lastRecordedAt: { $lt: new Date(now.getTime() - 4 * 60 * 1000)}} 
        ]
        
    });

    for (const device of devices) {
        const startTime = device.lastRecordedAt || device.alwaysOnActivatedAt;
        const endTime = now;

        await recordEnergyUsage({
            deviceId: device.deviceId,
            startTime,
            endTime,
            powerWatts: device.powerWatts,
            user: device.user,
        })

        device.lastRecordedAt = now;
        await device.save();
    }
}

async function recordDailyFixedUsage() {
    const now = new Date();
    const today = now.toDateString();

    const devices = await Device.find({
        mode: 'daily-fixed' ,
        // check if not recorded today
        $or: [
            { lastDailyRecordDate: {$exists: false}},
            { lastDailyRecordDate: { $ne: today}}
        ]
    });

    for (const device of devices) {
        const { startTime, endTime} = device.dailyFixedSchedule; // destructuring

        const start = new Date(today + ' ' + startTime);
        const end = new Date(today + ' ' + endTime);
    
        if (now >= end) {    
            await recordEnergyUsage({
            deviceId: device.deviceId,
            startTime: start,
            endTime: end,
            powerWatts: device.powerWatts,
            user: device.user,
            });

            device.lastDailyRecordDate = today;
            await device.save();
        }
    }
}

module.exports = {recordEnergyUsage, recordAlwaysOnUsage, recordDailyFixedUsage}
