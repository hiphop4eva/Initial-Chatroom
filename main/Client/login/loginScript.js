isLocalTime = true;

const nameInput = document.getElementById("nameInput");
const passwordInput = document.getElementById("passwordInput");
const loginButton = document.getElementById("loginButton");
const registerButton = document.getElementById("registerButton");

loginButton.addEventListener("click", () => {
    const name = nameInput.value;
    const password = passwordInput.value;
    
    if (!name || !password) {
        alert("Please enter name and password");
        return;
    }

    postLog(`Sending login request: Name: ${name}, Password: ${password}`);

    fetch(`http://localhost:3000/login`, {
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
    .then(data => { postLog(`Response: ${data.message}`); })
    .catch(error => {
        postLog(`Error: ${error}`, true);
    })


});

registerButton.addEventListener("click", () => {
    const name = nameInput.value;
    const password = passwordInput.value;
    
    if (!name || !password) {
        alert("Please enter name and password");
        return;
    }
    postLog(`Sending registration request: Name: ${name}, Password: ${password}`);

    fetch(`http://localhost:3000/register`, {
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
    .then(data => { postLog(`Response: ${data.message}`); })
    .catch(error => {
        postLog(`Error: ${error}`, true);
    })
});

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