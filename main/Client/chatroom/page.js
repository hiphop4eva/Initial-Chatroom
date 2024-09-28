let name = null;
var borderColor = "#5F5F5D33";

function createModalWindow(){
    const modalWindow = document.createElement("div");

    modalWindow.classList.add("modalWindow");
    
    modalWindow.style.position = "fixed";
    modalWindow.style.minWidth = "300px";
    modalWindow.style.minHeight = "200px";
    modalWindow.style.top = "50%";
    modalWindow.style.bottom = "50%";
    modalWindow.style.left = "50%";
    modalWindow.style.right = "50%";
    modalWindow.style.backgroundColor = "darkgray";
    modalWindow.style.border = `2px solid ${borderColor}`;
    modalWindow.style.padding = "10px";
    modalWindow.style.zIndex = "10";
        
    const modalCloseButton = document.createElement("button");
    modalCloseButton.style.position = "absolute";
    modalCloseButton.style.right = "10px";
    modalCloseButton.style.top = "10px";
    modalCloseButton.innerText = "Close";
    modalCloseButton.style.cursor = "pointer";
        
    modalCloseButton.addEventListener("click", () => {
        modalWindow.remove();
    })

    modalWindow.appendChild(modalCloseButton);

    setTimeout(() => {
        document.body.addEventListener("click", (event) => {
            
            if(!modalWindow.contains(event.target)){
                modalWindow.remove();
                
                document.body.removeEventListener("click", null);
            }
        })
    }, 100)

    return modalWindow;
}

function createUserIcon(name){
    const userIcon = document.createElement("div");
    
    if(!name){
        name = ""
    }

    userIcon.innerText = name;
    userIcon.style.display = "flex";
    userIcon.style.justifyContent = "center";
    userIcon.style.alignItems = "center";
    userIcon.style.height = "40px";
    userIcon.style.width = "40px";
    userIcon.style.backgroundColor = "lightblue";
    userIcon.style.cursor = "pointer";

    userIcon.classList.add("userIcons");
    
    userIcon.addEventListener("click", () => {
        const modalWindows = document.getElementsByClassName("modalWindow");
        for (let i = 0; i < modalWindows.length; i++) {
            modalWindows[i].remove();
        }

        const modalWindow = createModalWindow();
        
        const modalUserInfo = document.createElement("div");
        modalUserInfo.style.display = "flex";
        modalUserInfo.style.alignItems = "center";
        modalUserInfo.style.backgroundColor = "lightgrey";

        const modalUserName = document.createElement("p");
        modalUserName.innerText = name;

        modalUserInfo.appendChild(modalUserName);
        modalWindow.appendChild(modalUserInfo);

        document.body.appendChild(modalWindow);
    })

    return userIcon;
}

function createMessageDiv(userName, color){
    const date = new Date();
    const timestamp = `${date.getHours()}:${date.getMinutes()}`;

    const timestampText = document.createElement("span");
    timestampText.style.marginRight = `5px`;
    timestampText.innerText = timestamp;

    const messageDiv = document.createElement("div");
    messageDiv.classList.add("messageDivs");
    messageDiv.style.display = "flex";
    messageDiv.style.backgroundColor = "#DDDDDD44";
    messageDiv.style.borderRight =  `2px solid ${borderColor}`;
    messageDiv.style.borderLeft =   `2px solid ${borderColor}`;
    messageDiv.style.borderTop =    `1px solid ${borderColor}`;
    messageDiv.style.borderBottom = `1px solid ${borderColor}`;

    const userIcon = createUserIcon(userName);
    
    const messageDivInner = document.createElement("div");
    messageDivInner.style.display = "flex";
    messageDivInner.style.backgroundColor = color;
    messageDivInner.style.flexGrow = "1";
    //messageDivInner.style.borderRight =  `2px solid ${borderColor}`;
    //messageDivInner.style.borderLeft =   `2px solid ${borderColor}`;
    //messageDivInner.style.borderTop =    `1px solid ${borderColor}`;
    //messageDivInner.style.borderBottom = `1px solid ${borderColor}`;

    const messageDivs = document.getElementsByClassName("messageDivs");
    const messageDivsCount = messageDivs.length;
    if(messageDivsCount % 2 == 0 && color == null){
        messageDivInner.style.backgroundColor = "#F0F0F0";
    }

    const text = document.createElement("span");
    text.style.marginRight = `2px`;
    text.style.marginLeft = `2px`;
    text.style.maxHeight = `5px`;
    text.style.top = "2px";
    
    text.innerText = ` : `;

    messageDivInner.appendChild(userIcon);
    messageDivInner.appendChild(text);
    messageDiv.appendChild(timestampText);
    messageDiv.appendChild(messageDivInner);

    return {messageDiv: messageDiv, messageDivInner: messageDivInner};
}

function createImageDiv(imageDataUrl, maxWidth = `1000px`, maxHeight = `175px`){
    const imgDiv = document.createElement("div");
    imgDiv.style.maxHeight = maxHeight;
    imgDiv.style.maxWidth = maxWidth;
    imgDiv.style.color = "#55555500";
    imgDiv.style.padding = "0px";
    imgDiv.style.cursor = "pointer";
    
    let enlargened = false;
    imgDiv.addEventListener("click", () => {
        if(!enlargened){
            //img.style.maxWidth =     `1000px`;
            //img.style.maxHeight =    `1000px`;
            imgDiv.style.maxWidth =  `1000px`;
            imgDiv.style.maxHeight = `1000px`;
            enlargened = true;
        }
        else{
            //img.style.maxWidth = maxWidth;
            //img.style.maxHeight = maxHeight;
            imgDiv.style.maxWidth = maxWidth;
            imgDiv.style.maxHeight = maxHeight;
            enlargened = false;
        }
    })

    const img = document.createElement("img");
    img.style.maxWidth = `100%`;
    img.style.maxHeight = `100%`;
    img.style.objectFit = "contain";
    
    img.src = imageDataUrl;

    imgDiv.appendChild(img);

    return imgDiv;
}

function appendMessage(data, color){
    const userName = data.userName;
    const message = data.message;
    
    const {messageDiv, messageDivInner} = createMessageDiv(userName, color);
    
    const text = document.createElement("span");
    text.innerText = message;
    
    messageDivInner.appendChild(text);

    messageContainer.appendChild(messageDiv);
}

function appendImage(data, color, maxWidth = `1000px`, maxHeight = `175px`){
    const userName = data.userName;
    const imageDataUrl = data.imageDataUrl;
    
    const {messageDiv, messageDivInner} = createMessageDiv(userName, color);
    
    const imgDiv = createImageDiv(imageDataUrl, maxWidth, maxHeight);
    
    messageDivInner.appendChild(imgDiv);

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

