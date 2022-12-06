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
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
  ];

  document.querySelector("#current-wind-direction").innerHTML =
    direction[value % 16];
}

function displayWeatherInformation(response) {
  document.querySelector("#place-name").innerHTML = response.data.name;
  celsiusTemperature = Math.round(response.data.main.temp);
  let currentTemperature = document.querySelector("#current-temperature");
  currentTemperature.innerHTML = celsiusTemperature;

  let iconElement = document.querySelector("#description-icon");

  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);

  document.querySelector("#current-description").innerHTML =
    response.data.weather[0].description;
  document.querySelector("#current-visibility").innerHTML = Math.round(
    response.data.visibility / 1000
  );

  document.querySelector("#current-humidity").innerHTML =
    response.data.main.humidity;

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
  let day = days[time.getDay()];
  let minute = ("0" + time.getMinutes()).slice(-2);
  let hour = ("0" + time.getHours()).slice(-2);

  let timeElement = document.querySelector("#current-time");

  timeElement.innerHTML = ` ${hour}:${minute} on ${day}`;

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

  document.querySelector("#current-wind-speed").innerHTML = Math.round(
    response.data.wind.speed * 3.6
  );

  let degrees = response.data.wind.deg;

  degToCompass(degrees);
}

function defineCity(city) {
  let apiKey = "4b3503b2f08a729413c4d33ef1186004";
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(defineLocationAqi);
  axios.get(apiUrl).then(displayWeatherInformation);
}

function defineLocationAqi(response) {
  let apiKey = "4b3503b2f08a729413c4d33ef1186004";
  let lat = response.data.coord.lat;
  let lon = response.data.coord.lon;
  let apiUrl = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
  axios.get(apiUrl).then(displayAqi);
}

function defineMyLocation(response) {
  let apiKey = "4b3503b2f08a729413c4d33ef1186004";
  let units = "metric";
  let lat = response.coords.latitude;
  let lon = response.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;
  axios.get(apiUrl).then(displayWeatherInformation);
}
function getCoords(response) {
  let apiKey = "4b3503b2f08a729413c4d33ef1186004";
  let lat = response.coords.latitude;
  let lon = response.coords.longitude;
  let apiUrl = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
  axios.get(apiUrl).then(displayAqi);
}

function handleClick(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(getCoords);
  navigator.geolocation.getCurrentPosition(defineMyLocation);
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#city-input").value;
  defineCity(city);
  document.querySelector("#search-form").reset();
}
function displayFahrenheitTemperature(event) {
  event.preventDefault();
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let fahrenheitTemperature = (14 * 9) / 5 + 32;
  let currentTemperature = document.querySelector("#current-temperature");
  currentTemperature.innerHTML = Math.round(fahrenheitTemperature);
}

function displayCelsiusTemperature(event) {
  event.preventDefault();
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  let currentTemperature = document.querySelector("#current-temperature");
  currentTemperature.innerHTML = Math.round(celsiusTemperature);
}
let celsiusTemperature = null;

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusTemperature);

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", handleSubmit);

let userLocationButton = document.querySelector("#user-location-button");
userLocationButton.addEventListener("click", handleClick);

defineCity("Banff");
