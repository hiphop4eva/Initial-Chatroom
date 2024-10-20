var userId = null;

sessionData = fetchSessionData()
.then(sessionData => {
    if(sessionData.username){
        userId = sessionData.userId;
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
    const message = data.message;

    const userInfo = data.userInfo;
    const username = userInfo.name;
    const senderSessionId = data.senderSessionId;

    fetchSessionData().then(sessionData => {
        const getterSessionId = sessionData.sessionId;

        postLog(`Broadcast message recieved from server: "${message}" from user "${username}"`);
       
        if(senderSessionId === getterSessionId){
            window.appendMessage(message, "lightgreen", userInfo);
        }

        else{
            window.appendMessage(message, null, userInfo);
        }
        
        postLog(`Message is appended: "${message}"`);
    });
})

.on("broadcastSendChatImage", data => {
    const senderSessionId = data.senderSessionId;
    const imageDataUrl = data.imageDataUrl;
    
    const userInfo = data.userInfo;
    const username = userInfo.name;

    fetchSessionData().then(sessionData => {
        const getterSessionId = sessionData.sessionId;

        postLog(`Broadcast image recieved from server: From user "${username}"`);
       
        if(senderSessionId === getterSessionId){
            window.appendImage(imageDataUrl, "lightgreen", userInfo);
        }
        
        else{
            window.appendImage(imageDataUrl, null, userInfo);
        }
        
    });
})

.on("newUserConnected", data => {
    const userId = data.userId;
    const userName = data.userName;

    if(socket.id === userId){
        postLog(`You are now connected "${userName}" with id "${userId}"`);
        window.appendMessage(`You are now connected "${userName}"`);
    }
    else{
        postLog(`New user "${userName}" connected with id "${userId}"`);
        window.appendMessage(`New user "${userName}" connected `);
    }
})

.on("userDisconnected", data => {
    const userId = data.userId;
    const userName = data.userName;

    postLog(`User with name "${userName}" and id "${userId}" has disconnected`);
    window.appendMessage(`User "${userName}" disconnected`);
})

messageForm.addEventListener("submit", e => {
    e.preventDefault();

    userName = name;
    const message = messageInput.value;

    if(message){
        postLog(`Message is emitted: "${message}" from user "${userName}" with id "${userId}"`);

        socket.emit("sendChatMessage", {message: message, userId: userId});

        if(userId){
            fetch("http://localhost:3000/findUserWithId", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({userId: userId})
            })
            .then(response => response.json())
            .then(data => {
                appendMessage(message, "lightgreen", data);
            })
            .catch(error => {
                postLog(`Error: ${error}`, true);
                return;
            });
        }

        else{
            appendMessage(message, "lightgreen");
        }
        
        messageInput.value = "";
    }
})

loginButton.addEventListener("click", () => {
    userName = name;
    
    postLog(`Login button clicked. Redirecting user "${userName}" with id "${userId}" to login page`);
    window.location.href = "login";
})

attachmentButton.addEventListener("click", () => {
    postLog(`Attachment button clicked.`);
    
    fileInput.click();
})

fileInput.addEventListener("change", () => {
    postLog(`File selected: "${fileInput.files[0].name}"`);
    const file = fileInput.files[0];
    const fileReader = new FileReader();

    if(!file.type.startsWith("image/")){
        postLog(`File is not an image`);
        alert("File is not an image");
        return;
    }

    fileReader.onload = (e) => {
        const imageDataUrl = e.target.result;

        if(userId){
            fetch("http://localhost:3000/findUserWithId", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({userId: userId})
            })
            .then(response => response.json())
            .then(data => {
                appendImage(imageDataUrl, "lightgreen", data);
            })
            .catch(error => {
                postLog(`Error: ${error}`, true);
                return;
            });
        }

        else{
            appendImage(imageDataUrl, "lightgreen");
        }

        socket.emit("sendChatImage", {imageDataUrl: imageDataUrl, userId: userId});
    }
    
    fileReader.readAsDataURL(file);
})