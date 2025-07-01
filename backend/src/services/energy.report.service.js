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

async function getMontlyConsumption(){
    const today = new Date();
    const prevMonth = new Date()
    prevMonth.setMonth(prevMonth.getMonth() - 1)

    const data = await energyUsage.aggregate([
        {
            $match: {
                startTime: { $gte: prevMonth, $lt: today}
            }
        },
        {
            $group: {
                _id: "$deviceId",
                totalConsumption: {$sum: "$consumption"}
            }
        }
    ]).toArray();

    return data;
}

async function getFullYearConsumption() {
    const today = new Date();
    const curYear = new Date().getFullYear();
    year = new Date(curYear, 0, 1);

    const data = await energyUsage.aggregate([
        {
            $match: {
                startTime: { $gte: year, $lt: today}
            }
        },
        {
            $group: {
                _id : "$deviceId",
                totalConsumption: {$sum: "$consumption"}
            }
        }
    ]).toArray();

    return data;
}

async function getDailyConsumptionById(id){
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const end = new Date();

    const data = await energyUsage.aggregate([
        {
            $match: {
                deviceId: id, // filtering by id
                startTime: { $gte: today, $lt: end}
            }
        },
        {
            $group: {
                _id: null,
                totalConsumption: { $sum: "$consumption"}
            }
        }
    ]).toArray();

    return data.length > 0 ? data[0] : { _id: null, totalConsumption: 0 };

}

async function getMonthlyConsumptionById(id) {
    const today = new Date();
    const prevMonth = new Date();
    prevMonth.setMonth(prevMonth.getMonth() - 1)

    const data = await energyUsage.aggregate([
        {
            $match: {
                deviceId: id, // filtering by id
                startTime: {$gte: prevMonth, $lt: today}
            }
        },
        {
            $group: {
                _id: "$deviceId",
                totalConsumption: { $sum: "$consumption"}
            }
        }
    ]).toArray();

    return data.length > 0? data[0] : {_id: null, totalConsumption: 0};
}

async function getFullYearConsumptionById(id) {
    const today = new Date();
    const curYear = new Date().getFullYear();
    year = new Date(curYear, 0, 1);

    const data = await energyUsage.aggregate([
        {
            $match: {
                deviceId: id, // filtering by id
                startTime: {$gte: year, $lt: today}
            }
        },
        {
            $group: {
                _id: "$deviceId",
                totalConsumption: { $sum: "$consumption"}
            }
        }
    ]).toArray();

    return data.length > 0 ? data[0] : {_id: null, totalConsumption: 0};
}

module.exports = { 
    getDailyConsumption,
    getDailyConsumptionById,
    getMontlyConsumption,
    getMonthlyConsumptionById, 
    getFullYearConsumption,
    getFullYearConsumptionById
};