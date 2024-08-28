isLocalTime = true;

const http = require("http");
const express = require("express");
const app = express();

const httpServer = http.createServer(app)
const { Server } = require("socket.io");
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",
    },
});

app.use(express.static(__dirname));
app.get("/", (req, res) => {
    console.log(`${returnCurrentTime()}: Server started`);
    res.end();
})

const users = {};

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
    console.log(`${returnCurrentTime()}: Listening`);
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