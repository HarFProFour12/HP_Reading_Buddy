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
    "Gryffindor": "images/gryffindor.jpg",
    "Slytherin": "images/slytherin.jpg",
    "Hufflepuff": "images/hufflepuff.jpg",
    "Ravenclaw": "images/ravenclaw.jpg"
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

const house = localStorage.getItem("house");

if (house && document.querySelector(".house")) {
    window.location.replace("home.html");
}

if (document.getElementById("main-app") && accents[house]) {
    document.documentElement.style.setProperty("--accent", accents[house]);
    document.documentElement.style.setProperty("--comp", comps[house]);
    document.body.style.backgroundImage = `url("${backgrounds[house]}")`;

    if (slogan) slogan.innerText = slogans[house];
    if (welcome) welcome.innerText = "Welcome back, " + house + "!";
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

    localStorage.setItem("active-session-seconds", seconds);
    updateDailyGoal();
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

    updateDailyGoal();
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
    localStorage.setItem("daily-reading-date", getTodayKey());
    localStorage.setItem("daily-reading-seconds", getTodayReadingSeconds() + seconds);

    let completedSessions = Number(localStorage.getItem("completed-sessions")) || 0;

    localStorage.setItem("completed-sessions", completedSessions + 1);

    const today = new Date().toLocaleDateString("en-CA");
    const lastReadingDate = localStorage.getItem("last-reading-date")

    let streak = Number(localStorage.getItem("reading-streak")) || 0;

    if (lastReadingDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        const yesterdayString = yesterday.toLocaleDateString("en-CA")

        if (lastReadingDate === yesterdayString) {
            streak ++
        } else {
            streak = 1
        }

        localStorage.setItem("last-reading-date", today);
        localStorage.setItem("reading-streak", streak)
    }

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

if (document.getElementById("timer-display")) {
    document.getElementById("start-pause").addEventListener("click", toggleTimer);
    document.getElementById("reset").addEventListener("click", resetTimer);
    document.getElementById("finish").addEventListener("click", finishAndSave);

    updateTimer();

    if (sessionStarted) {
        document.getElementById("start-pause").textContent = "Resume";
        document.getElementById("reset").hidden = false;
        document.getElementById("finish").hidden = false;
    }
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
    if (!count) return;

    const read = [...checkboxes].filter(book => book.checked).length;
    count.textContent = `${read} out of 7 read`;
}

checkboxes.forEach(book => book.addEventListener("change", updateCount));
updateCount();

const audio = document.getElementById('bg-audio');
const musicBtn = document.getElementById('play-pause-btn');
const trackSelect = document.getElementById('track-select');

function updateVolume() {
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

if (audio && musicBtn && trackSelect) {
    musicBtn.addEventListener('click', () => {
        if (audio.paused) {
            updateVolume();
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
        updateVolume();
        audio.load();

        if (!audio.paused) {
            audio.play();
            musicBtn.textContent = 'Pause Ambience';
        } else {
            musicBtn.textContent = 'Play Ambience';
        }
    });

    updateVolume();
}

function getReadingStats() {
    const totalSeconds = Number(localStorage.getItem("total-time")) || 0;
    const totalSessions = Number(localStorage.getItem("completed-sessions")) || 0;
    const booksRead = JSON.parse(localStorage.getItem("booksRead") || "[]");

    return {
        totalSeconds, 
        totalSessions, 
        booksRead: booksRead.length
    };
}

function formatReadingTime(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    return `${hours}h ${minutes}m`;
}

// Stats Page

function updateStats() {
    const stats = getReadingStats()

    const timeElement = document.getElementById("total-reading-time");
    const sessionsElements = document.getElementById("total-sessions");
    const booksElement = document.getElementById("completed-books");

    if (timeElement) {
        timeElement.textContent = formatReadingTime(stats.totalSeconds)
    }

    if (sessionsElements) {
        sessionsElements.textContent = stats.totalSessions;
    }

    if (booksElement) {
        booksElement.textContent = `${stats.booksRead} / 7`;
    }

    const streakElement = document.getElementById("reading-streak");

    if (streakElement) {
        const streak = Number(localStorage.getItem("reading-streak")) || 0;
        streakElement.textContent = `${streak} ${streak === 1 ? "day" : "days"}`;
    }
}

// Achievements Page

function updateAchievements() {
    const stats = getReadingStats();

    const achievements = [
        {
            id: "first-session",
            unlocked: stats.totalSessions >= 1,
            progress: `${Math.min(stats.totalSessions, 1)} / 1 session`
        },
        {
            id: "time-turner",
            unlocked: stats.totalSeconds >= 3600,
            progress: `${Math.min(Math.floor(stats.totalSeconds / 60), 60)} / 60 minutes`
        },
        {
            id: "night-owl",
            unlocked: stats.totalSessions >= 3,
            progress: `${Math.min(stats.totalSessions, 3)} / 3 sessions`
        },
        {
            id: "bookworm",
            unlocked: stats.totalSeconds >= 18000,
            progress: `${Math.min(Math.floor(stats.totalSeconds / 60), 300)} / 300 minutes`
        },
        {
            id: "dedicated-reader",
            unlocked: stats.totalSessions >= 7,
            progress: `${Math.min(stats.totalSessions, 7)} / 7 sessions`
        },
        {
            id: "halfway-there",
            unlocked: stats.booksRead >= 4,
            progress: `${Math.min(stats.booksRead, 4)} / 4 books`
        },
        {
            id: "series-complete",
            unlocked: stats.booksRead >= 7,
            progress: `${Math.min(stats.booksRead, 7)} / 7 books`
        },
        {
            id: "hogwarts-scholar",
            unlocked: stats.totalSeconds >= 36000,
            progress: `${Math.min(Math.floor(stats.totalSeconds / 60), 600)} / 600 minutes`
        }
    ];

    let unlockedCount = 0;

    achievements.forEach(achievement => {
        const card = document.getElementById(achievement.id);

        if (!card) return;

        const status = card.querySelector(".achievement-status");

        card.classList.toggle("locked", !achievement.unlocked);
        card.classList.toggle("unlocked", achievement.unlocked);

        if (achievement.unlocked) {
            unlockedCount++;
        }

        if (status) {
            status.textContent = achievement.unlocked
                ? "Unlocked"
                : achievement.progress;
        }
    });

    const summary = document.getElementById("achievement-summary");

    if (summary) {
        summary.textContent =
            `${unlockedCount} of ${achievements.length} achievements unlocked`;
    }
}

updateStats();
updateAchievements();


function getTodayKey() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function getTodayReadingSeconds() {
    if (localStorage.getItem("daily-reading-date") !== getTodayKey()) {
        return 0;
    }

    return Number(localStorage.getItem("daily-reading-seconds")) || 0;
}å

function updateDailyGoal() {
    const goalText = document.getElementById("daily-goal-text");
    if (!goalText) return;

    const savedSeconds = getTodayReadingSeconds();
    const currentSeconds = sessionStarted ? seconds: 0;
    const totalMinutes = Math.floor((savedSeconds + currentSeconds) / 60);
    const goalMinutes = Number(localStorage.getItem("reading-goal")) || 20;

    goalText.textContent = `Today's goal: ${Math.min(totalMinutes, goalMinutes)} / ${goalMinutes} min`;
}