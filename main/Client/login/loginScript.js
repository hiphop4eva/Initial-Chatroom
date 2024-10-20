isLocalTime = true;

const returnButton = document.getElementById("returnButton");
const nameInput = document.getElementById("nameInput");
const passwordInput = document.getElementById("passwordInput");
const loginButton = document.getElementById("loginButton");
const registerButton = document.getElementById("registerButton");

returnButton.addEventListener("click", () => {
    window.location.href = "http://localhost:3000/chatroom";
})

registerButton.addEventListener("click", () => {
    const name = nameInput.value;
    const password = passwordInput.value;
    
    if (!name || !password) {
        alert("Please enter name and password");
        return;
    }
   
    attemptRegister(name, password)
    .then(data => {
        postLog(`Response: ${data.message}`);

        if (data.successful) {
            postLog("Is successful");
            attemptLogin(name, password)
            .then(data => {
                window.location.href = "http://localhost:3000/chatroom";
            });
        }
    });
});

loginButton.addEventListener("click", () => {
    const name = nameInput.value;
    const password = passwordInput.value;
    
    if (!name || !password) {
        alert("Please enter name and password");
        return;
    }

    attemptLogin(name, password)
    .then(data => {
        postLog(`Response: ${data.message}`);

        if (data.successful) {
            
            postLog(`User "${name}" logged in`);
            window.location.href = "http://localhost:3000/chatroom";
        }
        else{
            alert("Wrong name or password");
        }
    });
});

function attemptRegister(name, password){
    if (!name || !password) {
        throw new Error("Name and password must be filled in");
        return;
    }

    postLog(`Sending registration request: Name: ${name}, Password: ${password}`);

    return fetch(`http://localhost:3000/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: name,
            password: password
        })
    })
    .then(response => response.json())
    .then(data => { 
        return data;
    })
    .catch(error => {
        postLog(`Error while attempting register: ${error}`, true);
        throw new Error(`Error while attempting register: ${error}`);
    })
}

function attemptLogin(name, password){
    if (!name || !password) {
        throw new Error("Name and password must be filled in");
        return;
    }

    postLog(`Sending login request: Name: ${name}, Password: ${password}`);

    return fetch(`http://localhost:3000/loginRequest`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: name,
            password: password
        })
    })
    .then(response => response.json())
    .then(data => {
        return data; 
    })
    .catch(error => {
        postLog(`Error while attempting login: ${error}`, true);
        throw new Error(`Error while attempting login: ${error}`);
    })
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