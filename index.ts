// WEATHER URL – SMHI:s API for Stockholm
const weatherURL: string =
  "https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/18.0686/lat/59.3293/data.json";

//--------------------------------------------------
// TYPE'S 
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

// function condition

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
    27: "Heavy snowfall"
  };
  return conditions[symbol] || "Unknown";
}

//--------------------------------------------------
// MAIN FUNCTION –fetch data from api
//--------------------------------------------------
async function fetchWeather(): Promise<void> {
  try {
    const response = await fetch(weatherURL);
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

    const data: SMHIResponse = await response.json();

    const first = data.timeSeries[0];

    const tempParam = first.parameters.find((p) => p.name === "t");
    const symbolParam = first.parameters.find((p) => p.name === "Wsymb2");


    if (!tempParam || !symbolParam) {
      throw new Error("Temperature or weather symbol not found in API data.");
    }

    const currentTemp = tempParam.values[0];
    const weatherSymbol = symbolParam.values[0];
    const conditionTemp = getCondition(weatherSymbol);
    //predominant_precipitation_type_at_surface

    showCurrentWeather(currentTemp, weatherSymbol, conditionTemp);
    showForecast(data.timeSeries);
    changeDesign(weatherSymbol);

  } catch (error) {
    console.error("Error while fetching weather data:", error);
  }
}

//----------------------------------------------------------
// SHOW WEATHER – temp, icon och message
//----------------------------------------------------------

function showCurrentWeather(temp: number, symbol: number, condition: string): void {
  const tempElement = document.getElementById("temperature");
  const conditionTextElement = document.getElementById("condition");
  const iconElement = document.getElementById("icon") as HTMLImageElement | null;
  const messageElement = document.getElementById("message");
  //const locationElement = document.getElementById("location");


  if (tempElement && iconElement && messageElement && conditionTextElement) {
    tempElement.textContent = `${condition} | ${temp}°`;
    // conditionTextElement.textContent = condition;
  }

  if (symbol === 1) {
    messageElement.textContent = "Get your sunnies on.Stockholm is looking rather great today.";
  } else if (symbol === 3 || symbol === 4) {
    messageElement.textContent = "Light a fire and get cosy. Stockholm is looking grey today.";
  } else if ([5, 6, 9].includes(symbol)) {
    messageElement.textContent = "Don’t forget your umbrella. It’s wet in Stockholm today.";
  } else if (symbol === 15) {
    messageElement.textContent = "IT’S SNOWING ❄️";
  } else {
    messageElement.textContent = "WEATHER UNKNOWN 🤔";
  }
}

//---------------------------------------------
// FORECAST - can wait
//---------------------------------------------

function showForecast(times: SMHITimeSeries[]): void {
  const forecastElement = document.getElementById("forecast");
  if (!forecastElement) return;

  forecastElement.innerHTML = "";

  for (let i = 8; i < 8 * 5; i += 8) {
    const t = times[i];
    const tempParam = t.parameters.find((p) => p.name === "t");
    if (!tempParam) continue;

    const temp = tempParam.values[0];
    const date = t.validTime.slice(0, 10);
    forecastElement.innerHTML += `<p>${date}: ${temp}°C</p>`;
  }
}

//--------------------------------------------------
// CHANGING DESIGN DEPENDING ON WEATHER
//--------------------------------------------------
function changeDesign(symbol: number): void {
  const icon = document.getElementById("icon") as HTMLImageElement | null;
  if (!icon) return;

  if (symbol === 1) { //sunny
    document.body.style.backgroundColor = "#F7E9B9";
    document.body.style.color = "#2A5510";
    icon.src = "img/sunny.png";

  } else if (symbol === 3 || symbol === 4) { //cloudy
    document.body.style.backgroundColor = "#FFFFFF";
    document.body.style.color = "#F47775";
    icon.src = "img/cloudy.png";

  } else if ([5, 6, 9].includes(symbol)) { //rainy
    document.body.style.backgroundColor = "#BDE8FA";
    document.body.style.color = "#164A68";
    icon.src = "img/rainy.png";

  } else if (symbol === 15) {
    document.body.style.backgroundColor = "#FFFFFF";
    document.body.style.color = "#045381";

  } else {
    document.body.style.backgroundColor = "beige";
    document.body.style.color = "black";
  }
}

//---------------------------------------------
// 6️⃣  STARTING THE APP 
//---------------------------------------------
fetchWeather();