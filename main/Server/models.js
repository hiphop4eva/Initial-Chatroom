const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },

    name : {
        type: String,
        required: true
    },

    password: {
        type: String,
        reqired: true
    },

    createdAt: {
        type: Date,
        default: Date.now()
    },

    hasAvatar: {
        type: Boolean,
        default: false
    },

});

userSchema.index({ userId: 1 }, { unique: true });

const User = mongoose.model("User", userSchema, "userInfo");

User.init({}, { strict: false })
.then(postLog("User model initialized"))
.catch(err => {
    postLog(err, true); 
    throw new Error(err);
});

module.exports = User

function postLog(data, isError = false) {
    const currentTime = new Date();

    let timeString;
    if (isLocalTime) {
        timeString = currentTime.toLocaleString();
    }
    else{
        timeString = currentTime.toString()
    }

    if (isError) {
        console.error(`${timeString}: ${data}`);
    }
    else {
        console.log(`${timeString}: ${data}`);
    }
}