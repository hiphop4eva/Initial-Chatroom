isLocalTime = true;

const socket = io('http://localhost:3000');

const messageContainer = document.getElementById("message-container");
const messageForm = document.getElementById("send-container");
const messageInput = document.getElementById("message-input");
const loginContainer = document.getElementById("login-container");
const loginButton = document.getElementById("login-button");
const attachmentButton = document.getElementById("attachment-button");
const fileInput = document.getElementById("file-input");

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

function fetchSessionData(){
    return fetch("http://localhost:3000/session", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(data => {
        return data;
    })
    .catch(error => {
        postLog(`Error: ${error}`, true);
        return;
    });
}

function postSessionData(sessionData){
    return fetch("http://localhost:3000/session", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(sessionData)
    })
    .then(response => response.json())
    .then(data =>{
        return data;
    })
    .catch(error => {
        postLog(`Error: ${error}`, true);
        return;
    });
}