const express = require("express");
const bycrypt = require("bcrypt");
const User = require("./models");

let mongoPassword = null;

const requestHandler = {
    handleLogin: async (req, res) => {
        const name = req.body.name;
        const password = req.body.password;

        const salt = bycrypt.genSaltSync(10);
        const hash = bycrypt.hashSync(password, salt);

        console.log(`${returnCurrentTime()}: Request from login page data is: Name: ${name}, Password: ${password}`);
        console.log(`The hash is ${hash}`);
        
        const user = new User({
            name: name,
            password: hash
        });

        try{
            await user.save().then(() => console.log(`${returnCurrentTime()}: New user created`));
        }
        catch (err) {
            console.log(err);
        }

        response = {
            message: "This is my response", 
        }

        res.status(200);
        res.json(response);
    },

    initRoutes: (app) => {
        mongoPassword = process.env.MONGO_PASSWORD;

        app.post("/login", requestHandler.handleLogin);
    }
}

module.exports = requestHandler;

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