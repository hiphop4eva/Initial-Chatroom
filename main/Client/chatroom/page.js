let name = null;
var borderColor = "#5F5F5D33";

function appendMessage(data, color){
    const userName = data.userName;
    const message = data.message;

    const messageDiv = document.createElement("div");
    messageDiv.style.display = "flex";
    messageDiv.style.backgroundColor = color;
    messageDiv.style.borderLeft =   `2px solid ${borderColor}`;
    messageDiv.style.borderRight =  `2px solid ${borderColor}`;
    messageDiv.style.borderTop =    `1px solid ${borderColor}`;
    messageDiv.style.borderBottom = `1px solid ${borderColor}`;
    
    messageDiv.innerText = `${userName}: ${message}`;
    messageContainer.appendChild(messageDiv);
}

function appendImage(data, color, maxWidth = `1000px`, maxHeight = `175px`){
    const userName = data.userName;
    const imageDataUrl = data.imageDataUrl;
    
    const messageDiv = document.createElement("div");
    messageDiv.style.display = "flex";
    messageDiv.style.backgroundColor = color;
    messageDiv.style.borderLeft =   `2px solid ${borderColor}`;
    messageDiv.style.borderRight =  `2px solid ${borderColor}`;
    messageDiv.style.borderTop =    `1px solid ${borderColor}`;
    messageDiv.style.borderBottom = `1px solid ${borderColor}`;

    const text = document.createElement("span");
    text.style.maxHeight = `5px`;
    text.style.top = "2px";
    text.innerText = `${userName}: `;
    
    const img = document.createElement("img");
    img.style.maxWidth = `${maxWidth}`;
    img.style.maxHeight = `${maxHeight}`;
    img.src = imageDataUrl;
    
    messageDiv.appendChild(text);
    messageDiv.appendChild(img);

    messageContainer.appendChild(messageDiv);
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

