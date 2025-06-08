const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let userSchema = new Schema({
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"],
    },
    fullName: {
        type: String,
        required: false,
    },
    phone: {
        type: String,
        required: false,
        trim: true,
    },
    address: {
        type: String,
        required: false,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "admin",
    }, },
    {
        collection: "users",
        timestamps: true,
    });

    module.exports = mongoose.model("User", userSchema);