/* =========================================================
   SMART POLE MONITORING DASHBOARD
   Complete JavaScript
   ========================================================= */

// =========================
// SAFETY THRESHOLDS
// =========================
const THRESHOLDS = {
    tilt: 30.0,       // Maximum tilt in degrees
    sag: 2.0,         // Maximum sag in mm
    leakage: 0.0      // Leakage target
};


// =========================
// SENSOR DATA
// =========================
let sensorData = {
    poleId: "SP-001",

    // Safety
    tilt: 3.8,
    sag: 0.80,
    leakage: 0.00,

    // Energy
    batteryVoltage: 7.82,
    batteryPercent: 82,
    solarPower: 48.5,
    loadPower: 21.4,
    temperature: 29.4,

    // Communication
    loraConnected: true,
    rssi: -67,
    packets: 1284,
    packetLoss: 0.8
};


// =========================
// HELPER FUNCTIONS
// =========================
function get(id) {
    return document.getElementById(id);
}

function setText(id, value) {
    const element = get(id);

    if (element) {
        element.textContent = value;
    }
}


// =========================
// TAB SYSTEM
// =========================
const navButtons = document.querySelectorAll(".nav-btn");
const tabContents = document.querySelectorAll(".tab-content");
const pageTitle = get("pageTitle");

navButtons.forEach(button => {

    button.addEventListener("click", () => {

        const targetTab = button.dataset.tab;

        // Remove active class
        navButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        tabContents.forEach(tab => {
            tab.classList.remove("active");
        });

        // Activate selected tab
        button.classList.add("active");

        const selectedTab = get(targetTab);

        if (selectedTab) {
            selectedTab.classList.add("active");
        }

        // Change page title
        const title = button.querySelector("span");

        if (title && pageTitle) {
            pageTitle.textContent = title.textContent;
        }
    });

});


// =========================
// LIVE CLOCK
// =========================
function updateClock() {

    const now = new Date();

    const time = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });

    setText("clock", time);
}

setInterval(updateClock, 1000);
updateClock();


// =========================
// POLE SELECTOR
// =========================
const poleSelect = get("poleSelect");

if (poleSelect) {

    poleSelect.addEventListener("change", () => {

        sensorData.poleId = poleSelect.value;

        setText("dashboardPole", sensorData.poleId);
        setText("nodeId", sensorData.poleId);

        updateDashboard();
        updateSafety();
        updateEnergy();
        updateCommunication();

    });

}


// =========================
// SIMULATE SENSOR DATA
// =========================
// This is only for testing the dashboard.
// Replace this function later with actual
// ESP32/Arduino/LoRa data.

function simulateSensorData() {

    // -------------------------
    // Tilt
    // -------------------------
    sensorData.tilt =
        Math.max(
            0,
            sensorData.tilt + (Math.random() - 0.5) * 1.5
        );

    // Rare dangerous tilt for testing
    if (Math.random() < 0.02) {
        sensorData.tilt = 31 + Math.random() * 5;
    }


    // -------------------------
    // Conductor sag
    // -------------------------
    sensorData.sag =
        Math.max(
            0,
            sensorData.sag + (Math.random() - 0.5) * 0.25
        );

    // Rare dangerous sag
    if (Math.random() < 0.02) {
        sensorData.sag = 2.1 + Math.random() * 1;
    }


    // -------------------------
    // Leakage current
    // -------------------------
    sensorData.leakage = 0;

    // Rare leakage fault
    if (Math.random() < 0.02) {
        sensorData.leakage =
            0.05 + Math.random() * 0.20;
    }


    // -------------------------
    // Battery voltage
    // -------------------------
    sensorData.batteryVoltage +=
        (Math.random() - 0.5) * 0.08;

    sensorData.batteryVoltage =
        Math.min(
            8.4,
            Math.max(
                7.1,
                sensorData.batteryVoltage
            )
        );


    // Approximate battery percentage
    sensorData.batteryPercent =
        ((sensorData.batteryVoltage - 7.1) /
            (8.4 - 7.1)) * 100;

    sensorData.batteryPercent =
        Math.round(
            Math.min(
                100,
                Math.max(
                    0,
                    sensorData.batteryPercent
                )
            )
        );


    // -------------------------
    // Solar power
    // -------------------------
    sensorData.solarPower =
        Math.max(
            0,
            sensorData.solarPower +
            (Math.random() - 0.5) * 8
        );


    // -------------------------
    // Load power
    // -------------------------
    sensorData.loadPower =
        Math.max(
            5,
            sensorData.loadPower +
            (Math.random() - 0.5) * 3
        );


    // -------------------------
    // Temperature
    // -------------------------
    sensorData.temperature +=
        (Math.random() - 0.5) * 0.4;


    // -------------------------
    // LoRa RSSI
    // -------------------------
    sensorData.rssi =
        Math.round(
            -70 + (Math.random() * 12)
        );


    // -------------------------
    // Packet count
    // -------------------------
    sensorData.packets += 1;


    // -------------------------
    // Packet loss
    // -------------------------
    sensorData.packetLoss =
        Math.max(
            0,
            Math.min(
                10,
                sensorData.packetLoss +
                (Math.random() - 0.5) * 0.2
            )
        );

}


// =========================
// UPDATE MAIN DASHBOARD
// =========================
function updateDashboard() {

    setText(
        "dashboardPole",
        sensorData.poleId
    );

    setText(
        "batteryVoltage",
        sensorData.batteryVoltage.toFixed(2) + " V"
    );

    setText(
        "batteryPercent",
        sensorData.batteryPercent + "%"
    );

    setText(
        "solarPower",
        sensorData.solarPower.toFixed(1) + " W"
    );

    setText(
        "loadPower",
        sensorData.loadPower.toFixed(1) + " W"
    );

    setText(
        "temperature",
        sensorData.temperature.toFixed(1) + " °C"
    );

    setText(
        "dashboardTilt",
        sensorData.tilt.toFixed(1) + "°"
    );

    setText(
        "dashboardSag",
        sensorData.sag.toFixed(2) + " mm"
    );

    setText(
        "dashboardLeakage",
        sensorData.leakage.toFixed(2) + " A"
    );

    setText(
        "lastUpdate",
        "Updated just now"
    );

}


// =========================
// SAFETY TAB
// =========================
function updateSafety() {

    const tilt = sensorData.tilt;
    const sag = sensorData.sag;
    const leakage = sensorData.leakage;


    // =====================================================
    // SAFETY TAB VALUES
    // =====================================================

    // THIS IS THE PART YOU ASKED ABOUT
    setText(
        "safetyTiltValue",
        tilt.toFixed(1) + "°"
    );

    setText(
        "safetySagValue",
        sag.toFixed(2) + " mm"
    );


    // =====================================================
    // TILT
    // =====================================================

    setText(
        "tiltValue",
        tilt.toFixed(1) + "°"
    );

    const tiltProgress = get("tiltProgress");

    if (tiltProgress) {

        const tiltPercentage =
            Math.min(
                (tilt / THRESHOLDS.tilt) * 100,
                100
            );

        tiltProgress.style.width =
            tiltPercentage + "%";
    }


    if (tilt >= THRESHOLDS.tilt) {

        setText(
            "tiltStatus",
            "ALERT"
        );

    } else {

        setText(
            "tiltStatus",
            "NORMAL"
        );

    }


    // =====================================================
    // SAG
    // =====================================================

    setText(
        "sagValue",
        sag.toFixed(2) + " mm"
    );


    if (sag > THRESHOLDS.sag) {

        setText(
            "sagStatus",
            "ALERT"
        );

    } else {

        setText(
            "sagStatus",
            "NORMAL"
        );

    }


    // =====================================================
    // LEAKAGE
    // =====================================================

    setText(
        "leakageValue",
        leakage.toFixed(2) + " A"
    );


    if (leakage > THRESHOLDS.leakage) {

        setText(
            "leakageStatus",
            "LEAKAGE DETECTED"
        );

    } else {

        setText(
            "leakageStatus",
            "SAFE"
        );

    }


    // =====================================================
    // OVERALL SAFETY
    // =====================================================

    checkSystemSafety();

}


// =========================
// CHECK OVERALL SAFETY
// =========================
function checkSystemSafety() {

    const tiltDanger =
        sensorData.tilt >= THRESHOLDS.tilt;

    const sagDanger =
        sensorData.sag > THRESHOLDS.sag;

    const leakageDanger =
        sensorData.leakage > THRESHOLDS.leakage;


    const danger =
        tiltDanger ||
        sagDanger ||
        leakageDanger;


    if (danger) {

        setText(
            "safetyStatus",
            "⚠️ FAULT DETECTED"
        );

        setText(
            "safetyText",
            getFaultMessage()
        );

        setText(
            "overviewSafety",
            "FAULT"
        );

        setText(
            "buzzerStatus",
            "ON"
        );

        setText(
            "safetyBuzzer",
            "ON"
        );

        updateBuzzer(true);

    } else {

        setText(
            "safetyStatus",
            "✓ SYSTEM SAFE"
        );

        setText(
            "safetyText",
            "All safety parameters are within limits."
        );

        setText(
            "overviewSafety",
            "SAFE"
        );

        setText(
            "buzzerStatus",
            "OFF"
        );

        setText(
            "safetyBuzzer",
            "OFF"
        );

        updateBuzzer(false);

    }

}


// =========================
// FAULT MESSAGE
// =========================
function getFaultMessage() {

    const faults = [];


    if (
        sensorData.tilt >=
        THRESHOLDS.tilt
    ) {

        faults.push(
            "Pole tilt exceeded 30°"
        );

    }


    if (
        sensorData.sag >
        THRESHOLDS.sag
    ) {

        faults.push(
            "Conductor sag exceeded 2 mm"
        );

    }


    if (
        sensorData.leakage >
        THRESHOLDS.leakage
    ) {

        faults.push(
            "Leakage current detected"
        );

    }


    return faults.join(" | ");

}


// =========================
// BUZZER
// =========================
function updateBuzzer(state) {

    const buzzer =
        get("safetyBuzzer");

    if (!buzzer) {
        return;
    }


    if (state) {

        buzzer.classList.add("active");

    } else {

        buzzer.classList.remove("active");

    }

}


// =========================
// ENERGY TAB
// =========================
function updateEnergy() {

    const solarEnergy =
        (sensorData.solarPower / 1000)
        .toFixed(2) + " kWh";

    setText(
        "energySolarValue",
        solarEnergy
    );


    setText(
        "energyBatteryPercent",
        sensorData.batteryPercent + "%"
    );


    setText(
        "energySolar",
        sensorData.solarPower.toFixed(1) + " W"
    );


    setText(
        "energyBattery",
        sensorData.batteryPercent + "%"
    );


    setText(
        "energyLoad",
        sensorData.loadPower.toFixed(1) + " W"
    );


    updatePowerMode();

}


// =========================
// DAY / NIGHT POWER MODE
// =========================
function updatePowerMode() {

    const hour =
        new Date().getHours();


    const dayMode =
        hour >= 6 &&
        hour < 18;


    const icon =
        get("powerModeIcon");


    if (dayMode) {

        setText(
            "powerModeTitle",
            "Solar Power Mode"
        );

        setText(
            "powerModeText",
            "Solar panel is supplying the system and charging the battery."
        );


        if (icon) {
            icon.textContent = "☀️";
        }

    } else {

        setText(
            "powerModeTitle",
            "Battery Power Mode"
        );

        setText(
            "powerModeText",
            "Battery is supplying the system during night operation."
        );


        if (icon) {
            icon.textContent = "🌙";
        }

    }

}


// =========================
// COMMUNICATION TAB
// =========================
function updateCommunication() {

    setText(
        "nodeId",
        sensorData.poleId
    );


    setText(
        "rssi",
        sensorData.rssi + " dBm"
    );


    setText(
        "packets",
        sensorData.packets
    );


    setText(
        "packetLoss",
        sensorData.packetLoss.toFixed(1) + "%"
    );


    if (sensorData.loraConnected) {

        setText(
            "communicationStatus",
            "CONNECTED"
        );

    } else {

        setText(
            "communicationStatus",
            "DISCONNECTED"
        );

    }

}


// =========================
// MAIN UPDATE FUNCTION
// =========================
function updateAll() {

    simulateSensorData();

    updateDashboard();

    updateSafety();

    updateEnergy();

    updateCommunication();

}


// =========================
// INITIAL LOAD
// =========================
updateDashboard();
updateSafety();
updateEnergy();
updateCommunication();


// =========================
// UPDATE EVERY 2.5 SECONDS
// =========================
setInterval(
    updateAll,
    2500
);
