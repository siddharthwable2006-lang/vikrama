/* =========================================================
   SMART POLE MONITORING DASHBOARD
   CLEAN JAVASCRIPT
   ========================================================= */


/* =========================================================
   SAFETY LIMITS
   ========================================================= */

const LIMITS = {

    tilt: 30,

    sag: 2,

    leakage: 0

};


/* =========================================================
   CURRENT DATA
   ========================================================= */

let data = {

    poleId: "SP-001",

    tilt: 5.2,

    sag: 0.85,

    leakage: 0,

    batteryVoltage: 7.82,

    batteryPercent: 82,

    solarPower: 48.5,

    loadPower: 21.4,

    temperature: 29.4,

    rssi: -64,

    packets: 1284,

    packetLoss: 0.4,

    loraConnected: true

};


/* =========================================================
   HELPER
   ========================================================= */

function setText(id, value) {

    const element = document.getElementById(id);

    if (element) {

        element.textContent = value;

    }

}


/* =========================================================
   TAB SWITCHING
   ========================================================= */

const buttons =
    document.querySelectorAll(".nav-btn");

const tabs =
    document.querySelectorAll(".tab-content");

const pageTitle =
    document.getElementById("pageTitle");


buttons.forEach(button => {

    button.addEventListener("click", function () {

        const target =
            this.getAttribute("data-tab");


        buttons.forEach(btn => {

            btn.classList.remove("active");

        });


        tabs.forEach(tab => {

            tab.classList.remove("active");

        });


        this.classList.add("active");


        const targetElement =
            document.getElementById(target);


        if (targetElement) {

            targetElement.classList.add("active");

        }


        const text =
            this.textContent.trim();


        if (pageTitle) {

            pageTitle.textContent = text;

        }

    });

});


/* =========================================================
   CLOCK
   ========================================================= */

function updateClock() {

    const now = new Date();

    const time =
        now.toLocaleTimeString(
            [],
            {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            }
        );

    setText("clock", time);

}


setInterval(updateClock, 1000);

updateClock();


/* =========================================================
   POLE SELECTOR
   ========================================================= */

const poleSelect =
    document.getElementById("poleSelect");


if (poleSelect) {

    poleSelect.addEventListener(
        "change",
        function () {

            data.poleId =
                this.value;

            updateEverything();

        }
    );

}


/* =========================================================
   SIMULATED DATA
   ========================================================= */

function simulateData() {


    /* ---------- TILT ---------- */

    data.tilt +=
        (Math.random() - 0.5) * 1.2;


    data.tilt =
        Math.max(
            0,
            Math.min(
                35,
                data.tilt
            )
        );


    /* ---------- SAG ---------- */

    data.sag +=
        (Math.random() - 0.5) * 0.12;


    data.sag =
        Math.max(
            0,
            Math.min(
                3,
                data.sag
            )
        );


    /* ---------- LEAKAGE ---------- */

    /*
       Normally 0 A.
       Occasionally creates a small fault
       so you can test the alarm.
    */

    if (Math.random() < 0.03) {

        data.leakage =
            Number(
                (0.05 + Math.random() * 0.15)
                .toFixed(2)
            );

    } else {

        data.leakage = 0;

    }


    /* ---------- BATTERY ---------- */

    data.batteryVoltage +=
        (Math.random() - 0.5) * 0.05;


    data.batteryVoltage =
        Math.max(
            7.1,
            Math.min(
                8.4,
                data.batteryVoltage
            )
        );


    data.batteryPercent =
        Math.round(
            (
                (data.batteryVoltage - 7.1)
                /
                (8.4 - 7.1)
            ) * 100
        );


    /* ---------- SOLAR ---------- */

    data.solarPower +=
        (Math.random() - 0.5) * 5;


    data.solarPower =
        Math.max(
            0,
            data.solarPower
        );


    /* ---------- LOAD ---------- */

    data.loadPower +=
        (Math.random() - 0.5) * 2;


    data.loadPower =
        Math.max(
            5,
            data.loadPower
        );


    /* ---------- TEMPERATURE ---------- */

    data.temperature +=
        (Math.random() - 0.5) * 0.3;


    /* ---------- LORA ---------- */

    data.rssi =
        Math.round(
            -70 + Math.random() * 12
        );


    data.packets += 1;


    data.packetLoss =
        Number(
            Math.max(
                0,
                data.packetLoss +
                (Math.random() - 0.5) * 0.1
            ).toFixed(1)
        );

}


/* =========================================================
   DASHBOARD
   ========================================================= */

function updateDashboard() {


    setText(
        "dashboardPole",
        data.poleId
    );


    setText(
        "batteryVoltage",
        data.batteryVoltage.toFixed(2) + " V"
    );


    setText(
        "batteryPercent",
        data.batteryPercent + "%"
    );


    setText(
        "solarPower",
        data.solarPower.toFixed(1) + " W"
    );


    setText(
        "loadPower",
        data.loadPower.toFixed(1) + " W"
    );


    setText(
        "temperature",
        data.temperature.toFixed(1) + " °C"
    );


    setText(
        "dashboardTilt",
        data.tilt.toFixed(1) + "°"
    );


    setText(
        "dashboardSag",
        data.sag.toFixed(2) + " mm"
    );


    setText(
        "dashboardLeakage",
        data.leakage.toFixed(2) + " A"
    );


    const fault =
        isFault();


    setText(
        "overviewSafety",
        fault ? "FAULT" : "SAFE"
    );


    setText(
        "buzzerStatus",
        fault ? "ON" : "OFF"
    );


    setText(
        "lastUpdate",
        "Updated: " +
        new Date().toLocaleTimeString()
    );


    updatePowerMode();

}


/* =========================================================
   SAFETY
   ========================================================= */

function updateSafety() {


    const tilt =
        data.tilt;

    const sag =
        data.sag;

    const leakage =
        data.leakage;


    /* ---------- TILT ---------- */

    setText(
        "safetyTiltValue",
        tilt.toFixed(1) + "°"
    );


    setText(
        "tiltStatus",
        tilt >= LIMITS.tilt
            ? "ALERT"
            : "NORMAL"
    );


    const progress =
        document.getElementById(
            "tiltProgress"
        );


    if (progress) {

        const percentage =
            Math.min(
                100,
                (tilt / LIMITS.tilt) * 100
            );


        progress.style.width =
            percentage + "%";

    }


    /* ---------- SAG ---------- */

    setText(
        "safetySagValue",
        sag.toFixed(2) + " mm"
    );


    setText(
        "sagStatus",
        sag > LIMITS.sag
            ? "ALERT"
            : "NORMAL"
    );


    /* ---------- LEAKAGE ---------- */

    setText(
        "leakageValue",
        leakage.toFixed(2) + " A"
    );


    setText(
        "leakageStatus",
        leakage > 0
            ? "LEAKAGE DETECTED"
            : "SAFE"
    );


    /* ---------- OVERALL ---------- */

    const fault =
        isFault();


    if (fault) {

        setText(
            "safetyStatus",
            "⚠ FAULT DETECTED"
        );


        setText(
            "safetyText",
            getFaultMessage()
        );


        setText(
            "safetyBuzzer",
            "ON"
        );


        setText(
            "alarmState",
            "ACTIVE"
        );

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
            "safetyBuzzer",
            "OFF"
        );


        setText(
            "alarmState",
            "READY"
        );

    }

}


/* =========================================================
   FAULT CHECK
   ========================================================= */

function isFault() {

    return (

        data.tilt >= LIMITS.tilt ||

        data.sag > LIMITS.sag ||

        data.leakage > LIMITS.leakage

    );

}


/* =========================================================
   FAULT MESSAGE
   ========================================================= */

function getFaultMessage() {

    const faults = [];


    if (data.tilt >= LIMITS.tilt) {

        faults.push(
            "Pole tilt exceeded 30°"
        );

    }


    if (data.sag > LIMITS.sag) {

        faults.push(
            "Conductor sag exceeded 2 mm"
        );

    }


    if (data.leakage > 0) {

        faults.push(
            "Leakage current detected"
        );

    }


    return faults.join(" | ");

}


/* =========================================================
   ENERGY
   ========================================================= */

function updateEnergy() {


    setText(
        "energySolar",
        data.solarPower.toFixed(1) + " W"
    );


    setText(
        "energySolarValue",
        (
            data.solarPower / 1000
        ).toFixed(2) + " kWh"
    );


    setText(
        "energyBattery",
        data.batteryPercent + "%"
    );


    setText(
        "energyBatteryPercent",
        data.batteryPercent + "%"
    );


    setText(
        "energyLoad",
        data.loadPower.toFixed(1) + " W"
    );


    setText(
        "energyFlowSolar",
        data.solarPower.toFixed(1) + " W"
    );


    setText(
        "energyFlowBattery",
        data.batteryPercent + "%"
    );


    setText(
        "energyFlowLoad",
        data.loadPower.toFixed(1) + " W"
    );

}


/* =========================================================
   POWER MODE
   ========================================================= */

function updatePowerMode() {


    const hour =
        new Date().getHours();


    const daytime =
        hour >= 6 &&
        hour < 18;


    if (daytime) {

        setText(
            "powerModeTitle",
            "Solar Power Mode"
        );


        setText(
            "powerModeText",
            "Solar is supplying the system and charging the battery."
        );


        setText(
            "powerModeIcon",
            "☀️"
        );

    } else {

        setText(
            "powerModeTitle",
            "Battery Power Mode"
        );


        setText(
            "powerModeText",
            "Battery is supplying the system during night operation."
        );


        setText(
            "powerModeIcon",
            "🌙"
        );

    }


    setText(
        "flowSolar",
        data.solarPower.toFixed(1) + " W"
    );


    setText(
        "flowBattery",
        data.batteryPercent + "%"
    );


    setText(
        "flowLoad",
        data.loadPower.toFixed(1) + " W"
    );

}


/* =========================================================
   COMMUNICATION
   ========================================================= */

function updateCommunication() {


    setText(
        "nodeId",
        data.poleId
    );


    setText(
        "rssi",
        data.rssi + " dBm"
    );


    setText(
        "packets",
        data.packets
    );


    setText(
        "packetLoss",
        data.packetLoss.toFixed(1) + "%"
    );


    setText(
        "communicationStatus",
        data.loraConnected
            ? "CONNECTED"
            : "DISCONNECTED"
    );

}


/* =========================================================
   UPDATE EVERYTHING
   ========================================================= */

function updateEverything() {

    updateDashboard();

    updateSafety();

    updateEnergy();

    updateCommunication();

}


/* =========================================================
   INITIAL START
   ========================================================= */

updateEverything();


/* =========================================================
   SIMULATE NEW DATA EVERY 2.5 SECONDS
   ========================================================= */

setInterval(
    function () {

        simulateData();

        updateEverything();

    },
    2500
);
