const express = require("express");
const bycrypt = require("bcrypt");
const User = require("./models");
const session = require("express-session");

let mongoPassword = null;

const requestHandler = {
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

        postLog(`Hash is ${hash}`)

        const user = new User({
            name: name,
            password: hash
        });

        try{
            await user.save().then(() => postLog(`New user ${name} created`));
        }
        catch (err) {
            console.log(err);
        }

        response = {
            message: "User created",
            successful: true,
            username: name,
        }

        res.status(200);
        res.json(response);
    },

    handleLogin: async (req, res) => {
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
            req.session.userId = user._id;
            req.session.username = user.name;
            
            res.status(200);
            res.json(response);
        }
    },

    handleGetSession: (req, res) => {
        postLog("Session get request received");
        let response = null;
        response = {
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
                postLog("Session updating isAuth property");
                req.session.isAuth = isAuth;
            }
            if(userId) {
                postLog("Session updating userId property");
                req.session.userId = userId;
            }
            if(username) {
                postLog("Session updating username property");
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

        app.post("/register", requestHandler.handleRegister);
        
        app.post("/login", requestHandler.handleLogin);

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