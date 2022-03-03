var city = document.getElementById("citySearch");
var searchCity = document.getElementById("searchBtn");

searchCity.onclick = function (event) {
    event.preventDefault();

    console.log(city.value);
}