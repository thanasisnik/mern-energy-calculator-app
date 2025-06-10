const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Device schema for storing device information
let deviceSchema = new Schema({
    // ex. type: "light", "fan", "heater", etc.
    type: {
        type: String,
        required: [true, "Device type is required"]
    },
    // ex. name: "Living Room Light", "Bedroom Fan", etc.
    name: {
        type: String,
        required: [true, "Device name is required"],
    },
    // defines how the device operates - the logic of system
    mode: {
        type: String,
        enum: ["always-on", "daily-fixed", "manual", "real-time"], // secure the value
        required: [true, "Device mode is required"],
    },
    // Consumption per hour in kilowatts (kW)
    consumptionPerHour: {
        type: Number,
        required: [true, "Consumption per hour is required"],
        min: [0, "Consumption per hour must be a positive number"],
    },
    // Daily hours of operation, used for daily-fixed mode
    dailyHours: {
        type: Number,
        required: false, // Not required for all modes, only for daily-fixed
        min: [0, "Daily hours must be a positive number"],
        default: 0,
    },
    // If the device is currently active or not 
    isActive: {
        type: Boolean,
        default: false,
    },
    location : {
        type: String,
        enum : ["living-room", "bedroom", "kitchen", "bathroom", "other"],
    }


});

module.exports = mongoose.model("Device", deviceSchema);