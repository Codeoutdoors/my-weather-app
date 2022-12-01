function formatDate(date) {
  let dayList = date.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[dayList];
  let minute = ("0" + date.getMinutes()).slice(-2);
  let hour = ("0" + date.getHours()).slice(-2);

  return `${day} ${hour}:${minute}`;
}

let timeElement = document.querySelector("#current-time");
let currentTime = new Date();
timeElement.innerHTML = formatDate(currentTime);

function searchCity(city) {
  let apiKey = "4b3503b2f08a729413c4d33ef1186004";
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(displayWeatherInformation);
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#city-input").value;
  searchCity(city);
}

function displayWeatherInformation(response) {
  document.querySelector("#searched-temperature").innerHTML = Math.round(
    response.data.main.temp
  );
  document.querySelector("#searched-type").innerHTML =
    response.data.weather[0].main;
  document.querySelector("#searched-wind").innerHTML = Math.round(
    response.data.wind.speed * 3.6
  );
  document.querySelector("#searched-humidity").innerHTML =
    response.data.main.humidity;
  document.querySelector("#searched-feels").innerHTML = Math.round(
    response.data.main.feels_like
  );
  document.querySelector("#searched-city").innerHTML = response.data.name;
}

let locationButton = document.querySelector("#location-button");

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(retrievePosition);
}
function retrievePosition(position) {
  let apiKey = "4b3503b2f08a729413c4d33ef1186004";
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  axios.get(url).then(displayWeatherInformation);
}

document.querySelector("#search-form").addEventListener("submit", handleSubmit);

searchCity("Banff");
