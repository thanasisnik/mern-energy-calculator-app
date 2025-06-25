const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Device schema for storing device information
let deviceSchema = new Schema({
    deviceId: {
        type: String,
        required: true,
        unique: true
    },
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
    powerWatts: {
        type: Number,
        required: [true, "is required"],
        min: [1, "Must be a positive number"],
    },

    // If the device is currently active or not 
    isActive: {
        type: Boolean,
        default: false,
    },
    
    location : {
        type: String,
        enum : ["living-room", "bedroom", "kitchen", "bathroom", "other"],
    },

    // for always-on mode
    alwaysOnActivatedAt: {
        type: Date,
    },

    // for daily-fixed mode
    dailyFixedSchedule: {
        startTime: String,
        endTime: String,  
    },

    // for manual mode
    manualActivatedAt: {
        type: Date
    }
    },
    {timestamps: true

});

module.exports = mongoose.model("Device", deviceSchema);