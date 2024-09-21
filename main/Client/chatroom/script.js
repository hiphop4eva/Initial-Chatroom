sessionData = fetchSessionData()
.then(sessionData => {
    if(sessionData.username){
        name = sessionData.username;
    }
    if(sessionData.isAuth){
        removeLoginButton();
        addLogoutButton();
    }
});

socket.on("connect", () => {
    postLog(`Socket connected: ${socket.id}`);

    sessionData = fetchSessionData()
    .then(sessionData =>{
        username = sessionData.username;
        
        if(username){
            name = username;
        }
        else{
            while(!name){
                name = prompt("Enter your name: ");
            }
            
            postSessionData({username: name});
        }
        
        socket.emit("newUser", name);
    });
})

.on("message", data => {
    postLog(`Message recieved from server: ${data}`);
})

.on("broadcastChatMessage", data => {
    const userId = data.userId;
    const userName = data.userName;
    const message = data.message;
    postLog(`Broadcast message recieved from server: "${message}" from user "${userName}" with id "${userId}"`);
    window.appendMessage({userId: userId, userName: userName, message: message});
})

.on("newUserConnected", data => {
    const userId = data.userId;
    const userName = data.userName;
    const date = new Date();
    const timestamp = date.toLocaleString();

    if(socket.id === userId){
        postLog(`You are now connected "${userName}" with id "${userId}"`);
        window.appendMessage({userId: "", userName: "", message: `${timestamp}: You are now connected "${userName}"`});
    }
    else{
        postLog(`New user "${userName}" connected with id "${userId}"`);
        window.appendMessage({userId: "", userName: "", message: `${timestamp}: New user "${userName}" connected `});
    }
})

.on("userDisconnected", data => {
    const userId = data.userId;
    const userName = data.userName; 
    const date = new Date();

    postLog(`User with name "${userName}" and id "${userId}" has disconnected`);
    window.appendMessage({message: `User "${userName}" disconnected`});
})

messageForm.addEventListener("submit", e => {
    e.preventDefault();
    userId = socket.id;
    userName = name;
    const message = messageInput.value;


    if(message){
        postLog(`Message is emitted: "${message}" from user "${userName}" with id "${userId}"`);
        socket.emit("sendChatMessage", message);
        window.appendMessage({userId: userId, userName: userName, message: message});
        messageInput.value = "";
    }
})

loginButton.addEventListener("click", () => {
    userId = socket.id;
    userName = name;
    postLog(`Login button clicked. Redirecting user "${userName}" with id "${userId}" to login page`);
    window.location.href = "login.html";
})