// Request Notification Permission
function requestNotificationPermission() {
    Notification.requestPermission().then(permission => {
        if (permission === "granted") {
            console.log("Notification permission granted.");
        } else {
            console.error("Notification permission denied.");
        }
    });
}

// Function to get prayer times
document.getElementById("get-location").addEventListener("click", getPrayerTimes);

function getPrayerTimes() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    fetchPrayerTimes(lat, lon);
}

function showError(error) {
    alert("Unable to retrieve your location. Please allow location access.");
}

async function fetchPrayerTimes(lat, lon) {
    try {
        const response = await fetch(`https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}&method=2`);
        const data = await response.json();
        displayPrayerTimes(data.data.timings);
    } catch (error) {
        console.error("Error fetching prayer times:", error);
        alert("Could not fetch prayer times. Please try again.");
    }
}

function displayPrayerTimes(timings) {
    const timesList = document.getElementById("times-list");
    timesList.innerHTML = ""; // Clear previous times

    for (const [prayer, time] of Object.entries(timings)) {
        const li = document.createElement("li");
        li.textContent = `${prayer}: ${time}`;
        timesList.appendChild(li);
        scheduleNotification(prayer, time);
    }
}

function scheduleNotification(prayer, time) {
    const prayerTime = new Date();
    const [hours, minutes] = time.split(":");
    prayerTime.setHours(hours, minutes, 0);

    const now = new Date();
    const delay = prayerTime - now;

    if (delay > 0) {
        setTimeout(() => {
            new Notification(`${prayer} Reminder`, {
                body: `It's time for ${prayer}.`,
                icon: "https://via.placeholder.com/100" // Replace with your app's icon URL
            });
        }, delay);
    }
}

// Request notification permissions on page load
requestNotificationPermission();
