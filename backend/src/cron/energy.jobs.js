const cron = require('node-cron')
const { recordAlwaysOnUsage, recordDailyFixedUsage } = require('../services/energy.usage.service')

// */5 -> Every 5 minutes
// We can have up to 6 stars
// from left to right (seconds(optional), minutes, hours, day of month, month, day of week)
cron.schedule('*/5 * * * *',async () => {
    console.log("Schedule run")

    try {
        await recordAlwaysOnUsage();
        console.log("Always-on usage recorded!")
    } catch (err) {
        console.error("Error to record usage!", err.message);
    }
})

cron.schedule('0 * * * *',async () => {
    console.log("Schedule run")

    try {
        await recordDailyFixedUsage();
        console.log("Daily-fixed usage recorded!")
    } catch (err) {
        console.error("Error to record usage!", err.message);
    }
})

cron.shecule('0 * * * *', async () => {
    console.log("Cron jobs health check ok!")
})