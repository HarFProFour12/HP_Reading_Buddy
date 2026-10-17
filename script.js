let houseSelected = ""
const error = document.getElementById("error")
const slogan = document.getElementById("slogan")
const welcome = document.getElementById("welcome")
let account = false

const slogans = {
    "Gryffindor": "Where courage leads the way",
    "Slytherin": "Where ambition finds its path",
    "Ravenclaw": "Where curiosity knows no bounds",
    "Hufflepuff": "Where loyalty and kindness endure"
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

let seconds = Number(localStorage.getItem("active-session-seconds")) || 0;
let isRunning = false;
let sessionStarted = localStorage.getItem("session-started") === "true";
let timer = null;

function updateTimer() {
    let h = Math.floor(seconds / 3600);
    let m = Math.floor(seconds % 3600 / 60);
    let s = seconds % 60

    document.getElementById("timer-display").textContent =
    String(h).padStart(2, "0") + ":" +
    String(m).padStart(2, "0") + ":" +
    String(s).padStart(2, "0");

    localStorage.setItem("active-session-seconds", seconds)
}

function startTimer() {
    if (timer) return;
    timer = setInterval(() => {
        seconds ++
        updateTimer();
    }, 1000)

    isRunning = true;
};

function pauseTimer() {
    clearInterval(timer);
    timer = null;

    isRunning = false;
};

function toggleTimer() {
    if (isRunning) {
        pauseTimer();
    }
    else {
        startTimer();
        sessionStarted = true;
        localStorage.setItem("session-started", "true")
    }

    document.getElementById("start-pause").textContent =
        isRunning ? "Pause" : "Resume";
    
    document.getElementById("reset").hidden = false;
    document.getElementById("finish").hidden = false;
}

function resetTimer() {
    if (!confirm("Reset this session? Unsaved time will be lost.")) {
        return;
    }

    clearInterval(timer);
    timer = null;
    seconds = 0;
    isRunning = false;
    sessionStarted = false;

    localStorage.removeItem("active-session-seconds");
    localStorage.removeItem("session-started");

    updateTimer();

    document.getElementById("start-pause").textContent = "Start Reading";
    document.getElementById("reset").hidden = true;
    document.getElementById("finish").hidden = true;
};

function finishAndSave() {
    if (seconds === 0) {
        alert("Read for at least a second before saving!");
        return;
    }

    pauseTimer();

    let totalTime = Number(localStorage.getItem("total-time")) || 0;
    localStorage.setItem("total-time", totalTime + seconds);

    seconds = 0;
    sessionStarted = false;

    localStorage.removeItem("active-session-seconds");
    localStorage.removeItem("session-started");

    updateTimer();

    document.getElementById("start-pause").textContent = "Start Reading";
    document.getElementById("reset").hidden = true;
    document.getElementById("finish").hidden = true;

    alert("Reading session saved!");
}

document.getElementById("start-pause").addEventListener("click", toggleTimer);
document.getElementById("reset").addEventListener("click", resetTimer);
document.getElementById("finish").addEventListener("click", finishAndSave);

updateTimer();

if (sessionStarted) {
    document.getElementById("start-pause").textContent = "Resume";
    document.getElementById("reset").hidden = false;
    document.getElementById("finish").hidden = false;
}

const books = document.querySelectorAll('#books-read input[type="checkbox"]');
const savedBooks = JSON.parse(localStorage.getItem('booksRead') || '[]');

books.forEach((book, index) => {
    book.checked = savedBooks.includes(book.id)

    book.addEventListener('change', () => {
        const readBooks = Array.from(books)
            .filter(book => book.checked)
            .map(book => book.id);

        localStorage.setItem('booksRead', JSON.stringify(readBooks));
    });
});

const checkboxes = document.querySelectorAll('#books-read input[type="checkbox"]');
const count = document.getElementById("books-count");

function updateCount() {
    const read = [...checkboxes].filter(book => book.checked).length;
    count.textContent = `${read} out of 7 read`;
}

checkboxes.forEach(book => book.addEventListener("change", updateCount));
updateCount();

const audio = document.getElementById('bg-audio');
const musicBtn = document.getElementById('play-pause-btn');
const trackSelect = document.getElementById('track-select');

function upadteVolume() {
    if (trackSelect.value.includes("rain_heavy_loud.ogg")) {
        audio.volume = 0.2;
    }
    else if (trackSelect.value.includes("daytime_forrest_bonfire.ogg")) {
        audio.volume = 0.4;
    }
    else if (trackSelect.value.includes("spring_day_forest.ogg")) {
        audio.volume = 1;
    }
    else if (trackSelect.value.includes("crickets_with_distant_traffic.ogg")) {
        audio.volume = 1;
    }
    else if (trackSelect.value.includes("warm_evening_outdoors.ogg")) {
        audio.volume = 0.8;
    }
}

musicBtn.addEventListener('click', () => {
    if (audio.paused) {
        upadteVolume();
        audio.play();
        musicBtn.textContent = 'Pause Ambience';
    } else {
        audio.pause();
        musicBtn.textContent = 'Play Ambience';
    }
})

trackSelect.addEventListener('change', () => {
    audio.src = trackSelect.value;
    console.log('Current track: ' + trackSelect.value)
    upadteVolume();
    audio.load();

    if (!audio.paused) {
        audio.play();
        musicBtn.textContent = 'Pause Ambience';
    } else {
        musicBtn.textContent = 'Play Ambience';
    }
});

upadteVolume();