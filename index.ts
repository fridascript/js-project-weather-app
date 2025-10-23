//--------------------------------------------------
// DEFAULT COORDINATES: start page Stockholm
//--------------------------------------------------
const DEFAULT_LAT = 59.3293;
const DEFAULT_LON = 18.0686;
const DEFAULT_CITY = "stockholm";

//--------------------------------------------------
// TYPES
//--------------------------------------------------
interface SMHIParameter {
  name: string;
  levelType: string;
  level: number;
  unit: string;
  values: number[];
}

interface SMHITimeSeries {
  validTime: string;
  parameters: SMHIParameter[];
}

interface SMHIResponse {
  approvedTime: string;
  referenceTime: string;
  timeSeries: SMHITimeSeries[];
}

//--------------------------------------------------
// GET THE FIRST VALUE OF A PARAMETER BY NAME 
//--------------------------------------------------
const getParamValue = (ts: SMHITimeSeries, key: string): number | undefined => {
  const hit = ts.parameters.find((p: SMHIParameter) => p.name === key);
  return hit?.values?.[0];
};

//--------------------------------------------------
// CONDITION INDEX
//--------------------------------------------------
function getCondition(symbol: number): string {
  const conditions: Record<number, string> = {
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
// MAIN FUNCTION: fetch data from API
//--------------------------------------------------
async function fetchWeather(
  lat: number = DEFAULT_LAT,
  lon: number = DEFAULT_LON,
  cityName: string = DEFAULT_CITY
): Promise<void> {
  const weatherURL = `https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/${lon}/lat/${lat}/data.json`;

  try {
    const response = await fetch(weatherURL);
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

    const data = (await response.json()) as SMHIResponse;

    if (!data.timeSeries || data.timeSeries.length === 0) return;

    const first = data.timeSeries[0]!;
    const currentTemp = getParamValue(first, "t");
    const weatherSymbol = getParamValue(first, "Wsymb2");

    if (typeof currentTemp !== "number" || typeof weatherSymbol !== "number") return;

    const conditionText = getCondition(weatherSymbol);

    showCurrentWeather(currentTemp, weatherSymbol, conditionText, cityName);
    showForecast(data.timeSeries);
    changeDesign(weatherSymbol);
  } catch (error) {
    console.error("Error while fetching weather data:", error);
  }
}

//--------------------------------------------------
// SHOW WEATHER: temp, icon and message 
//--------------------------------------------------
function showCurrentWeather(
  temp: number,
  symbol: number,
  condition: string,
  cityName: string
): void {
  const tempElement = document.getElementById("temperature");
  const iconElement = document.getElementById("icon") as HTMLImageElement | null;
  const messageElement = document.getElementById("message");

  if (tempElement) tempElement.textContent = `${condition} | ${Math.round(temp)}°`;

  if (iconElement) {
    if ([1, 2].includes(symbol)) iconElement.src = "img/sunny.png";
    else if ([3, 4, 5, 6].includes(symbol)) iconElement.src = "img/cloudy.png";
    else if ([5, 6, 9, 18, 19, 20].includes(symbol)) iconElement.src = "img/rainy.png";
    else if (symbol === 15) iconElement.src = "img/snowy.png";
  }

  if (messageElement) {
    if ([1, 2].includes(symbol)) messageElement.textContent =
      `Get your sunnies on. ${cityName} is looking rather great today.`;
    else if ([3, 4, 5, 6].includes(symbol)) messageElement.textContent =
      `Light a fire and get cosy. ${cityName} is looking grey today.`;
    else if ([5, 6, 9, 18, 19, 20].includes(symbol)) messageElement.textContent =
      `Don’t forget your umbrella. It’s wet in ${cityName} today.`;
    else if (symbol === 15) messageElement.textContent =
      `IT’S SNOWING ❄️ in ${cityName}`;
    else messageElement.textContent = `WEATHER UNKNOWN 🤔 in ${cityName}`;
  }
}

//--------------------------------------------------
// FORECAST
//--------------------------------------------------
function showForecast(times: SMHITimeSeries[]): void {
  const forecastEl = document.getElementById("forecast");
  if (!forecastEl) return;

  forecastEl.innerHTML = "";
  const today = new Date(times[0]!.validTime);
  let daysAdded = 0;
  let lastDate = today.toDateString();

  for (const t of times) {
    const thisDate = new Date(t.validTime);
    const dateString = thisDate.toDateString();

    if (dateString === lastDate) continue;

    lastDate = dateString;
    const tempParam = t.parameters.find(p => p.name === "t");
    if (!tempParam) continue;

    const temp = tempParam.values[0];
    const weekday = thisDate.toLocaleDateString("en-US", { weekday: "short" });

    forecastEl.innerHTML += `
      <div class="forecast-row">
        <span class="weekday">${weekday}</span>
        <span class="temp">${temp}°</span>
      </div>
    `;

    daysAdded++;
    if (daysAdded >= 5) break;
  }
}

//--------------------------------------------------
// SEARCHBAR: hardcoded cities
//--------------------------------------------------
const searchInput = document.querySelector(".search input") as HTMLInputElement;
const searchBtn = document.querySelector(".search button") as HTMLButtonElement;

const cities: Record<string, { lat: number; lon: number }> = {
  "malmö": { lat: 55.6050, lon: 13.0038 },
  "umeå": { lat: 63.8258, lon: 20.2630 },
  "göteborg": { lat: 57.7089, lon: 11.9746 },
  "stockholm": { lat: 59.3293, lon: 18.0686 },
  "skogen": { lat: 57.4205, lon: 15.0473 },
  "köpenhamn": { lat: 55.6761, lon: 12.5683 },
};

searchBtn.addEventListener("click", handleSearch);
searchInput.addEventListener("keydown", (e: KeyboardEvent) => {
  if (e.key === "Enter") handleSearch();
});

function handleSearch(): void {
  const city = searchInput.value.trim().toLowerCase();
  if (!city) return;

  const coords = cities[city];
  if (!coords) {
    alert("City not found! Try any of these cities; Malmö, Umeå, Göteborg, Stockholm, Köpenhamn or Skogen 🌳.");
    return;
  }

  fetchWeather(coords.lat, coords.lon, city.charAt(0).toUpperCase() + city.slice(1));
}


//--------------------------------------------------
// CHANGING DESIGN: depending on weather
//--------------------------------------------------
function changeDesign(symbol: number): void {
  const icon = document.getElementById("icon") as HTMLImageElement | null;
  const searchBox = document.querySelector(".search input") as HTMLInputElement | null;
  const searchBtn = document.querySelector(".search button") as HTMLButtonElement | null;

  // sunny
  if ([1, 2].includes(symbol)) {
    document.body.style.backgroundColor = "#F7E9B9";
    document.body.style.color = "#2A5510";
    if (icon) icon.src = "img/sunny.png";
    if (searchBox) {
      searchBox.style.border = "2px solid #2A5510";
      searchBox.style.color = "#2A5510";
    }
    if (searchBtn) {
      searchBtn.style.backgroundColor = "#2A5510";
      searchBtn.style.color = "#F7E9B9";
    }

    // cloudy
  } else if ([3, 4, 5, 6].includes(symbol)) {
    document.body.style.backgroundColor = "#FFFFFF";
    document.body.style.color = "#F47775";
    if (icon) icon.src = "img/cloudy.png";
    if (searchBox) {
      searchBox.style.border = "2px solid #F47775";
      searchBox.style.color = "#F47775";
    }
    if (searchBtn) {
      searchBtn.style.backgroundColor = "#F47775";
      searchBtn.style.color = "#FFFFFF";
    }

    // rainy
  } else if ([5, 6, 9, 18, 19, 20].includes(symbol)) {
    document.body.style.backgroundColor = "#BDE8FA";
    document.body.style.color = "#164A68";
    if (icon) icon.src = "img/rainy.png";
    if (searchBox) {
      searchBox.style.border = "2px solid #164A68";
      searchBox.style.color = "#164A68";
    }
    if (searchBtn) {
      searchBtn.style.backgroundColor = "#164A68";
      searchBtn.style.color = "#BDE8FA";
    }

    // snowy
  } else if (symbol === 15) {
    document.body.style.backgroundColor = "#FFFFFF";
    document.body.style.color = "#045381";
    if (icon) icon.src = "img/snowy.png";
    if (searchBox) {
      searchBox.style.border = "2px solid #045381";
      searchBox.style.color = "#045381";
    }
    if (searchBtn) {
      searchBtn.style.backgroundColor = "#045381";
      searchBtn.style.color = "#FFFFFF";
    }

    // fallback
  } else {
    document.body.style.backgroundColor = "beige";
    document.body.style.color = "black";
    if (searchBox) {
      searchBox.style.border = "2px solid black";
      searchBox.style.color = "black";
    }
    if (searchBtn) {
      searchBtn.style.backgroundColor = "black";
      searchBtn.style.color = "white";
    }
  }
}

//---------------------------------------------
//  START THE APP
//---------------------------------------------
fetchWeather();