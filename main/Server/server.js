isLocalTime = true;

const http = require("http");
const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const requestHandler = require("./requestHandler");
const mongoConnector = require("./mongodb");

const httpServer = http.createServer(app)
const { Server } = require("socket.io");
const { join } = require("path");
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",
    },
});
const result = dotenv.config(path = ".../...env");
if (result.error) {
    postLog(`Error while loading .env file.`, true);
}
else {
    postLog(`.env file loaded.`);
}
mongoConnector.connect();

app.use(express.static(join(__dirname, "../Client/chatroom")));
app.use(express.static(join(__dirname, "../Client/login")));
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    postLog(`Server started`);
})

const users = {};

requestHandler.initRoutes(app);

io.on("connection", socket => {
    postLog(`Client with id ${socket.id} has connected`);
    socket.emit("message", "Welcome");

    socket.on("sendChatMessage", message => {
        userId = socket.id;
        userName = users[userId];
        postLog(`Broadcasting message to clients: ${message}`);
        socket.broadcast.emit("broadcastChatMessage", {userId: userId, userName: userName, message: message});
    })

    .on("newUser", userName => {
        userId = socket.id;
        users[userId] = userName;
        postLog(`Broadcasting new user connection to clients: "${userName}" with id "${userId}"`);
        socket.broadcast.emit("newUserConnected", {userId: userId, userName: userName});
    })

    .on("disconnect", () => {
        userId = socket.id;
        userName = users[userId];
        postLog(`Broadcasting user disconnection to clients: "${userName}" with id "${userId}`);
        delete users[socket.id];
        socket.broadcast.emit("userDisconnected", {userId: userId, userName: userName});
    });

})

httpServer.listen(3000, () => {
    postLog(`Listening to port 3000`);
})

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