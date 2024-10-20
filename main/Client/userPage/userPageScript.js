isLocalTime = true;

const mainInfo = document.getElementById("mainInfo");
const avatarInfo = document.getElementById("avatarInfo");
const mainInfoButton = document.getElementById("mainInfoButton");
const avatarInfoButton = document.getElementById("avatarInfoButton");
const mainInfoUsername = document.getElementById("mainInfoUsername");

const url = new URL(window.location.href);
const userId = url.searchParams.get("userId");
var username;

mainInfoButton.addEventListener("click", () => {
    mainInfo.style.display = "flex";
    avatarInfo.style.display = "none";
})

avatarInfoButton.addEventListener("click", () => {
    mainInfo.style.display = "none";
    avatarInfo.style.display = "flex";
})

fetch("http://localhost:3000/findUserWithId", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        userId: userId
    })
})
.then(response => response.json())
.then(data => {
    if(data.message === "User not found") {
        alert("This user doesn't exist");
    }
    else{
        username = data.name;

        mainInfoUsername.innerHTML = username;
    }
})

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