function displayAqi(response) {
  let currentAirQuality = response.data.list[0].main.aqi;

  returnAqiDescription(currentAirQuality);

  function returnAqiDescription() {
    let givenAirQuality = currentAirQuality;
    let qualityIndex = ["", "Good", "Fair", "Moderate", "Poor", "Very Poor"];
    let qualityDescription = qualityIndex[givenAirQuality];
    document.querySelector("#current-air-quality").innerHTML =
      qualityDescription;
  }
}

function degToCompass(degrees) {
  let value = Math.floor(degrees / 22.5 + 0.5);
  let direction = [
    "↓ N",
    "↙ NNE",
    "↙ NE",
    "↙ ENE",
    "← E",
    "↖ ESE",
    "↖ SE",
    "↖ SSE",
    "↑ S",
    "↗ SSW",
    "↗ SW",
    "↗ WSW",
    "→ W",
    "↘ WNW",
    "↘ NW",
    "↘ NNW",
  ];

  document.querySelector("#current-wind-direction").innerHTML =
    direction[value % 16];
}
const popoverTriggerList = document.querySelectorAll(
  '[data-bs-toggle="popover"]'
);
const popoverList = [...popoverTriggerList].map(
  (popoverTriggerEl) => new bootstrap.Popover(popoverTriggerEl)
);
function displayWeatherInformation(response) {
  document.querySelector(
    "#place-name"
  ).innerHTML = `${response.data.name}, ${response.data.sys.country}`;

  let currentTemperature = document.querySelector("#temperature");
  currentTemperature.innerHTML = `${Math.round(response.data.main.temp)}°c`;

  let currentTemperatureFeels = document.querySelector("#temperature-feels");
  currentTemperatureFeels.innerHTML = `Feels like ${Math.round(
    response.data.main.feels_like
  )}°c `;

  let windSpeed = document.querySelector("#current-wind-speed");
  windSpeed.innerHTML = ` ${Math.round(response.data.wind.speed * 3.6)}km/h`;

  let allIcons = [
    "clear sky",
    "clouds",
    "few clouds",
    "haze",
    "heavy snow",
    "mist",
    "rain",
    "shower rain",
    "snow",
    "thunderstorm",
    "drizzle",
  ];

  let iconElement = document.querySelector("#description-icon");
  let iconID = response.data.weather[0].id;
  let mainWeather = response.data.weather[0].main.toLowerCase();
  let descriptionWeather = response.data.weather[0].description.toLowerCase();

  for (let i = 0; i < allIcons.length; i++) {
    if (descriptionWeather.localeCompare(allIcons[i]) === 0) {
      iconElement.src = `src/images/${allIcons[i]}.gif`;
    } else if (mainWeather.localeCompare(allIcons[i]) === 0) {
      iconElement.src = `src/images/${allIcons[i]}.gif`;
    } else if (
      iconID === 701 ||
      iconID === 711 ||
      iconID === 721 ||
      iconID === 731 ||
      iconID === 741 ||
      iconID === 751 ||
      iconID === 761 ||
      iconID === 762 ||
      iconID === 771 ||
      iconID === 781
    ) {
      iconElement.src = `src/images/mist.gif`;
    }
  }
  document.querySelector("#current-description").innerHTML =
    response.data.weather[0].description;
  document.querySelector("#current-visibility").innerHTML = `${Math.round(
    response.data.visibility / 1000
  )}km`;

  document.querySelector(
    "#current-humidity"
  ).innerHTML = `${response.data.main.humidity}%`;

  let localDate = new Date();
  let localOffset = localDate.getTimezoneOffset() * 60000;

  let timeUnix = response.data.dt * 1000;
  let timeUTC = timeUnix + localOffset;
  let time = new Date(timeUTC + 1000 * response.data.timezone);

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let date = time.getDate();
  let month = months[time.getMonth()];

  let day = days[time.getDay()];
  let minute = ("0" + time.getMinutes()).slice(-2);
  let hour = ("0" + time.getHours()).slice(-2);
  let dateElement = document.querySelector("#date-time");
  dateElement.innerHTML = `${day}, ${date} ${month} ${hour}:${minute}`;

  let sunriseTimeToday = document.querySelector("#sunrise-time-today");
  let sunriseUnix = response.data.sys.sunrise * 1000;
  let sunriseUTC = sunriseUnix + localOffset;
  let sunriseTime = new Date(sunriseUTC + 1000 * response.data.timezone);
  let sunriseHours = String(sunriseTime.getHours()).padStart(2, `0`);
  let sunriseMinutes = String(sunriseTime.getMinutes()).padStart(2, `0`);
  let sunrise = `${sunriseHours}:${sunriseMinutes}`;
  sunriseTimeToday.innerHTML = sunrise;

  let sunsetTimeToday = document.querySelector("#sunset-time-today");
  let sunsetUnix = response.data.sys.sunset * 1000;
  let sunsetUTC = sunsetUnix + localOffset;
  let sunsetTime = new Date(sunsetUTC + 1000 * response.data.timezone);
  let sunsetHours = String(sunsetTime.getHours()).padStart(2, `0`);
  let sunsetMinutes = String(sunsetTime.getMinutes()).padStart(2, `0`);
  let sunset = `${sunsetHours}:${sunsetMinutes}`;
  sunsetTimeToday.innerHTML = sunset;

  let degrees = response.data.wind.deg;

  degToCompass(degrees);
  getForecast(response.data.coord);
}

function defineCity(city) {
  let apiKey = "4b3503b2f08a729413c4d33ef1186004";
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(defineLocationAqi);
  axios.get(apiUrl).then(displayWeatherInformation);
  console.log(apiUrl);
}

function defineLocationAqi(response) {
  let apiKey = "4b3503b2f08a729413c4d33ef1186004";
  let lat = response.data.coord.lat;
  let lon = response.data.coord.lon;
  let apiUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
  axios.get(apiUrl).then(displayAqi);
  console.log(apiUrl);
}

function defineMyLocation(response) {
  let apiKey = "4b3503b2f08a729413c4d33ef1186004";
  let units = "metric";
  let lat = response.coords.latitude;
  let lon = response.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;
  axios.get(apiUrl).then(displayWeatherInformation);
}

function handleClick(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(defineLocationAqi);
  navigator.geolocation.getCurrentPosition(defineMyLocation);
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#city-input").value;
  defineCity(city);
  document.querySelector("#search-form").reset();
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[day];
}

function getForecast(coordinates) {
  let apiKey = "2a2eaa51d996796495bf456e5b58adf4";
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(displayForecast);
  console.log(apiUrl);
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");

  document.querySelector("#current-uvi").innerHTML = `UVI: ${Math.round(
    response.data.current.uvi
  )}`;

  let forecastHTML = `<div class="row forecast-container">`;

  forecast.forEach(function (forecastDay, index) {
    let degrees = forecastDay.wind_deg;
    let value = Math.floor(degrees / 22.5 + 0.5);
    let direction = [
      "↓ N",
      "↙ NNE",
      "↙ NE",
      "↙ ENE",
      "← E",
      "↖ ESE",
      "↖ SE",
      "↖ SSE",
      "↑ S",
      "↗ SSW",
      "↗ SW",
      "↗ WSW",
      "→ W",
      "↘ WNW",
      "↘ NW",
      "↘ NNW",
    ];
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        ` 

      <div class="col card">
        <div class="top-section">
         
        <div class="forecast-date">${formatDay(forecastDay.dt)}</div>
          
        <div class="forecast-description">  ${forecastDay.weather[0].description.toLowerCase()} </div>
<div class="icon-temp clearfix">
       
          <img class="forecast-img" src="http://openweathermap.org/img/wn/${
            forecastDay.weather[0].icon
          }@2x.png"> 
          <div  class="forecast-temperature"> ${Math.round(
            forecastDay.temp.day
          )}°c</div>
          </div>

          </div>
        
          <div class="card-body">

     

  <div class="forecast-wind">
  <span class="forecast-wind-speed"> <span class="wind-icon material-symbols-outlined">
  air
  </span>${Math.round(forecastDay.wind_speed * 3.6)}km/h        
  </span>

  <div class="forecast-wind-direction"> ${direction[value % 16]} </div>

  </div>
</div>
</div>
`;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", handleSubmit);

let userLocationButton = document.querySelector("#user-location-button");
userLocationButton.addEventListener("click", handleClick);

defineCity("Banff");
