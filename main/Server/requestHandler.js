const express = require("express");
const bycrypt = require("bcrypt");
const User = require("./models");
const session = require("express-session");
const crypto = require("crypto");
const { join } = require("path");

let mongoPassword = null;

const requestHandler = {
    
    handleIndexPage: (req, res) => {
        postLog("Index page requested");
        res.status(200).sendFile(join(__dirname, "../Client/chatroom/index.html"));
    },

    handlePageFile: (req, res) => {
        postLog("Page script requested");
        res.status(200).sendFile(join(__dirname, "../Client/chatroom/page.js"));
    },

    handlePrerequisitesFile: (req, res) => {
        postLog("Prerequisites script requested");
        res.status(200).sendFile(join(__dirname, "../Client/chatroom/prerequisites.js"));
    },

    handleScriptFile: (req, res) => {
        postLog("Chatroom script requested");
        res.status(200).sendFile(join(__dirname, "../Client/chatroom/script.js"));
    },

    handleLoginPage: (req, res) => {
        postLog("Login page requested");
        res.status(200).sendFile(join(__dirname, "../Client/login/login.html"));
    },

    handleLoginScriptFile: (req, res) => {
        postLog("Login script requested");
        res.status(200).sendFile(join(__dirname, "../Client/login/loginScript.js"));
    },
    
    handleUserPage: (req, res) => {
        postLog("User page requested");
        res.status(200).sendFile(join(__dirname, "../Client/userPage/userPage.html"));
    },

    handleUserPageScriptFile: (req, res) => {
        postLog("User page script requested");
        res.status(200).sendFile(join(__dirname, "../Client/userPage/userPageScript.js"));
    },

    handleFindUserWithId: async (req, res) => {
        const userId = req.body.userId
    
        const user = await User.findOne({userId: userId});
    
        if(user) {
            res.status(200).json(user);
        }
        else {
            res.status(404).json({message: "User not found"});
        }
    },

    handleRegister: async (req, res) => {
        const name = req.body.name;
        const password = req.body.password;

        postLog(`Post request from login page data is: Name: ${name}, Password: ${password}`);

        const userFound = await User.findOne({name: name});
        
        if (userFound) {
            postLog("Username is taken");

            res.status(400);
            res.json({message: "Username is taken"});
            return;
        }

        const salt = bycrypt.genSaltSync(10);
        const hash = bycrypt.hashSync(password, salt);

        const userIdBuffer = crypto.randomBytes(8);
        const userId = userIdBuffer.toString("hex");

        const user = new User({
            userId: userId,
            name: name,
            password: hash
        });

        try{
            await user.save().then(() => postLog(`New user ${name} created`));
        }
        catch (err) {
            if(err.code === 11000){
                const newUserIdBuffer = crypto.randomBytes(8);
                const newUserId = newUserIdBuffer.toString("hex");

                user.user_id = newUserId;

                try{
                    await user.save().then(() => postLog(`New user ${name} created`));
                }
                catch (err) {
                    postLog(`Duplicate user id twice in a row`, true);
                    throw new Error(err);
                }
            }

            else{
                console.log(err);
            }
        }

        response = {
            message: "User created",
            successful: true,
            username: name,
        }

        res.status(200);
        res.json(response);
    },

    handleLoginRequest: async (req, res) => {
        const name = req.body.name;
        const password = req.body.password;
        notFound = false;
        errorMessage = "";

        postLog(`Get request from login page data is: Name: ${name}, Password: ${password}`);
        
        const user = await User.findOne({name: name});
        
        if (!user) {
            notFound = true;
            errorMessage = "User not found";
        }
        else {
            postLog(`Comparing passwords: ${password} vs ${user.password}`);

            const result = bycrypt.compareSync(password, user.password);
            if (!result) {
                notFound = true;
                errorMessage = "Wrong password";
            }
        }

        if (notFound) {
            postLog(errorMessage);

            response = {
                message: errorMessage
            }
            res.status(404);
            res.json(response);
        }
        else {
            postLog(`User "${name}" found`);

            response = {
                message: "User found", 
                successful: true
            }

            req.session.isAuth = true;
            req.session.userId = user.userId;
            req.session.username = user.name;
            
            res.status(200);
            res.json(response);
        }
    },

    handleGetSession: (req, res) => {
        postLog("Session get request received");
        response = {
            sessionId : req.session.id,
            isAuth : req.session.isAuth,
            userId : req.session.userId,
            username : req.session.username
        }

        res.status(200).json(response);
    },

    handlePostSession: (req, res) => {
        postLog("Session post request received");
        const isAuth = req.body.isAuth;
        const userId = req.body.userId;
        const username = req.body.username;

        if(req.session){
            postLog(`isAuth: ${isAuth}, userId: ${userId}, username: ${username}`);
            if (isAuth) {
                req.session.isAuth = isAuth;
            }
            if(userId) {
                req.session.userId = userId;
            }
            if(username) {
                req.session.username = username;
            }

            postLog("Session updated successfully");
            res.status(200).json({message: "Session updated succesfully"});
        }
        else{
            postLog("Session doesn't exist");

            res.status(404).json({message: "Session doesn't exist"});
        }
    },

    handleDeleteSession: (req, res) => {
        postLog("Session deletion request received");

        req.session.destroy();
        res.status(200).json({message: "Session deleted"});
    },

    initRoutes: (app) => {
        mongoPassword = process.env.MONGO_PASSWORD;

        app.get("/chatroom", requestHandler.handleIndexPage);
        app.get("/index.html", requestHandler.handleIndexPage);
        app.get("/page.js", requestHandler.handlePageFile);
        app.get("/prerequisites.js", requestHandler.handlePrerequisitesFile);
        app.get("/script.js", requestHandler.handleScriptFile);

        app.get("/login", requestHandler.handleLoginPage);
        app.get("/login.html", requestHandler.handleLoginPage);
        app.get("/loginScript.js", requestHandler.handleLoginScriptFile);
        
        app.get("/user", requestHandler.handleUserPage);
        app.get("/userPage.html", requestHandler.handleUserPage);
        app.get("/userPageScript.js", requestHandler.handleUserPageScriptFile);

        app.post("/findUserWithId", requestHandler.handleFindUserWithId);

        app.post("/register", requestHandler.handleRegister);
        
        app.post("/loginRequest", requestHandler.handleLoginRequest);

        app.get("/session", requestHandler.handleGetSession);
        app.post("/session", requestHandler.handlePostSession);
        app.delete("/session", requestHandler.handleDeleteSession);
    }
}

module.exports = requestHandler;

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