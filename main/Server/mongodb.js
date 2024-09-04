isLocalTime = true;

const mongoose = require("mongoose");
let mongoConnectionString = null;

const mongoConnector = {

    connect: () => {
        postLog(`Attempt to connect to MongoDB`);
        mongoConnectionString = process.env.MONGO_CONNECTION_STRING;
        databseConnectionString = mongoConnectionString + "/database1";

        if (!mongoConnectionString) {
            postLog(`MongoDB connection string not found`, true);
            return;
        }
        mongoose.connect(databseConnectionString);
        mongoose.connection.on("connected", () => {
            postLog(`Connected to MongoDB`);
        })

        mongoose.connection.on("error", (err) => {
            postLog(`Error connecting to MongoDB: ${err}`, true);
        })

        mongoose.connection.on("disconnected", () => {
            postLog(`Disconnected from MongoDB`);
        })
    }
}

module.exports = mongoConnector

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