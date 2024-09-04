const express = require("express");
const bycrypt = require("bcrypt");
const User = require("./models");

let mongoPassword = null;

const requestHandler = {
    handleRegister: async (req, res) => {
        const name = req.body.name;
        const password = req.body.password;

        const salt = bycrypt.genSaltSync(10);
        const hash = bycrypt.hashSync(password, salt);

        postLog(`Post request from login page data is: Name: ${name}, Password: ${password} \n 
            Hash: ${hash}`);
        
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
        postLog(`Comparing passwords: ${password} vs ${user.password}`);
        if (!user) {
            notFound = true;
            errorMessage = "User not found";
        }
        
        else {
            if (!bycrypt.compareSync(password, user.password)) {
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
            response = {
                message: "User found", 
            }
            res.status(200);
            res.json(response);
        }
    },

    initRoutes: (app) => {
        mongoPassword = process.env.MONGO_PASSWORD;

        app.post("/register", requestHandler.handleRegister);
        app.post("/login", requestHandler.handleLogin);
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