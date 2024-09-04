const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true
    },

    password: {
        type: String,
        reqired: true
    },
});

const User = mongoose.model("User", userSchema, "userInfo");

module.exports = User