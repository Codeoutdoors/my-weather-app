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

function displayWeatherInformation(response) {
  document.querySelector("#place-name").innerHTML = response.data.name;
  document.querySelector("#current-temperature").innerHTML = Math.round(
    response.data.main.temp
  );
  document.querySelector("#current-feels-like").innerHTML = Math.round(
    response.data.main.feels_like
  );

  document.querySelector("#current-description-icon").innerHTML =
    response.data.weather[0].icon;

  document.querySelector("#current-description").innerHTML =
    response.data.weather[0].description;
  document.querySelector("#current-visibility").innerHTML =
    response.data.visibility;
  document.querySelector("#current-pressure").innerHTML =
    response.data.main.pressure;

  document.querySelector("#current-humidity").innerHTML =
    response.data.main.humidity;
  document.querySelector("#sunrise-time-today").innerHTML =
    response.data.sys.sunrise;
  document.querySelector("#sunset-time-today").innerHTML =
    response.data.sys.sunset;
  document.querySelector("#current-wind-speed").innerHTML = Math.round(
    response.data.wind.speed * 3.6
  );
  document.querySelector("#current-wind-gust").innerHTML = Math.round(
    response.data.wind.gust * 3.6
  );
  document.querySelector("#current-wind-direction").innerHTML =
    response.data.wind.deg;
}

function defineCity(city) {
  let apiKey = "4b3503b2f08a729413c4d33ef1186004";
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(displayWeatherInformation);
}
function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#city-input").value;
  defineCity(city);
  document.querySelector("#search-form").reset();
}
function defineMyLocationAqi(position) {
  let apiKey = "4b3503b2f08a729413c4d33ef1186004";
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
  axios.get(apiUrl).then(displayAqi);
}

function defineMyLocation(position) {
  let apiKey = "4b3503b2f08a729413c4d33ef1186004";
  let units = "metric";
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;
  axios.get(apiUrl).then(displayWeatherInformation);
}

function handleClick(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(defineMyLocation);
  navigator.geolocation.getCurrentPosition(defineMyLocationAqi);
}
let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", handleSubmit);

let userLocationButton = document.querySelector("#user-location-button");
userLocationButton.addEventListener("click", handleClick);

defineCity("Banff");
