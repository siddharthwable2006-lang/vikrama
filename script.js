/* ============================================================
   SMART POLE MONITORING SYSTEM
   VIKRAMA - SIH 2026

   Sensors:
   MPU6050        -> Pole Tilt
   Ultrasonic     -> Conductor Sag
   ACS712         -> Leakage Current

   Energy:
   Solar Panel    -> Battery Charging + System Load
   Battery        -> Night-time System Supply

   ============================================================ */


/* ============================================================
   PROJECT THRESHOLDS
============================================================ */

const THRESHOLDS = {

    // Maximum acceptable pole tilt
    tilt: 30.0,

    // Maximum conductor sag deviation
    sag: 2.0,

    // No leakage current should be flowing through pole
    leakage: 0.0

};


/* ============================================================
   SIMULATED SENSOR DATA
============================================================ */

let sensorData = {

    poleId: "SP-001",

    tilt: 3.8,

    sag: 0.8,

    leakage: 0.00,

    batteryVoltage: 7.82,

    batteryPercent: 82,

    solarPower: 48.5,

    loadPower: 21.4,

    temperature: 29.4,

    loraConnected: true,

    rssi: -67,

    packets: 1284,

    packetLoss: 0.8

};


/* ============================================================
   DOM HELPER
============================================================ */

function get(id) {

    return document.getElementById(id);

}


/* ============================================================
   TAB SYSTEM
============================================================ */

const navButtons =
    document.querySelectorAll(".nav-btn");

const tabs =
    document.querySelectorAll(".tab-content");

const pageTitle =
    get("pageTitle");


const pageTitles = {

    dashboard: "Dashboard",

    energy: "Energy Management",

    safety: "Safety Monitoring",

    communication: "Communication"

};


navButtons.forEach(button => {

    button.addEventListener("click", () => {

        const target =
            button.dataset.tab;


        navButtons.forEach(btn => {

            btn.classList.remove("active");

        });


        tabs.forEach(tab => {

            tab.classList.remove("active");

        });


        button.classList.add("active");


        const selectedTab =
            document.getElementById(target);


        if (selectedTab) {

            selectedTab.classList.add("active");

        }


        pageTitle.textContent =
            pageTitles[target];

    });

});


/* ============================================================
   LIVE CLOCK
============================================================ */

function updateClock() {

    const now =
        new Date();


    const time =
        now.toLocaleTimeString(
            "en-IN",
            {
                hour12: false
            }
        );


    if (get("clock")) {

        get("clock").textContent =
            time;

    }

}


setInterval(updateClock, 1000);

updateClock();


/* ============================================================
   RANDOM SENSOR SIMULATION
============================================================ */

function randomVariation(
    value,
    variation
) {

    return value +
        (
            Math.random() *
            variation * 2
        ) -
        variation;

}


/* ============================================================
   SIMULATE SENSOR DATA
============================================================ */

function simulateSensors() {

    sensorData.tilt =
        Math.max(
            0,
            randomVariation(
                sensorData.tilt,
                0.8
            )
        );


    sensorData.sag =
        Math.max(
            0,
            randomVariation(
                sensorData.sag,
                0.12
            )
        );


    /*
       Normally leakage should remain 0.

       Occasionally a very small simulated
       leakage value is generated so that
       the dashboard alert system can be tested.
    */

    if (Math.random() < 0.03) {

        sensorData.leakage =
            Number(
                (Math.random() * 0.15)
                .toFixed(2)
            );

    } else {

        sensorData.leakage = 0;

    }


    sensorData.batteryVoltage =
        randomVariation(
            sensorData.batteryVoltage,
            0.025
        );


    sensorData.batteryVoltage =
        Math.max(
            7.1,
            Math.min(
                8.4,
                sensorData.batteryVoltage
            )
        );


    sensorData.batteryPercent =
        Math.round(
            (
                (
                    sensorData.batteryVoltage -
                    7.1
                ) /
                (
                    8.4 -
                    7.1
                )
            ) * 100
        );


    sensorData.solarPower =
        Math.max(
            0,
            randomVariation(
                sensorData.solarPower,
                4
            )
        );


    sensorData.loadPower =
        Math.max(
            5,
            randomVariation(
                sensorData.loadPower,
                1.5
            )
        );


    sensorData.temperature =
        randomVariation(
            sensorData.temperature,
            0.3
        );


    sensorData.rssi =
        Math.round(
            randomVariation(
                sensorData.rssi,
                3
            )
        );


    sensorData.packets +=
        Math.floor(
            Math.random() * 3
        );


    sensorData.packetLoss =
        Number(
            (
                Math.random() * 1.5
            ).toFixed(1)
        );


    updateAllDisplays();

}


/* ============================================================
   UPDATE ALL DASHBOARD VALUES
============================================================ */

function updateAllDisplays() {

    updateDashboard();

    updateSafety();

    updateEnergy();

    updateCommunication();

    updatePowerMode();

}


/* ============================================================
   DASHBOARD
============================================================ */

function updateDashboard() {

    setText(
        "batteryVoltage",
        sensorData.batteryVoltage.toFixed(2)
    );


    setText(
        "batteryPercent",
        sensorData.batteryPercent
    );


    setText(
        "solarPower",
        sensorData.solarPower.toFixed(1)
    );


    setText(
        "loadPower",
        sensorData.loadPower.toFixed(1)
    );


    setText(
        "temperature",
        sensorData.temperature.toFixed(1)
    );


    setText(
        "lastUpdate",
        new Date().toLocaleTimeString("en-IN")
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

}


/* ============================================================
   SAFETY MONITORING
============================================================ */

function updateSafety() {

    const tilt =
        sensorData.tilt;

    const sag =
        sensorData.sag;

    const leakage =
        sensorData.leakage;


    /* -----------------------------
       TILT
    ----------------------------- */

    setText(
        "tiltValue",
        tilt.toFixed(1) + "°"
    );


    const tiltProgress =
        Math.min(
            (tilt /
                THRESHOLDS.tilt) *
            100,
            100
        );


    const progress =
        get("tiltProgress");


    if (progress) {

        progress.style.width =
            tiltProgress + "%";

    }


    /* -----------------------------
       TILT STATUS
    ----------------------------- */

    let tiltOK =
        tilt < THRESHOLDS.tilt;


    setStatus(
        "tiltStatus",
        tiltOK,
        "NORMAL",
        "ALERT"
    );


    /* -----------------------------
       SAG
    ----------------------------- */

    setText(
        "sagValue",
        sag.toFixed(2) + " mm"
    );


    setStatus(
        "sagStatus",
        sag <= THRESHOLDS.sag,
        "NORMAL",
        "ALERT"
    );


    /* -----------------------------
       LEAKAGE
    ----------------------------- */

    setText(
        "leakageValue",
        leakage.toFixed(2) + " A"
    );


    setStatus(
        "leakageStatus",
        leakage <= THRESHOLDS.leakage,
        "SAFE",
        "LEAKAGE DETECTED"
    );


    /* -----------------------------
       OVERALL SAFETY
    ----------------------------- */

    const systemSafe =
        tiltOK &&
        sag <= THRESHOLDS.sag &&
        leakage <= THRESHOLDS.leakage;


    const safetyTitle =
        get("safetyStatus");


    const safetyText =
        get("safetyText");


    const safetyIcon =
        document.querySelector(
            ".safety-icon"
        );


    if (systemSafe) {

        if (safetyTitle) {

            safetyTitle.textContent =
                "SYSTEM SAFE";

            safetyTitle.style.color =
                "#22c55e";

        }


        if (safetyText) {

            safetyText.textContent =
                "All monitored parameters are within their defined thresholds.";

        }


        if (safetyIcon) {

            safetyIcon.style.color =
                "#22c55e";

        }


        updateBuzzer(false);

    } else {

        if (safetyTitle) {

            safetyTitle.textContent =
                "SAFETY ALERT";

            safetyTitle.style.color =
                "#ef4444";

        }


        if (safetyText) {

            safetyText.textContent =
                getFaultMessage();

        }


        if (safetyIcon) {

            safetyIcon.style.color =
                "#ef4444";

        }


        updateBuzzer(true);

    }

}


/* ============================================================
   FAULT MESSAGE
============================================================ */

function getFaultMessage() {

    const faults = [];


    if (
        sensorData.tilt >=
        THRESHOLDS.tilt
    ) {

        faults.push(
            "Pole tilt exceeds 30°"
        );

    }


    if (
        sensorData.sag >
        THRESHOLDS.sag
    ) {

        faults.push(
            "Conductor sag exceeds +2 mm"
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


    return faults.join(" • ");

}


/* ============================================================
   BUZZER
============================================================ */

function updateBuzzer(alert) {

    const buzzer =
        get("buzzerStatus");

    const safetyBuzzer =
        get("safetyBuzzer");


    if (alert) {

        setText(
            "buzzerStatus",
            "ON"
        );

        setText(
            "safetyBuzzer",
            "ON"
        );


        if (buzzer) {

            buzzer.className =
                "red";

        }


        if (safetyBuzzer) {

            safetyBuzzer.className =
                "red";

        }

    } else {

        setText(
            "buzzerStatus",
            "OFF"
        );

        setText(
            "safetyBuzzer",
            "OFF"
        );


        if (buzzer) {

            buzzer.className =
                "green";

        }


        if (safetyBuzzer) {

            safetyBuzzer.className =
                "green";

        }

    }

}


/* ============================================================
   ENERGY MANAGEMENT
============================================================ */

function updateEnergy() {

    setText(
        "energySolar",
        sensorData.solarPower.toFixed(1) +
        " W"
    );


    setText(
        "energyBattery",
        sensorData.batteryVoltage.toFixed(2) +
        " V"
    );


    setText(
        "energyLoad",
        sensorData.loadPower.toFixed(1) +
        " W"
    );

}


/* ============================================================
   DAY / NIGHT POWER MANAGEMENT
============================================================ */

function updatePowerMode() {

    const hour =
        new Date().getHours();


    const modeTitle =
        get("powerModeTitle");

    const modeText =
        get("powerModeText");

    const modeIcon =
        get("powerModeIcon");


    /*
       Day:
       Solar powers system
       + charges battery.

       Night:
       Battery powers system.
    */

    if (
        hour >= 6 &&
        hour < 18
    ) {

        if (modeTitle) {

            modeTitle.textContent =
                "DAY MODE • SOLAR POWER";

        }


        if (modeText) {

            modeText.textContent =
                "Solar panel is supplying the system and charging the battery.";

        }


        if (modeIcon) {

            modeIcon.innerHTML =
                '<i class="fa-solid fa-sun"></i>';

        }

    } else {

        if (modeTitle) {

            modeTitle.textContent =
                "NIGHT MODE • BATTERY POWER";

        }


        if (modeText) {

            modeText.textContent =
                "Solar generation is unavailable. Battery is supplying the system.";

        }


        if (modeIcon) {

            modeIcon.innerHTML =
                '<i class="fa-solid fa-battery-half"></i>';

        }

    }

}


/* ============================================================
   COMMUNICATION
============================================================ */

function updateCommunication() {

    setText(
        "nodeId",
        sensorData.poleId
    );


    setText(
        "rssi",
        sensorData.rssi +
        " dBm"
    );


    setText(
        "packets",
        sensorData.packets.toLocaleString()
    );


    setText(
        "packetLoss",
        sensorData.packetLoss +
        "%"
    );


    const communicationStatus =
        get("communicationStatus");


    if (
        sensorData.loraConnected
    ) {

        if (communicationStatus) {

            communicationStatus.textContent =
                "CONNECTED";

            communicationStatus.style.color =
                "#22c55e";

        }

    } else {

        if (communicationStatus) {

            communicationStatus.textContent =
                "DISCONNECTED";

            communicationStatus.style.color =
                "#ef4444";

        }

    }

}


/* ============================================================
   POLE SELECTOR
============================================================ */

const poleSelect =
    get("poleSelect");


if (poleSelect) {

    poleSelect.addEventListener(
        "change",
        () => {

            sensorData.poleId =
                poleSelect.value;


            setText(
                "nodeId",
                sensorData.poleId
            );

        }
    );

}


/* ============================================================
   HELPER: SET TEXT
============================================================ */

function setText(
    id,
    value
) {

    const element =
        get(id);


    if (element) {

        element.textContent =
            value;

    }

}


/* ============================================================
   HELPER: STATUS
============================================================ */

function setStatus(
    id,
    normal,
    normalText,
    alertText
) {

    const element =
        get(id);


    if (!element) {

        return;

    }


    element.textContent =
        normal
            ? normalText
            : alertText;


    element.classList.remove(
        "green",
        "red",
        "yellow"
    );


    element.classList.add(
        normal
            ? "green"
            : "red"
    );

}


/* ============================================================
   START SYSTEM
============================================================ */

updateAllDisplays();


/*
   Update every 2.5 seconds.

   In the final hardware version,
   replace simulateSensors() with
   actual ESP32/LoRa/API data.
*/

setInterval(
    simulateSensors,
    2500
);


/* ============================================================
   REAL DATA FORMAT
============================================================

   Your ESP32/LoRa gateway/backend can eventually
   send data in this format:

   {
       "poleId": "SP-001",

       "tilt": 4.7,

       "sag": 1.2,

       "leakage": 0.00,

       "batteryVoltage": 7.82,

       "batteryPercent": 82,

       "solarPower": 48.5,

       "loadPower": 21.4,

       "temperature": 29.4,

       "loraConnected": true,

       "rssi": -67,

       "packets": 1284,

       "packetLoss": 0.8
   }

   ============================================================ */


/* ============================================================
   SAFETY LOGIC FOR REAL HARDWARE
============================================================

   POLE TILT:

   tilt < 30°
       -> NORMAL

   tilt >= 30°
       -> ALERT
       -> BUZZER ON


   CONDUCTOR SAG:

   sag <= +2 mm
       -> NORMAL

   sag > +2 mm
       -> ALERT
       -> BUZZER ON


   LEAKAGE CURRENT:

   leakage = 0 A
       -> SAFE

   leakage > 0 A
       -> LEAKAGE DETECTED
       -> ALERT
       -> BUZZER ON


   POWER:

   DAY:
       Solar -> Load
       Solar -> Battery

   NIGHT:
       Battery -> Load

============================================================ */
