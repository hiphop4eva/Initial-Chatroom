isLocalTime = true;

const nameInput = document.getElementById("nameInput");
const passwordInput = document.getElementById("passwordInput");
const loginButton = document.getElementById("loginButton");

loginButton.addEventListener("click", () => {
    const name = nameInput.value;
    const password = passwordInput.value;
    
    if (!name || !password) {
        alert("Please enter name and password");
        return;
    }
    console.log(`Name: ${name}, Password: ${password}`);

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
    .then(data => { console.log(data); })
    .catch(error => {
        console.log(error);
    })
});

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