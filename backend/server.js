const mongoose = require("mongoose");
const app = require("./src/app");
const dotenv = require("dotenv");
const setupCollectionOnce = require("./src/db/setupCollectionOnce")

dotenv.config();
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log("Connected to MongoDB");
        
        await setupCollectionOnce(mongoose.connection.db);
        app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1);
    });