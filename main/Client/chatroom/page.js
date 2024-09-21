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

