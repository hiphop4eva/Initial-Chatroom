isLocalTime = true;

const socket = io('http://localhost:3000');
const messageContainer = document.getElementById("message-container");
const messageForm = document.getElementById("send-container");
const messageInput = document.getElementById("message-input");

let name = null;

socket.on("connect", () => {
    console.log(`${returnCurrentTime()}: Socket connected: ${socket.id}`);
    while(!name){
        name = prompt("Enter your name: ");
    }
    socket.emit("newUser", name);
    
})

.on("message", data => {
    console.log(`${returnCurrentTime()}: Message recieved from server: ${data}`);
})

.on("broadcastChatMessage", data => {
    const userId = data.userId;
    const userName = data.userName;
    const message = data.message;
    console.log(`${returnCurrentTime()}: Broadcast message recieved from server: "${message}" from user "${userName}" with id "${userId}"`);
    appendMessage({userId: userId, userName: userName, message: message});
})

.on("newUserConnected", data => {
    const userId = data.userId;
    const userName = data.userName;
    if(socket.id === userId){
        console.log(`${returnCurrentTime()}: You are now connected "${userName}" with id "${userId}"`);
        appendMessage({userId: "", userName: "", message: `${returnCurrentTime()}: You are now connected "${userName}"`});
    }
    else{
        console.log(`${returnCurrentTime()}: New user "${userName}" connected with id "${userId}"`);
        appendMessage({userId: "", userName: "", message: `${returnCurrentTime()}: New user "${userName}" connected `});
    }
})

.on("userDisconnected", data => {
    const userId = data.userId;
    const userName = data.userName; 
    console.log(`${returnCurrentTime()}: User with name "${userName}" and id "${userId}" has disconnected`);
    appendMessage({message: `${returnCurrentTime()}: User "${userName}" disconnected`});
})

messageForm.addEventListener("submit", e => {
    e.preventDefault();
    userId = socket.id;
    userName = name;
    const message = messageInput.value;
    
    console.log(`${returnCurrentTime()}: Message is emitted: "${message}" from user "${userName}" with id "${userId}"`);
    socket.emit("sendChatMessage", message);
    appendMessage({userId: userId, userName: userName, message: message});
    messageInput.value = "";
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
        console.log(`${returnCurrentTime()}: Message is appended: "${message}"`);
    }
    else{
        messageElement.innerText = `${userName}: ${message}`;
        console.log(`${returnCurrentTime()}: Message is appended: "${message}" from user "${userName}" with id "${userId}"`);
    }
    messageContainer.appendChild(messageElement);
}

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