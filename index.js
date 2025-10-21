var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
// WEATHER URL – SMHI:s API for Stockholm
var weatherURL = "https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/18.0686/lat/59.3293/data.json";
//--------------------------------------------------
// UTIL: safe parameter lookup
//--------------------------------------------------
var getParamValue = function (ts, key) {
    var _a;
    var hit = ts.parameters.find(function (p) { return p.name === key; });
    return (_a = hit === null || hit === void 0 ? void 0 : hit.values) === null || _a === void 0 ? void 0 : _a[0];
};
//--------------------------------------------------
// CONDITION TEXT
//--------------------------------------------------
function getCondition(symbol) {
    var conditions = {
        1: "Clear sky",
        2: "Nearly clear sky",
        3: "Variable cloudiness",
        4: "Halfclear sky",
        5: "Cloudy",
        6: "Overcast",
        7: "Fog",
        8: "Light rain showers",
        9: "Moderate rain showers",
        10: "Heavy rain showers",
        11: "Thunderstorm",
        12: "Light sleet showers",
        13: "Moderate sleet showers",
        14: "Heavy sleet showers",
        15: "Light snow showers",
        16: "Moderate snow showers",
        17: "Heavy snow showers",
        18: "Light rain",
        19: "Moderate rain",
        20: "Heavy rain",
        21: "Thunder",
        22: "Light sleet",
        23: "Moderate sleet",
        24: "Heavy sleet",
        25: "Light snowfall",
        26: "Moderate snowfall",
        27: "Heavy snowfall",
    };
    return conditions[symbol] || "Unknown";
}
//--------------------------------------------------
// MAIN FUNCTION – fetch data from API
//--------------------------------------------------
function fetchWeather() {
    return __awaiter(this, void 0, void 0, function () {
        var response, data, first, currentTemp, weatherSymbol, conditionText, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch(weatherURL)];
                case 1:
                    response = _a.sent();
                    if (!response.ok)
                        throw new Error("HTTP error: ".concat(response.status));
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = (_a.sent());
                    if (!data.timeSeries || data.timeSeries.length === 0) {
                        console.error("No timeSeries data in response.");
                        return [2 /*return*/];
                    }
                    first = data.timeSeries[0];
                    currentTemp = getParamValue(first, "t");
                    weatherSymbol = getParamValue(first, "Wsymb2");
                    if (typeof currentTemp !== "number" || typeof weatherSymbol !== "number") {
                        console.error("Missing temp or weather symbol.", {
                            currentTemp: currentTemp,
                            weatherSymbol: weatherSymbol,
                        });
                        return [2 /*return*/];
                    }
                    conditionText = getCondition(weatherSymbol);
                    // predominant_precipitation_type_at_surface (reserved if you need later)
                    showCurrentWeather(currentTemp, weatherSymbol, conditionText);
                    showForecast(data.timeSeries);
                    changeDesign(weatherSymbol);
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error("Error while fetching weather data:", error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
//----------------------------------------------------------
// SHOW WEATHER – temp, icon and message
//----------------------------------------------------------
function showCurrentWeather(temp, symbol, condition) {
    var tempElement = document.getElementById("temperature");
    var conditionTextElement = document.getElementById("condition");
    var iconElement = document.getElementById("icon");
    var messageElement = document.getElementById("message");
    if (tempElement) {
        tempElement.textContent = "".concat(condition, " | ").concat(Math.round(temp), "\u00B0");
    }
    // If you want a separate condition line:
    // if (conditionTextElement) conditionTextElement.textContent = condition;
    if (iconElement) {
        if (symbol === 1)
            iconElement.src = "img/sunny.png";
        else if (symbol === 3 || symbol === 4)
            iconElement.src = "img/cloudy.png";
        else if ([5, 6, 9].includes(symbol))
            iconElement.src = "img/rainy.png";
        else if (symbol === 15)
            iconElement.src = "img/snowy.png";
    }
    if (messageElement) {
        if (symbol === 1) {
            messageElement.textContent =
                "Get your sunnies on. Stockholm is looking rather great today.";
        }
        else if (symbol === 3 || symbol === 4) {
            messageElement.textContent =
                "Light a fire and get cosy. Stockholm is looking grey today.";
        }
        else if ([5, 6, 9].includes(symbol)) {
            messageElement.textContent =
                "Don’t forget your umbrella. It’s wet in Stockholm today.";
        }
        else if (symbol === 15) {
            messageElement.textContent = "IT’S SNOWING ❄️";
        }
        else {
            messageElement.textContent = "WEATHER UNKNOWN 🤔";
        }
    }
}
// //---------------------------------------------
// // FORECAST
// //---------------------------------------------
// function showForecast(times: SMHITimeSeries[]): void {
//   const forecastElement = document.getElementById("forecast");
//   if (!forecastElement) return;
//   forecastElement.innerHTML = "";
//   // Assuming 3-hour steps: every 8th ≈ next day. Show next 5 days.
//   for (let i = 8; i < 8 * 5; i += 8) {
//     const t = times[i];
//     if (!t) continue;
//     const temp = getParamValue(t, "t");
//     if (typeof temp !== "number") continue;
//     const date = t.validTime.slice(0, 10);
//     forecastElement.innerHTML += `<p>${date}: ${Math.round(temp)}°C</p>`;
//   }
// }
function showForecast(times) {
    var forecastEl = document.getElementById("forecast");
    if (!forecastEl)
        return;
    forecastEl.innerHTML = ""; // clear old content
    var today = new Date(times[0].validTime);
    var daysAdded = 0;
    var lastDate = today.toDateString();
    for (var _i = 0, times_1 = times; _i < times_1.length; _i++) {
        var t = times_1[_i];
        var thisDate = new Date(t.validTime);
        var dateString = thisDate.toDateString();
        // hoppa över samma dag
        if (dateString === lastDate)
            continue;
        lastDate = dateString;
        var tempParam = t.parameters.find(function (p) { return p.name === "t"; });
        if (!tempParam)
            continue;
        var temp = tempParam.values[0];
        var weekday = thisDate.toLocaleDateString("en-US", { weekday: "long" });
        forecastEl.innerHTML += "\n      <div class=\"forecast-row\">\n        <span class=\"weekday\">".concat(weekday, "</span>\n        <span class=\"temp\">").concat(temp, "\u00B0</span>\n      </div>\n    ");
        daysAdded++;
        if (daysAdded >= 5)
            break; // visa bara 5 dagar (imorgon + 4 framåt)
    }
}
//--------------------------------------------------
// CHANGING DESIGN DEPENDING ON WEATHER
//--------------------------------------------------
function changeDesign(symbol) {
    var icon = document.getElementById("icon");
    if (symbol === 1) {
        // sunny
        document.body.style.backgroundColor = "#F7E9B9";
        document.body.style.color = "#2A5510";
        if (icon)
            icon.src = "img/sunny.png";
    }
    else if (symbol === 3 || symbol === 4) {
        // cloudy
        document.body.style.backgroundColor = "#FFFFFF";
        document.body.style.color = "#F47775";
        if (icon)
            icon.src = "img/cloudy.png";
    }
    else if ([5, 6, 9].includes(symbol)) {
        // rainy
        document.body.style.backgroundColor = "#BDE8FA";
        document.body.style.color = "#164A68";
        if (icon)
            icon.src = "img/rainy.png";
    }
    else if (symbol === 15) {
        // snowy
        document.body.style.backgroundColor = "#FFFFFF";
        document.body.style.color = "#045381";
        if (icon)
            icon.src = "img/snowy.png";
    }
    else {
        document.body.style.backgroundColor = "beige";
        document.body.style.color = "black";
    }
}
//---------------------------------------------
// 6️⃣  STARTING THE APP
//---------------------------------------------
fetchWeather();
