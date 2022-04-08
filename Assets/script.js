// City Search and History
var formSubmit = $("#searchBtn");
var cityHistoryEl = $("#cityHistory");

// API data variables and IDs
var currentLocation = $("#currentLocation");
var currentTemp = $("#temperature");
var currentFeels = $("#feels-like");
var currentMax = $("#temp-max");
var currentMin = $("#temp-min");
var currentPressure = $("#pressure");
var currentHumidity = $("#humidity");
var currentWindSpeed = $("#wind-speed");

//Local Storage
var cityArray = [];
var searchedCities = JSON.parse(localStorage.getItem("search")) || [];
console.log(searchedCities);


$(document).ready(function(){
    //Start with Forecast Section Hidden
    $("#forecast").hide();
    //currentWeather and futureForecast functions for API calls
    currentWeather(searchedCities[searchedCities.length-1])
    futureForecast(searchedCities[searchedCities.length-1]);
});

function find(l) {
    for (var i = 0; i < cityArray.length; i++){
        if (l.toUpperCase()===cityArray[i]){
            return -1
        }
    }
    return 1;
}

// Location Search
$(formSubmit).on("click",function(event){
    var location;
    var searchLocation = $("#citySearch");
    event.preventDefault(); //prevent bubbling
    location = searchLocation.val().trim(); //clean off white space
    console.log(location);
        // API calls
        currentWeather(location);
        futureForecast(location);
        // Display Forecast Section
        $("#forecast").show();
        // Add Cities to Local Storage
        searchedCities.push(location);
        localStorage.setItem("search",JSON.stringify(searchedCities));
        getSearchedCities();
});

var APIKey = "100d149c99cc6626f466a0c725f37509";

//Current WeatherAPI Call
function currentWeather(location) {
    var requestedURL = "https://api.openweathermap.org/data/2.5/weather?q=" + location + "&units=imperial&appid=" + APIKey;

    fetch(requestedURL)
        .then(function(response){
            return response.json();
        })
        .then(function(data){
        var lon = data.coord.lon
        var lat = data.coord.lat
        var lastURL ="https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + APIKey;

    fetch(lastURL)
        .then(function(mike){
            return mike.json();})

            if (lastURL.cod==200) {
                sCity=JSON.parse(localStorage.getItem("locationName"));
                console.log(sCity);
                if (sCity==null) {
                    sCity=[];
                    sCity.push(location.toUpperCase());
                    localStorage.setItem("locationName",JSON.stringify(sCity));
                    addToList(location);
                }else{
                    if (find(location)>0){
                        sCity.push(location.toUpperCase());
                        localStorage.setItem("locationName",JSON.stringify(sCity));
                        addToList(location);
                    }
                }
            }

            if(data.cod===200) {
                searchLocation=JSON.parse(localStorage.getItem("locationName"));
                console.log(searchLocation);
                if (searchLocation === null) {
                    searchLocation=[];
                    searchLocation.push(location.toUpperCase()
                    );
                    localStorage.setItem("locationName",JSON.stringify(searchLocation));
                    addToList(location);
                }else{
                    if(find(location)>0){
                        searchLocation.push(location.toUpperCase());
                        localStorage.setItem("locationName",JSON.stringify(searchLocation));
                        addToList(location);
                    }
                }
            };
        });
    };


getSearchedCities();
if (searchedCities.length > 0){
    currentWeather(searchedCities[searchedCities.length]);
    futureForecast(searchedCities[searchedCities.length]);
};

// Create List of Searched Cities from Local Storage
function getSearchedCities(){
    cityHistoryEl.html("");
    for (var i = 0; i < searchedCities.length;i++){
        var cityLink = document.createElement("input");
        cityLink.setAttribute("type","text");
        cityLink.setAttribute("readonly",true);
        cityLink.setAttribute("class", "form-control d-block bg-white");
        cityLink.setAttribute("value",searchedCities[i]);
        cityLink.addEventListener("click",function(){
            currentWeather(cityLink.value);
        });
        cityHistoryEl.append(cityLink);
    };
}