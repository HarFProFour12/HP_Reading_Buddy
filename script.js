let houseSelected = ""
const error = document.getElementById("error")
const slogan = document.getElementById("slogan")
const welcome = document.getElementById("welcome")
let account = false

const slogans = {
    "Gryffindor": "Where courage leads the way.",
    "Slytherin": "Where ambition finds its path.",
    "Ravenclaw": "Where curiosity knows no bounds.",
    "Hufflepuff": "Where loyalty and kindness endure."
}

const backgrounds = {
    "Gryffindor": "images/gryffindor.jpeg",
    "Slytherin": "images/slytherin.jpeg",
    "Hufflepuff": "images/hufflepuff.jpeg",
    "Ravenclaw": "images/ravenclaw.jpeg"
}

const accents = {
    "Gryffindor": "rgba(214, 69, 65, 0.7)",
    "Slytherin": "rgba(63, 174, 122, 0.7)",
    "Hufflepuff": "rgba(240, 180, 41, 0.7)",
    "Ravenclaw": "rgba(90, 168, 255, 0.7)"
}

const comps = {
    "Gryffindor": "#f3e8d0",
    "Slytherin": "#b4bdb7",
    "Hufflepuff": "#f6ecd2",
    "Ravenclaw": "#c29a5f"
}

function selectHouse(house) {
    houseSelected = house
    console.log(house)
    error.innerText = ""   

    for (const card of document.querySelectorAll(".house")) {
        card.classList.toggle("selected", card.id === houseSelected)
    }
}

function confirmHouse() {
    if (houseSelected == "") {
        error.innerText = "Please select your preferred house!"
        console.log(error)
    }
    else {
        localStorage.setItem("house", houseSelected)
        window.location.href = "home.html"
    }
}

if (slogan) {
    account = true
    const house = localStorage.getItem("house")
    document.documentElement.style.setProperty("--accent", accents[house])
    document.documentElement.style.setProperty("--comp", comps[house])
    document.body.style.backgroundImage = `url("${backgrounds[house]}")`
    slogan.innerText = slogans[house]
    welcome.innerText = "Welcome back, " + house + "!"
}

let totalTime;
let seconds = 0;
let timer;

function updateTimer() {
    let h = Math.floor(seconds / 3600);
    let m = Math.floor(seconds % 3600 / 60);
    let s = seconds % 60

    document.getElementById("timer-display").textContent =
    String(h).padStart(2, "0") + ":" +
    String(m).padStart(2, "0") + ":" +
    String(s).padStart(2, "0");
}

function startTimer() {
    if (timer) return;
    timer = setInterval(() => {
        seconds ++
        updateTimer();
    }, 1000)
};

function pauseTimer() {
    clearInterval(timer);
    timer = null;
};

function resetTimer() {
    clearInterval(timer);
    timer = null;
    seconds = 0;
    updateTimer();
};

updateTimer();