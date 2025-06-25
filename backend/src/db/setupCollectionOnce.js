async function setupCollectionOnce(db) {
    const collections = await db.listCollections().toArray();
    const exists = collections.some(col => col.name === "energy_usage");

    if (!exists) {

        await db.createCollection("energy_usage", {
            timeseries: {
                timeField: "startTime",
                metaField: "deviceId",
                granularity: "minutes"
            },
            // expiredAfterSeconds: 60*60*24*365  - one year - but doesnt allowed in Atlas atleast free :)
        });
        console.log("created")
    } else {
        console.log("already exists")
    }
}

module.exports = setupCollectionOnce;