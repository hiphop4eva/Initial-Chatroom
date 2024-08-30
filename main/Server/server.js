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
    console.error(`${returnCurrentTime()}: Error while loading .env file.`);
}
else {
    console.log(`${returnCurrentTime()}: .env file loaded.`);
}
mongoConnector.connect();

app.use(express.static(join(__dirname, "../Client/chatroom")));
app.use(express.static(join(__dirname, "../Client/login")));
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    console.log(`${returnCurrentTime()}: Server started`);
})

const users = {};

requestHandler.initRoutes(app);

io.on("connection", socket => {
    console.log(`${returnCurrentTime()}: Client with id ${socket.id} has connected`);
    socket.emit("message", "Welcome");

    socket.on("sendChatMessage", message => {
        userId = socket.id;
        userName = users[userId];
        console.log(`${returnCurrentTime()}: Broadcasting message to clients: ${message}`);
        socket.broadcast.emit("broadcastChatMessage", {userId: userId, userName: userName, message: message});
    })

    .on("newUser", userName => {
        userId = socket.id;
        users[userId] = userName;
        console.log(`${returnCurrentTime()}: Broadcasting new user connection to clients: ${userName}`);
        socket.broadcast.emit("newUserConnected", {userId: userId, userName: userName});
    })

    .on("disconnect", () => {
        userId = socket.id;
        userName = users[userId];
        console.log(`${returnCurrentTime()}: Client with name "${userName}" and id "${userId}" has disconnected`);
        delete users[socket.id];
        socket.broadcast.emit("userDisconnected", {userId: userId, userName: userName});
    });

})

httpServer.listen(3000, () => {
    console.log(`${returnCurrentTime()}: Listening to port 3000`);
})

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