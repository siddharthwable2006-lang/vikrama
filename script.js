/* =====================================================
   SMART POLE DASHBOARD
   Demo / Simulation JavaScript
   ===================================================== */


/* ---------- LIVE CLOCK ---------- */

function updateClock() {

    const now = new Date();

    const time = now.toLocaleTimeString("en-IN", {
        hour12: false
    });

    const date = now.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });

    document.getElementById("time").textContent = time;
    document.getElementById("date").textContent = date;
}

setInterval(updateClock, 1000);
updateClock();


/* ---------- ELEMENTS ---------- */

const batteryPercent =
    document.getElementById("batteryPercent");

const batteryBar =
    document.getElementById("batteryBar");

const batteryVoltage =
    document.getElementById("batteryVoltage");

const solarPower =
    document.getElementById("solarPower");

const solarVoltage =
    document.getElementById("solarVoltage");

const solarCurrent =
    document.getElementById("solarCurrent");

const loadPower =
    document.getElementById("loadPower");

const loadVoltage =
    document.getElementById("loadVoltage");

const loadCurrent =
    document.getElementById("loadCurrent");

const temperature =
    document.getElementById("temperature");

const tiltValue =
    document.getElementById("tiltValue");

const axisX =
    document.getElementById("axisX");

const axisY =
    document.getElementById("axisY");

const axisZ =
    document.getElementById("axisZ");

const buzzerStatus =
    document.getElementById("buzzerStatus");

const safetyLabel =
    document.getElementById("safetyLabel");

const alertBox =
    document.getElementById("alertBox");

const poleSelect =
    document.getElementById("poleSelect");

const nodeId =
    document.getElementById("nodeId");


/* ---------- RANDOM VALUE ---------- */

function random(min, max) {
    return Math.random() * (max - min) + min;
}


/* ---------- SIMULATE SENSOR DATA ---------- */

function updateDashboard() {

    /*
       Battery
    */

    let battery =
        Math.round(random(76, 88));

    batteryPercent.textContent = battery;
    batteryBar.style.width = battery + "%";

    batteryVoltage.textContent =
        random(7.55, 8.15).toFixed(2) + " V";


    /*
       Solar
    */

    let solar =
        random(30, 55);

    let solarV =
        random(9.5, 11.5);

    let solarI =
        solar / solarV;

    solarPower.textContent =
        solar.toFixed(1);

    solarVoltage.textContent =
        solarV.toFixed(1) + " V";

    solarCurrent.textContent =
        solarI.toFixed(2) + " A";


    /*
       Load
    */

    let load =
        random(12, 22);

    let loadV =
        random(4.9, 5.1);

    let loadI =
        load / loadV;

    loadPower.textContent =
        load.toFixed(1);

    loadVoltage.textContent =
        loadV.toFixed(2) + " V";

    loadCurrent.textContent =
        loadI.toFixed(2) + " A";


    /*
       Temperature
    */

    temperature.textContent =
        random(27, 33).toFixed(1);


    /*
       MPU6050
    */

    let x = random(-2, 2);
    let y = random(-2, 2);
    let z = random(-1, 1);

    let tilt =
        Math.sqrt(x * x + y * y);

    axisX.textContent =
        x.toFixed(1) + "°";

    axisY.textContent =
        y.toFixed(1) + "°";

    axisZ.textContent =
        z.toFixed(1) + "°";

    tiltValue.textContent =
        tilt.toFixed(1) + "°";


    /*
       Safety condition
    */

    if (tilt > 8) {

        safetyLabel.textContent = "ALERT";

        safetyLabel.style.color = "#ff6b7a";

        alertBox.innerHTML = `
            <i class="fa-solid fa-triangle-exclamation"
               style="color:#ff6b7a"></i>

            <div>
                <strong>Structural Alert</strong>
                <p>
                    Excessive pole tilt detected.
                </p>
            </div>
        `;

        buzzerStatus.textContent = "ON";
        buzzerStatus.style.color = "#ff6b7a";

    } else {

        safetyLabel.textContent = "SAFE";

        safetyLabel.style.color = "";

        alertBox.innerHTML = `
            <i class="fa-solid fa-circle-check"></i>

            <div>
                <strong>No Structural Alert</strong>
                <p>
                    MPU6050 readings are within safe limits.
                </p>
            </div>
        `;

        buzzerStatus.textContent = "OFF";
        buzzerStatus.style.color = "";
    }


    /*
       Update time indicator
    */

    document.getElementById("lastUpdate").textContent =
        "Just now";
}


/* ---------- POLE SELECTION ---------- */

poleSelect.addEventListener("change", function () {

    const selectedPole =
        this.value;

    nodeId.textContent =
        selectedPole;

    /*
       In the real system, this is where
       you would request data for that
       specific Pole ID from your server.
    */

});


/* ---------- START SIMULATION ---------- */

updateDashboard();

setInterval(updateDashboard, 2500);


/* =====================================================
   REAL ESP8266 / ARDUINO CONNECTION

   Later, replace updateDashboard() with data received
   from your backend/API.

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
       "lora": true
   }

   ===================================================== */
