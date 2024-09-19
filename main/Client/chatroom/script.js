isLocalTime = true;

const socket = io('http://localhost:3000');
const messageContainer = document.getElementById("message-container");
const messageForm = document.getElementById("send-container");
const messageInput = document.getElementById("message-input");
const loginContainer = document.getElementById("login-container");
const loginButton = document.getElementById("login-button");

let name = null;

fetch("http://localhost:3000/session", {
    method: "GET",
    headers: {
        "Content-Type": "application/json"
    }
})
.then(respone => respone.json())
.then(data => {
    if(data.isAuth){
        name = data.username;
        loginContainer.remove();
    }
})
.catch(error => {
    postLog(`Error: ${error}`, true);
});

socket.on("connect", () => {
    postLog(`Socket connected: ${socket.id}`);
    while(!name){
        name = prompt("Enter your name: ");
    }
    socket.emit("newUser", name);
    
})

.on("message", data => {
    postLog(`Message recieved from server: ${data}`);
})

.on("broadcastChatMessage", data => {
    const userId = data.userId;
    const userName = data.userName;
    const message = data.message;
    postLog(`Broadcast message recieved from server: "${message}" from user "${userName}" with id "${userId}"`);
    appendMessage({userId: userId, userName: userName, message: message});
})

.on("newUserConnected", data => {
    const userId = data.userId;
    const userName = data.userName;
    const date = new Date();
    const timestamp = date.toLocaleString();

    if(socket.id === userId){
        postLog(`You are now connected "${userName}" with id "${userId}"`);
        appendMessage({userId: "", userName: "", message: `${timestamp}: You are now connected "${userName}"`});
    }
    else{
        postLog(`New user "${userName}" connected with id "${userId}"`);
        appendMessage({userId: "", userName: "", message: `${timestamp}: New user "${userName}" connected `});
    }
})

.on("userDisconnected", data => {
    const userId = data.userId;
    const userName = data.userName; 
    const date = new Date();
    const timestamp = Date.currentTime.toLocaleString();

    postLog(`User with name "${userName}" and id "${userId}" has disconnected`);
    appendMessage({message: `${timestamp}: User "${userName}" disconnected`});
})

messageForm.addEventListener("submit", e => {
    e.preventDefault();
    userId = socket.id;
    userName = name;
    const message = messageInput.value;
    
    postLog(`Message is emitted: "${message}" from user "${userName}" with id "${userId}"`);
    socket.emit("sendChatMessage", message);
    appendMessage({userId: userId, userName: userName, message: message});
    messageInput.value = "";
})

loginButton.addEventListener("click", () => {
    userId = socket.id;
    userName = name;
    postLog(`Login button clicked. Redirecting user "${userName}" with id "${userId}" to login page`);
    window.location.href = "login.html";
})

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