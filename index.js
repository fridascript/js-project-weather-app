// 1️⃣ WEATHER URL – SMHI:s API för Stockholm
const weatherURL = "https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/18.0686/lat/59.3293/data.json";

//API LINKS NOT WORKING BUT SHOULD BE USED

// const weatherURL = `https://opendata-download-metfcst.smhi.se/api/category/snow1g/version
// /1/geotype/point/lon/18.062639/lat/59.329468/data.json`

// // https://opendata-download-metfcst.smhi.se/api/category/snow1g/version/1/geotype/point/lon/18.062639/lat/59.329468/data.json?timeseries=24

// // const weatherURL = "https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/18.0686/lat/59.3293/data.json";

//--------------------------------------------------
// 2️⃣  MAIN FUNCTION – hämta data och starta appen
//--------------------------------------------------
async function fetchWeather() {
    try {
        const response = await fetch(weatherURL);
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

        const data = await response.json();

        const first = data.timeSeries[0];

        const tempParam = first.parameters.find(p => p.name === "t");
        const symbolParam = first.parameters.find(p => p.name === "Wsymb2");

        if (!tempParam || !symbolParam) {
            throw new Error("Temperature or weather symbol not found in API data.");
        }

        const currentTemp = tempParam.values[0];
        const weatherSymbol = symbolParam.values[0];

        showCurrentWeather(currentTemp, weatherSymbol);
        showForecast(data.timeSeries);
        changeDesign(weatherSymbol);

    } catch (error) {
        console.error("Error while fetching weather data:", error);
    }
}

//----------------------------------------------------------
// 3️⃣  VISA VÄDRET – temperatur, ikon och meddelande
//----------------------------------------------------------
function showCurrentWeather(temp, symbol) {
    const tempElement = document.getElementById("temperature");
    const iconElement = document.getElementById("icon");
    const messageElement = document.getElementById("message");

    if (tempElement && iconElement && messageElement) {
        tempElement.textContent = `Temperature: ${temp}°C`;
        // iconElement.src = `https://www.smhi.se/pmp3g-symbols/${symbol}.png`;

        if (symbol === 1) {
            messageElement.textContent = "IT’S SUNNY DON'T, FORGET YOUR SUNNIES! ☀️";
        } else if (symbol === 3 || symbol === 4) {
            messageElement.textContent = "IT’S CLOUDY ☁️";
        } else if ([5, 6, 9].includes(symbol)) {
            messageElement.textContent = "IT’S RAINY, DON'T FORGET YOUR UMBRELLA 🌧️";
        } else if (symbol === 15) {
            messageElement.textContent = "IT’S SNOWING ❄️";
        } else {
            messageElement.textContent = "WEATHER UNKNOWN 🤔";
        }
    }
}

//---------------------------------------------
// 4️⃣  VISAR ENKEL 4-DAGARS PROGNOS - WAIT UNTIL NEXT WEEK
//---------------------------------------------
function showForecast(times) {
    const forecastElement = document.getElementById("forecast");
    if (!forecastElement) return;
    forecastElement.innerHTML = "";

    for (let i = 8; i < 8 * 5; i += 8) {
        const t = times[i];
        const tempParam = t.parameters.find(p => p.name === "t");

        if (!tempParam) continue;

        const temp = tempParam.values[0];
        const date = t.validTime.slice(0, 10);
        forecastElement.innerHTML += `<p>${date}: ${temp}°C</p>`;
    }
}

//--------------------------------------------------
// 5️⃣  ÄNDRA DESIGNEN BEROENDE PÅ VÄDRET
//--------------------------------------------------
function changeDesign(symbol) {
    let icon = document.getElementById("icon");

    if (!icon) return;

    if (symbol === 1) { // sunny
        document.body.style.backgroundColor = "#F7E9B9";
        document.body.style.color = "#2A5510";
        icon.src = "img/sunny.png";

    }
    else if (symbol === 3 || symbol === 4) { // cloudy
        document.body.style.backgroundColor = "#FFFFFF";
        document.body.style.color = "#F47775";
        icon.src = "img/cloudy.png"
    }
    else if (symbol === 5 || symbol === 6 || symbol === 9) { // rainy
        document.body.style.backgroundColor = "#BDE8FA";
        document.body.style.color = "#164A68";
        icon.src = "img/rainy.png";
    }
    else if (symbol === 15) { // snowy
        document.body.style.backgroundColor = "#FFFFFF";
        document.body.style.color = "#045381ff";
    }
    else { // default
        document.body.style.backgroundColor = "beige";
        document.body.style.color = "black";
    }
}

//---------------------------------------------
// 6️⃣  STARTAR APPEN
//---------------------------------------------
fetchWeather();




/* "use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const weatherURL = `https://opendata-download-metfcst.smhi.se/api/category/snow1g/version/1/geotype/point/lon/18.062639/lat/59.329468/data.json?timeseries=24`;
const fetchWeather = async () => {
    try {
        const response = await fetch(weatherURL);
        if (!response.ok)
            throw new Error(`HTTP error: ${response.status}`);
        const data = await response.json();
    }
    catch (error) {
    }
    console.log(`caught and error, ${error}`);
};
//# sourceMappingURL=index.js.map */ 