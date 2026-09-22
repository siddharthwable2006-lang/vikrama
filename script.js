/* =========================================
   SMART POLE DASHBOARD
   ========================================= */


// ================= TAB SYSTEM =================

const navButtons = document.querySelectorAll(".nav-btn");
const tabs = document.querySelectorAll(".tab-content");
const pageTitle = document.getElementById("pageTitle");

const titles = {
    dashboard: "Dashboard",
    energy: "Energy Management",
    safety: "Safety Monitoring",
    communication: "Communication"
};

navButtons.forEach(button => {

    button.addEventListener("click", () => {

        const target = button.dataset.tab;

        // Remove active from buttons
        navButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        // Hide all tabs
        tabs.forEach(tab => {
            tab.classList.remove("active");
        });

        // Activate selected
        button.classList.add("active");

        document.getElementById(target).classList.add("active");

        pageTitle.textContent = titles[target];
    });

});


// ================= CLOCK =================

function updateClock() {

    const now = new Date();

    const time = now.toLocaleTimeString("en-IN", {
        hour12: false
    });

    document.getElementById("clock").textContent = time;
}

setInterval(updateClock, 1000);

updateClock();


// ================= DATA =================

let battery = 7.82;
let batteryPercent = 82;
let solar = 42.6;
let load = 18.4;
let temperature = 29.4;
let tilt = 1.8;

let packets = 1284;


// ================= RANDOM DATA =================

function randomChange(value, amount) {

    return value + (Math.random() * amount * 2 - amount);

}


// ================= UPDATE DASHBOARD =================

function updateDashboard() {

    battery = randomChange(battery, 0.03);
    solar = Math.max(0, randomChange(solar, 2));
    load = Math.max(5, randomChange(load, 1.2));
    temperature = randomChange(temperature, 0.4);
    tilt = Math.max(0, randomChange(tilt, 0.25));

    battery = Math.max(7.1, Math.min(8.4, battery));

    batteryPercent = ((battery - 7.1) / (8.4 - 7.1)) * 100;

    batteryPercent = Math.round(
        Math.max(0, Math.min(100, batteryPercent))
    );


    // Dashboard
    document.getElementById("batteryVoltage").textContent =
        battery.toFixed(2);

    document.getElementById("batteryPercent").textContent =
        batteryPercent;

    document.getElementById("solarPower").textContent =
        solar.toFixed(1);

    document.getElementById("loadPower").textContent =
        load.toFixed(1);

    document.getElementById("temperature").textContent =
        temperature.toFixed(1);


    // Energy
    document.getElementById("energySolar").textContent =
        solar.toFixed(1) + " W";

    document.getElementById("energyBattery").textContent =
        battery.toFixed(2) + " V";

    document.getElementById("energyLoad").textContent =
        load.toFixed(1) + " W";


    // Time
    document.getElementById("lastUpdate").textContent =
        new Date().toLocaleTimeString("en-IN");


    // Packets
    packets += Math.floor(Math.random() * 3);

    document.getElementById("packets").textContent =
        packets.toLocaleString();


    // RSSI
    const rssi = Math.floor(-62 - Math.random() * 15);

    document.getElementById("rssi").textContent =
        rssi + " dBm";


    // Packet loss
    const packetLoss =
        (Math.random() * 1.5).toFixed(1);

    document.getElementById("packetLoss").textContent =
        packetLoss + "%";


    updateSafety();
}


// ================= SAFETY =================

function updateSafety() {

    document.getElementById("tiltValue").textContent =
        tilt.toFixed(1) + "°";


    let progress =
        Math.min((tilt / 10) * 100, 100);

    document.getElementById("tiltProgress").style.width =
        progress + "%";


    const safetyStatus =
        document.getElementById("safetyStatus");

    const safetyBuzzer =
        document.getElementById("safetyBuzzer");

    const buzzerStatus =
        document.getElementById("buzzerStatus");


    if (tilt >= 8) {

        safetyStatus.textContent =
            "SAFETY ALERT";

        safetyStatus.style.color =
            "#ef4444";

        safetyBuzzer.textContent =
            "ON";

        safetyBuzzer.style.color =
            "#ef4444";

        buzzerStatus.textContent =
            "ON";

        buzzerStatus.style.color =
            "#ef4444";

    } else {

        safetyStatus.textContent =
            "SYSTEM SAFE";

        safetyStatus.style.color =
            "#22c55e";

        safetyBuzzer.textContent =
            "OFF";

        safetyBuzzer.style.color =
            "#22c55e";

        buzzerStatus.textContent =
            "OFF";

        buzzerStatus.style.color =
            "#22c55e";
    }

}


// ================= POLE SELECTION =================

const poleSelect =
    document.getElementById("poleSelect");

poleSelect.addEventListener("change", () => {

    const selectedPole =
        poleSelect.value;

    document.getElementById("nodeId").textContent =
        selectedPole;

});


// ================= SIMULATION =================

updateDashboard();

setInterval(updateDashboard, 2500);


// ============================================
// FUTURE REAL ESP32/ARDUINO DATA FORMAT
// ============================================

/*

When your real LoRa gateway/backend is ready,
replace the simulation above with actual data.

Example JSON:

{
    "poleId": "SP-001",
    "batteryVoltage": 7.82,
    "batteryPercent": 82,
    "solarPower": 42.6,
    "loadPower": 18.4,
    "temperature": 29.4,
    "tilt": 1.8,
    "buzzer": false,
    "lora": true,
    "rssi": -67,
    "packets": 1284,
    "packetLoss": 0.8
}

*/
