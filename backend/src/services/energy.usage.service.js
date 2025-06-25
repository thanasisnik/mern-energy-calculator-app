
const mongoose = require("mongoose");

async function recordEnergyUsage({deviceId, startTime, endTime, powerWatts}){
    const duration = (endTime - startTime ) / 1000 / 60 / 60;  // from ms to hour
    const consumption = duration * powerWatts;

    await mongoose.connection.db.collection("energy_usage").insertOne({
        deviceId,
        startTime,
        endTime,
        duration,
        powerWatts,
        consumption
    })
} 

module.exports = {recordEnergyUsage}
