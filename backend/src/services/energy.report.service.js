const mongoose = require('mongoose')

const energyUsage = mongoose.connection.collection("energy_usage");

async function getDailyConsumption() {
    // Get the start of the day
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // until the time we want to see our daily consumption
    const end = new Date();

    const data = await energyUsage.aggregate([
        {
            $match: {
                startTime: { $gte: today, $lt: end}
            }
        },
        {
            $group: {
                _id: "$deviceId",
                totalConsumption: { $sum: "$consumption"}
            }
        }
    ]).toArray();
    
    return data;
    
}

module.exports = { getDailyConsumption };