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
            postLog("User already exists");

            res.status(400);
            res.json({message: "User already exists"});
            return;
        }

        const salt = bycrypt.genSaltSync(10);
        const hash = bycrypt.hashSync(password, salt);

        postLog( `Hash is ${hash}`)

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

    handleSession: (req, res) => {
        postLog("Session request received");
        let response;
        if (req.session.isAuth) {
            response = {
                isAuth : true,
                userId : req.session.userId,
                username : req.session.username
            }
        }
        else{
            response = {
                isAuth : false
            }
        }

        res.json(response);
    },

    initRoutes: (app) => {
        mongoPassword = process.env.MONGO_PASSWORD;

        app.post("/register", requestHandler.handleRegister);
        app.post("/login", requestHandler.handleLogin);
        app.get("/session", requestHandler.handleSession);
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