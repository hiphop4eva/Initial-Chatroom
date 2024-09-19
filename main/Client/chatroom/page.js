isLocalTime = true;

const socket = io('http://localhost:3000');
const messageContainer = document.getElementById("message-container");
const messageForm = document.getElementById("send-container");
const messageInput = document.getElementById("message-input");
const loginContainer = document.getElementById("login-container");
const loginButton = document.getElementById("login-button");

let name = null;

function appendMessage(data){
    userId = data.userId;
    userName = data.userName;
    message = data.message;

    const messageElement = document.createElement("div");
    
    if(userId === socket.id){
        messageElement.style.backgroundColor = "lightgreen";
    }
    
    if(!userId){
        messageElement.innerText = `${message}`;
        postLog(`Message is appended: "${message}"`);
    }
    else{
        messageElement.innerText = `${userName}: ${message}`;
        postLog(`Message is appended: "${message}" from user "${userName}" with id "${userId}"`);
    }
    messageContainer.appendChild(messageElement);
}

function removeLoginButton(){
    loginButton.remove();
}

function addLogoutButton(){
    const logoutButton = document.createElement("button");
    logoutButton.innerText = "Logout";
    logoutButton.addEventListener("click", () => {
        userId = socket.id;
        userName = name;
        postLog(`Logout button clicked. Redirecting user "${userName}" with id "${userId}" to login page`);
        
        fetch("http://localhost:3000/session", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(respone => respone.json())
        .then(data => { postLog(`Response: ${data.message}`); })
        .catch(error => {
            postLog(`Error: ${error}`, true);
        })

        window.location.href = "login.html";
    })

    loginContainer.appendChild(logoutButton);
}

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