# js-project-weather-app

(--------Requirements --------)

- Your project should use TypeScript
- You should fetch data from the API using fetch()
- The app should have: city name, current temperature, weather description, 4-day forecast
- The presentation of the data should be in the specified format. However, you can choose how to display the forecast 
- perhaps you want to show the min and max temperature for each day, or perhaps you want to show the temperature from the middle of the day, or the   humidity, what it feels like and so on. Just make sure to make it all fit nicely with your chosen design.
- Make your app responsive (it should look good on devices from 320px width up to at least 1600px)
- Follow one of the designs as closely as you can
- Follow the guidelines on how to write clean code


 (------- Setup -------)

Sections:

Condition + temperature 
Location

Symbol (glasses/umbrella/cloud)

Message showing depending on weather

Forecast 

+
background changing depending on weather


(------- Links -------)

https://wpt-a-tst.smhi.se/backend-startpage/geo/autocomplete/places/$%7Bcity%7D?pmponly=true


https://opendata-download-metfcst.smhi.se/api/category/snow1g/version/1/geotype/point/lon/18.062639/lat/59.329468/data.json?timeseries=24

https://opendata.smhi.se/



(-------- Example from session -------)

const now = new Date()
console.log(now.getYear())


const month = now.getMonth()
console.log(month)

if (month === 2) {
  console.log ("it's october");
  document.body.style.backgroundColor = "orange";
} else {
  document.body.style.backgroundColor = "pink";
}

(------ Various things to add --------)

  "createdTime": "2025-10-15T09:29:06Z",
  "referenceTime": "2025-10-15T09:15:00Z",
  "geometry": {
    "type": "Point",
    "coordinates": [18.077207, 59.33036]
  },
  "timeSeries": [
    {
      "time": "2025-10-15T10:00:00Z",
      "intervalParametersStartTime": "2025-10-15T09:00:00Z",
      "data": {
        "air_temperature": 11.9,
        "wind_from_direction": 273,
        "wind_speed": 2.6,
        "wind_speed_of_gust": 5.3,
        "relative_humidity": 75,
        "air_pressure_at_mean_sea_level": 1018,
        "visibility_in_air": 21.5,
        "thunderstorm_probability": 0,
        "probability_of_frozen_precipitation": 0,
        "cloud_area_fraction": 4,
        "low_type_cloud_area_fraction": 2,
        "medium_type_cloud_area_fraction": 0,
        "high_type_cloud_area_fraction": 0,
        "cloud_base_altitude": 9999,
        "cloud_top_altitude": 9999,
        "precipitation_amount_mean": 0,
        "precipitation_amount_min": 0,
        "precipitation_amount_max": 0,
        "precipitation_amount_median": 0,
        "probability_of_precipitation": 0,
        "precipitation_frozen_part": -9,
        "predominant_precipitation_type_at_surface": 0,
        "symbol_code": 3
      }
    }]




(-------- Styling -------)

font: Montserrat

sunny
yellow background: #F7E9B9;
color: #2A5510;

raining
#BDE8FA
#164A68;

cloudy
#FFFFFF
background: #F47775;


(-------- Search input ------)

const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", async (e) => {
  const searchTerm = e.target.value.trim().toLowerCase();

  if (searchTerm === "") {
    if (useAPI) {
      await fetchRecipes(); // hämta alla från API igen
    } else {
      renderRecipes(localRecipes);
    }
    return;
  }

  if (useAPI) {
    try {
      const url = `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(
        searchTerm
      )}&number=10&addRecipeInformation=true&apiKey=${API_KEY}`;

      container.innerHTML = "<p>Searching...</p>";
      const res = await fetch(url);
      const data = await res.json();

      if (!data.results || data.results.length === 0) {
        container.innerHTML = `<p>No API results for "${searchTerm}".</p>`;
        return;
      }

      
function changeDesign(symbol) {
    const body = document.body;
    const icon = document.getElementById("weather-icon");

    // Default style settings
    body.style.transition = "background-color 0.5s ease, color 0.5s ease";

    if (symbol === 1) { // sunny
        body.style.backgroundColor = "lightyellow";
        body.style.color = "black";
        icon.src = "icons/sunny.png";
    }
    else if (symbol === 3 || symbol === 4) { // cloudy
        body.style.backgroundColor = "lightgray";
        body.style.color = "red";
        icon.src = "icons/cloudy.png";
    }
    else if (symbol === 5 || symbol === 6 || symbol === 9) { // rainy
        body.style.backgroundColor = "lightblue";
        body.style.color = "navy";
        icon.src = "icons/rainy.png";
    }
    else if (symbol === 15) { // snowy
        body.style.backgroundColor = "white";
        body.style.color = "black";
        icon.src = "icons/snowy.png";
    }
    else { // default
        body.style.backgroundColor = "beige";
        body.style.color = "black";
        icon.src = "icons/default.png";
    }
}
