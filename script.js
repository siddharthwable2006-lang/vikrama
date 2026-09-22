/* ============================================================
   SMART POLE MONITORING SYSTEM
   Professional Navy Blue Dashboard
   ============================================================

   MONITORED PARAMETERS
   --------------------
   Pole Tilt          : Maximum 30°
   Conductor Sag      : Maximum +2 mm
   Leakage Current    : 0 A target

   POWER MANAGEMENT
   ----------------
   Day   : Solar → Load + Battery Charging
   Night : Battery → Load

   COMMUNICATION
   -------------
   LoRa

   HARDWARE CONCEPT
   ----------------
   Arduino / Controller
        ↓
   Sensors
        ↓
   LoRa
        ↓
   Gateway / Backend
        ↓
   Dashboard

============================================================ */


/* ============================================================
   PROJECT THRESHOLDS
============================================================ */

const THRESHOLDS = {

    tilt: 30.0,       // degrees

    sag: 2.0,         // mm

    leakage: 0.0      // amperes

};


/* ============================================================
   SENSOR DATA
============================================================ */

let sensorData = {

    poleId: "SP-001",

    tilt: 3.8,

    sag: 0.80,

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
   HELPER
============================================================ */

function get(id) {

    return document.getElementById(id);

}


function setText(id, value) {

    const element = get(id);

    if (element) {

        element.textContent = value;

    }

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


        /* Remove active state */

        navButtons.forEach(btn => {

            btn.classList.remove("active");

        });


        tabs.forEach(tab => {

            tab.classList.remove("active");

        });


        /* Activate selected tab */

        button.classList.add("active");


        const selectedTab =
            get(target);


        if (selectedTab) {

            selectedTab.classList.add("active");

        }


        if (pageTitle) {

            pageTitle.textContent =
                pageTitles[target] || "Dashboard";

        }

    });

});


/* ============================================================
   LIVE CLOCK
============================================================ */

function updateClock() {

    const now = new Date();

    const time =
        now.toLocaleTimeString(
            "en-IN",
            {
                hour12: false
            }
        );


    setText(
        "clock",
        time
    );

}


updateClock();

setInterval(
    updateClock,
    1000
);


/* ============================================================
   POLE SELECTOR
============================================================ */

const poleSelect =
    get("poleSelect");


if (poleSelect) {

    poleSelect.addEventListener(
        "change",
        function () {

            sensorData.poleId =
                this.value;


            updatePoleID();

        }
    );

}


function updatePoleID() {

    setText(
        "nodeId",
        sensorData.poleId
    );


    setText(
        "dashboardPole",
        sensorData.poleId
    );

}


/* ============================================================
   SENSOR SIMULATION
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
   GENERATE SIMULATED SENSOR VALUES
============================================================ */

function simulateSensors() {

    /* ------------------------------------------
       POLE TILT
    ------------------------------------------ */

    sensorData.tilt =
        Math.max(
            0,
            randomVariation(
                sensorData.tilt,
                0.7
            )
        );


    /*
       Occasionally generate a dangerous
       tilt value so the alert system can
       be tested.
    */

    if (Math.random() < 0.015) {

        sensorData.tilt =
            31 +
            Math.random() * 5;

    }


    /* ------------------------------------------
       CONDUCTOR SAG
    ------------------------------------------ */

    sensorData.sag =
        Math.max(
            0,
            randomVariation(
                sensorData.sag,
                0.10
            )
        );


    /*
       Occasionally simulate excessive sag.
    */

    if (Math.random() < 0.015) {

        sensorData.sag =
            2.1 +
            Math.random() * 0.8;

    }


    /* ------------------------------------------
       LEAKAGE CURRENT
    ------------------------------------------ */

    /*
       Normal condition = 0 A.

       Small probability of leakage is generated
       only to test the dashboard alert.
    */

    if (Math.random() < 0.025) {

        sensorData.leakage =
            Number(
                (
                    0.01 +
                    Math.random() * 0.15
                ).toFixed(2)
            );

    } else {

        sensorData.leakage = 0;

    }


    /* ------------------------------------------
       BATTERY
    ------------------------------------------ */

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


    /*
       Approximate battery percentage
       for the dashboard display.

       7.1 V = 0%
       8.4 V = 100%
    */

    sensorData.batteryPercent =
        Math.round(
            (
                (
                    sensorData.batteryVoltage -
                    7.1
                ) /
                1.3
            ) * 100
        );


    sensorData.batteryPercent =
        Math.max(
            0,
            Math.min(
                100,
                sensorData.batteryPercent
            )
        );


    /* ------------------------------------------
       SOLAR POWER
    ------------------------------------------ */

    sensorData.solarPower =
        Math.max(
            0,
            randomVariation(
                sensorData.solarPower,
                4
            )
        );


    /* ------------------------------------------
       LOAD
    ------------------------------------------ */

    sensorData.loadPower =
        Math.max(
            5,
            randomVariation(
                sensorData.loadPower,
                1.5
            )
        );


    /* ------------------------------------------
       TEMPERATURE
    ------------------------------------------ */

    sensorData.temperature =
        randomVariation(
            sensorData.temperature,
            0.3
        );


    /* ------------------------------------------
       LoRa
    ------------------------------------------ */

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


    /* ------------------------------------------
       UPDATE DASHBOARD
    ------------------------------------------ */

    updateAllDisplays();

}


/* ============================================================
   UPDATE EVERYTHING
============================================================ */

function updateAllDisplays() {

    updatePoleID();

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

    /* Battery */

    setText(
        "batteryVoltage",
        sensorData.batteryVoltage.toFixed(2)
    );


    setText(
        "batteryPercent",
        sensorData.batteryPercent
    );


    /* Solar */

    setText(
        "solarPower",
        sensorData.solarPower.toFixed(1)
    );


    /* Load */

    setText(
        "loadPower",
        sensorData.loadPower.toFixed(1)
    );


    /* Temperature */

    setText(
        "temperature",
        sensorData.temperature.toFixed(1)
    );


    /* Last update */

    setText(
        "lastUpdate",
        new Date().toLocaleTimeString(
            "en-IN"
        )
    );


    /* ------------------------------------------
       DASHBOARD SAFETY VALUES
    ------------------------------------------ */

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


    /* ------------------------------------------
       SAFETY COLOURS ON DASHBOARD
    ------------------------------------------ */

    const leakage =
        get("dashboardLeakage");


    if (leakage) {

        leakage.classList.remove(
            "green",
            "red"
        );


        if (
            sensorData.leakage >
            THRESHOLDS.leakage
        ) {

            leakage.classList.add("red");

        } else {

            leakage.classList.add("green");

        }

    }


    /* ------------------------------------------
       OVERALL SAFETY
    ------------------------------------------ */

    const safe =
        checkSystemSafety();


    setText(
        "overviewSafety",
        safe
            ? "Normal"
            : "Alert"
    );


    const overview =
        get("overviewSafety");


    if (overview) {

        overview.classList.remove(
            "green",
            "red"
        );


        overview.classList.add(
            safe
                ? "green"
                : "red"
        );

    }

}


/* ============================================================
   SAFETY TAB
============================================================ */

function updateSafety() {

    const tilt =
        sensorData.tilt;

    const sag =
        sensorData.sag;

    const leakage =
        sensorData.leakage;


    /* ========================================================
       TILT
    ======================================================== */

    setText(
        "tiltValue",
        tilt.toFixed(1) + "°"
    );


    /*
       IMPORTANT:
       The progress bar reaches 100%
       at the 30° threshold.
    */

    const tiltPercentage =
        Math.min(
            (
                tilt /
                THRESHOLDS.tilt
            ) * 100,
            100
        );


    const tiltProgress =
        get("tiltProgress");


    if (tiltProgress) {

        tiltProgress.style.width =
            tiltPercentage + "%";


        if (
            tilt >=
            THRESHOLDS.tilt
        ) {

            tiltProgress.style.background =
                "#ef4444";

        } else if (
            tilt >=
            THRESHOLDS.tilt * 0.7
        ) {

            tiltProgress.style.background =
                "#f59e0b";

        } else {

            tiltProgress.style.background =
                "#22c55e";

        }

    }


    /* ========================================================
       TILT STATUS
    ======================================================== */

    setStatus(
        "tiltStatus",
        tilt < THRESHOLDS.tilt,
        "NORMAL",
        "ALERT"
    );


    /* ========================================================
       SAG
    ======================================================== */

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


    /* ========================================================
       LEAKAGE
    ======================================================== */

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


    /* ========================================================
       LEAKAGE VALUE COLOR
    ======================================================== */

    const leakageValue =
        get("leakageValue");


    if (leakageValue) {

        leakageValue.classList.remove(
            "leakage-safe",
            "leakage-warning"
        );


        if (
            leakage >
            THRESHOLDS.leakage
        ) {

            leakageValue.classList.add(
                "leakage-warning"
            );

        } else {

            leakageValue.classList.add(
                "leakage-safe"
            );

        }

    }


    /* ========================================================
       OVERALL SAFETY
    ======================================================== */

    const systemSafe =
        checkSystemSafety();


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
   CHECK OVERALL SAFETY
============================================================ */

function checkSystemSafety() {

    const tiltSafe =
        sensorData.tilt <
        THRESHOLDS.tilt;


    const sagSafe =
        sensorData.sag <=
        THRESHOLDS.sag;


    const leakageSafe =
        sensorData.leakage <=
        THRESHOLDS.leakage;


    return (
        tiltSafe &&
        sagSafe &&
        leakageSafe
    );

}


/* ============================================================
   FAULT MESSAGE
============================================================ */

function getFaultMessage() {

    const faults = [];


    /* Tilt */

    if (
        sensorData.tilt >=
        THRESHOLDS.tilt
    ) {

        faults.push(
            "Pole tilt exceeds 30°"
        );

    }


    /* Sag */

    if (
        sensorData.sag >
        THRESHOLDS.sag
    ) {

        faults.push(
            "Conductor sag exceeds +2 mm"
        );

    }


    /* Leakage */

    if (
        sensorData.leakage >
        THRESHOLDS.leakage
    ) {

        faults.push(
            "Leakage current detected"
        );

    }


    if (faults.length === 0) {

        return "System normal.";

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

            buzzer.classList.remove(
                "green"
            );

            buzzer.classList.add(
                "red"
            );

        }


        if (safetyBuzzer) {

            safetyBuzzer.classList.remove(
                "green"
            );

            safetyBuzzer.classList.add(
                "red"
            );

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

            buzzer.classList.remove(
                "red"
            );

            buzzer.classList.add(
                "green"
            );

        }


        if (safetyBuzzer) {

            safetyBuzzer.classList.remove(
                "red"
            );

            safetyBuzzer.classList.add(
                "green"
            );

        }

    }

}


/* ============================================================
   ENERGY
============================================================ */

function updateEnergy() {

    /* Current solar power */

    setText(
        "energySolar",
        sensorData.solarPower.toFixed(1) +
        " W"
    );


    /* Battery voltage */

    setText(
        "energyBattery",
        sensorData.batteryVoltage.toFixed(2) +
        " V"
    );


    /* Load */

    setText(
        "energyLoad",
        sensorData.loadPower.toFixed(1) +
        " W"
    );


    /* Battery percentage */

    setText(
        "energyBatteryPercent",
        sensorData.batteryPercent
    );


    /*
       Approximate daily energy values
       for the simulation dashboard.
    */

    const solarEnergy =
        (
            sensorData.solarPower *
            0.1
        ).toFixed(2);


    setText(
        "energySolarValue",
        solarEnergy
    );

}


/* ============================================================
   DAY / NIGHT POWER MODE
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
       06:00 - 17:59
       DAY MODE

       18:00 - 05:59
       NIGHT MODE
    */

    const dayMode =
        hour >= 6 &&
        hour < 18;


    if (dayMode) {

        /* ------------------------------------------
           DAY
        ------------------------------------------ */

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
                '<i c
