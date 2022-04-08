// City Search and History
var formSubmit = $("#searchBtn");
var historyEl = $("#cityHistory");

//Local Storage
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

getSearchedCities();
if (searchedCities.length > 0){
    currentWeather(searchedCities[searchedCities.length]);
    futureForecast(searchedCities[searchedCities.length]);
};

// Reload City from Local Storage
function getSearchedCities(){
    historyEl.html("");
    for (var i = 0; i < searchedCities.length;i++){
        
        var cityLink = document.createElement("input");
        cityLink.setAttribute("type","text");
        cityLink.setAttribute("readonly",true);
        cityLink.setAttribute("class", "form-control d-block bg-white");
        cityLink.setAttribute("value",searchedCities[i]);
        cityLink.addEventListener("click",function(){
            currentWeather(cityLink.value);
        })
        historyEl.append(cityLink);
    }
}