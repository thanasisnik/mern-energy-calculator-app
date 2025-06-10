const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Device usage schema for tracking device usage over time
let deviceUsageSchema = new Schema({
    // Reference to the device being used
    deviceId: {
        type: Schema.Types.ObjectId,
        ref: "Device",
        required: [true, "Device ID is required"]
    },
    // when the device started being used
    startTime: {
        type: Date,
        required: [true, "Start time is required"]
    },
    // when the device stopped being used
    endTime: {
        type: Date,
        required: [true, "End time is required"]
    },
    duration: {
        type: Number,
        required: [true, "Duration is required"],
        min: [0, "Duration must be a positive number"]
    },
    source: {
        type: String,
        enum: ["manual", "daily-fixed", "real-time"],
        required: [true, "Source is required"]
    },

})

module.exports = mongoose.model("DeviceUsage", deviceUsageSchema);