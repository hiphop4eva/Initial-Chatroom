isLocalTime = true;

const http = require("http");
const express = require("express");
const session = require("express-session");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const requestHandler = require("./requestHandler");
const mongoConnector = require("./mongodb");
const User = require("./models");

const httpServer = http.createServer(app)
const { Server } = require("socket.io");
const { join } = require("path");
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",
    },
});

let sessionKey = null;

const result = dotenv.config(path = ".../...env");
if (result.error) {
    postLog(`Error while loading .env file.`, true);
}
else {
    postLog(`.env file loaded.`);
    
    sessionKey = process.env.SESSION_SECRET_KEY;
}

mongoConnector.connect();

const sessionMiddleware = session({
    secret: sessionKey,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: false,
        maxAge: 3600000, // 1 hour
    },
})

app.use(express.json());
app.use(cors());
app.use(sessionMiddleware);
app.get("/", async (req, res, next) => {
    postLog(`Server started`);

    if(!req.session.isAuth){
        req.session.isAuth = false;
        postLog("Session doesn't have authentication.");
    }
    else if(req.session.isAuth == true) {
        const userId = req.session.userId;
        postLog(`Attempting to find user with id ${userId}`);
        const user = await User.findById(userId);

        if(user) {
            postLog("User found and logged in.");

        }
        else{
            postLog("User not found.", true);
        }
    }

    next();
})
.use(express.static(join(__dirname, "../Client/chatroom")))
.use(express.static(join(__dirname, "../Client/login")));

const users = {};

requestHandler.initRoutes(app);

io.engine.use(sessionMiddleware);

io.on("connection", socket => {
    postLog(`Client with id "${socket.id}" has connected`);
    socket.emit("message", "Welcome");

    socket.on("sendChatMessage", message => {
        const senderSession = socket.request.session;
        const senderSessionId = senderSession.id;
        const userId = socket.id;
        const userName = users[userId];

        postLog(`Broadcasting message to clients: ${message}`);
        socket.broadcast.emit("broadcastSendChatMessage", {userId: userId, userName: userName, message: message, senderSessionId: senderSessionId});
    })

    .on("sendChatImage", data =>{
        const senderSession = socket.request.session;
        const senderSessionId = senderSession.id;
        const userId = socket.id;
        const userName = users[userId];

        postLog(`Broadcasting image to clients`);
        socket.broadcast.emit("broadcastSendChatImage", {userId: userId, userName: userName, imageDataUrl: data.imageDataUrl, senderSessionId: senderSessionId});
    })

    .on("newUser", userName => {
        senderSession = socket.request.session;
        senderSessionId = senderSession.id;
        userId = socket.id;
        users[userId] = userName;
        
        postLog(`Broadcasting new user connection to clients: "${userName}" with id "${userId}"`);
        socket.broadcast.emit("newUserConnected", {userId: userId, userName: userName, senderSessionId: senderSessionId});
    })

    .on("disconnect", () => {
        senderSession = socket.request.session;
        senderSessionId = senderSession.id;
        userId = socket.id;
        userName = users[userId];
        
        postLog(`Broadcasting user disconnection to clients: "${userName}" with id "${userId}`);
        delete users[socket.id];
        socket.broadcast.emit("userDisconnected", {userId: userId, userName: userName, senderSessionId: senderSessionId});
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