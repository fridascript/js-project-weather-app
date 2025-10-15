

// from Jennie's session wednesday 

//global scope

const weatherURL = `https://opendata-download-metfcst.smhi.se/api/category/snow1g/version/1/geotype/point/lon/18.062639/lat/59.329468/data.json?timeseries=24`

interface currentWeatherData {
  airTemp: number,
  condition: string
}



//API fetch
const fetchWeather = async () => {
  try {
    const response = await fetch(weatherURL)

    if (!response.ok) throw new Error(`HTTP error: ${response.status}`)

    const data = await response.json()

    currentWeather = {
      airTemp: data.timeSeries[0].data.air_temperature,
      condition: data.timeSeries[0].data.symbol_code
    }

    console.log(data.timeSeries[0].data)

  } catch (error) {
    console.log(`caught and error, ${error}`)
  }
}

fetchWeather()



const container = document.getElementsByClassName("container")
const renderWeather = (currentWeatherData) => {
        
      container.innerHTML = "";

  currentWeatherData.forEach(weather => {
        container.innerHTML += `
        <div class="container">
        <h3>${currentWeatherData.condition}</h3>
        <img src="${weather.image}" alt="${currentWeatherData.condition}" />
        <hr>
        <h4>${currentWeatherData.day.join(", ")}</h4>
        <h4>${currentWeatherData.temp} </h4>
        </div>
        `;
      });
    }; 





// DATE EXAMPLE

// const weather = show Weather()
// console.log(weather.getCondition())


// const location = weather.getLocation()
// console.log(Location)

// if (temperature === 10) {
//   console.log("it's sunny ");
//   document.body.style.backgroundColor = "orange";
// } else {
//   document.body.style.backgroundColor = "pink";
// }
  

  
  
     /* EXAMPLE */

  //   <!-- const renderWeather = (weather) => {
  //     container.innerHTML = "";

  //     weather.forEach(weather => {
  //       container.innerHTML += `
  //       <div class="container">
  //       <h3>${weather.condition}</h3>
  //       <img src="${weather.image}" alt="${weather.condition}" />
  //       <hr>
  //       <h4>${weather.day.join(", ")}</h4>
  //       <h4>${weather.temp} </h4>
  //       </div>
  //       `;
  //     });
  //   }; -->




  //     <!-- const renderRecipes = (recipes) => {
  //       container.innerHTML = "";

  //       recipes.forEach(recipe => {
  //         container.innerHTML += `
  //       <div class="card">
  //       <h3>${recipe.title}</h3>
  //       <img src="${recipe.image}" alt="${recipe.title}" />
  //       <hr>
  //       <h4>${recipe.cuisines.join(", ")}</h4>
  //       <h4>${recipe.readyInMinutes} min</h4>
  //       </div>
  //       `;
  //       });
  //     }; -->