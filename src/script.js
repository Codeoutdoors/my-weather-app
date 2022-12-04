function findMyLocation(position) {
  let apiKey = "4b3503b2f08a729413c4d33ef1186004";
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  axios.get(apiUrl).then(displayWeatherInformation);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(findMyLocation);
}

let userLocationButton = document.querySelector("#user-location-button");
userLocationButton.addEventListener("click", getCurrentLocation);
