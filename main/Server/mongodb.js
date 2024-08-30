isLocalTime = true;

const mongoose = require("mongoose");
let mongoConnectionString = null;

const mongoConnector = {

    connect: () => {
        console.log(`${returnCurrentTime()}: Attempting connection with MongoDB`);
        mongoConnectionString = process.env.MONGO_CONNECTION_STRING;

        if (!mongoConnectionString) {
            console.log(`${returnCurrentTime()}: MongoDB connection string not found`);
            return;
        }
        mongoose.connect(mongoConnectionString);
        mongoose.connection.on("connected", () => {
            console.log(`${returnCurrentTime()}: Connected to MongoDB`);
        })

        mongoose.connection.on("error", (err) => {
            console.log(`${returnCurrentTime()}: Error connecting to MongoDB: ${err}`);
        })

        mongoose.connection.on("disconnected", () => {
            console.log(`${returnCurrentTime()}: Disconnected from MongoDB`);
        })
    }
}

module.exports = mongoConnector

function returnCurrentTime() {
    const currentTime = new Date();

    if (isLocalTime) {
        return currentTime.toLocaleString();
    }
    else{
        return currentTime.toString();
    }
    return currentTime.toString();
}