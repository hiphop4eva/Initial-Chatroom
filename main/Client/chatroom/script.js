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

.on("broadcastSendChatMessage", data => {
    const userId = data.userId;
    const userName = data.userName;
    const message = data.message;
    const senderSessionId = data.senderSessionId;

    fetchSessionData().then(sessionData => {
        const getterSessionId = sessionData.sessionId;

        postLog(`Broadcast message recieved from server: "${message}" from user "${userName}" with id "${userId}"`);
       
        if(senderSessionId === getterSessionId){
            window.appendMessage({userName: userName, message: message}, "lightgreen");
        }
        
        else{
            window.appendMessage({userName: userName, message: message});
        }
        
        postLog(`Message is appended: "${message}"`);
    });
})

.on("broadcastSendChatImage", data => {
    const userId = data.userId;
    const userName = data.userName;
    const senderSessionId = data.senderSessionId;
    const imageDataUrl = data.imageDataUrl;

    fetchSessionData().then(sessionData => {
        const getterSessionId = sessionData.sessionId;

        postLog(`Broadcast image recieved from server: From user "${userName}" with id "${userId}"`);
       
        if(senderSessionId === getterSessionId){
            window.appendImage({userName: userName, imageDataUrl: imageDataUrl}, "lightgreen");
        }
        
        else{
            window.appendImage({userName: userName, imageDataUrl: imageDataUrl});
        }
        
    });
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
        window.appendMessage({userId: userId, userName: userName, message: message} , "lightgreen");
        messageInput.value = "";
    }
})

loginButton.addEventListener("click", () => {
    userId = socket.id;
    userName = name;
    
    postLog(`Login button clicked. Redirecting user "${userName}" with id "${userId}" to login page`);
    window.location.href = "login.html";
})

attachmentButton.addEventListener("click", () => {
    postLog(`Attachment button clicked.`);
    
    fileInput.click();
})

fileInput.addEventListener("change", () => {
    postLog(`File selected: "${fileInput.files[0].name}"`);
    const userName = name;
    const file = fileInput.files[0];
    const fileReader = new FileReader();

    if(!file.type.startsWith("image/")){
        postLog(`File is not an image`);
        alert("File is not an image");
        return;
    }

    fileReader.onload = (e) => {
        const imageDataUrl = e.target.result;
        appendImage({userName: userName, imageDataUrl: imageDataUrl}, "lightgreen");

        socket.emit("sendChatImage", {imageDataUrl: imageDataUrl});
    }
    
    fileReader.readAsDataURL(file);
})