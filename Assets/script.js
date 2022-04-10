// City Search and History
var formSubmit = $("#searchBtn");
var cityHistory = $("#cityHistory");

// API data variables and IDs
var thisCity = $("#thisCity");
var currentTemp = $("#temperature");
var currentMax = $("#tempHigh");
var currentMin = $("#tempLow");
var currentWindSpeed = $("#windSpeed");
var currentHumidity = $("#humidity");

//Local Storage
var cityArray = [];
var searchedCities = JSON.parse(localStorage.getItem("search")) || [];
console.log("searched cities: " + searchedCities);




$(document).ready(function(){
    //Start with Forecast Section Hidden
    $("#forecast").hide();
    //Reset currentWeather and futureForecast functions for API calls
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
    event.preventDefault(); //prevent bubbling
    var searchLocation = $("#citySearch");
    var location = searchLocation.val().trim(); //clean off white space
    console.log("location: " + location);
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

//Current Weather API Call
function currentWeather(location) {
    var query1 = "https://api.openweathermap.org/data/2.5/weather?q="+location+"&units=imperial&appid="+APIKey;


    fetch(query1)
    var query1 = "https://api.openweathermap.org/data/2.5/weather?q="+location+"&units=imperial&appid="+APIKey;


    fetch(query1)
        .then(function(response1){
            return response1.json();
        })
        .then(function(data1){
                console.log(data1);
        
        
        //Set Current Weather
        var currentDate = new Date(data1.dt*1000).toLocaleDateString();
        var iconUrl = "https://openweathermap.org/img/wn/"+ data1.weather[0].icon +"@2x.png";
        $(thisCity).html(data1.name + " ("+currentDate+") "+"<img src="+iconUrl+">");
        $(currentTemp).html(data1.main.temp+"°F");
        $(currentMax).html(data1.main.temp_max+"°F");
        $(currentMin).html(data1.main.temp_min+"°F");
        $(currentWindSpeed).html(data1.wind.speed+" MPH");
        $(currentHumidity).html(data1.main.humidity+"%");

        if (query2.cod==200) {
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
    });
    }


//Future Forecast API Calls
function futureForecast(location) {
    var query1 = "https://api.openweathermap.org/data/2.5/weather?q="+location+"&units=imperial&appid="+APIKey;


    fetch(query1)
        .then(function(response1){
            return response1.json();
        })
        .then(function(data1){
            console.log("data1");
            console.log(data1);
        
        var lon = data1.coord.lon
        var lat = data1.coord.lat
        var query2 ="https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+lon+"&units=imperial&appid="+APIKey;

    fetch(query2)
        .then(function(response2){
            return response2.json();
    })
    .then(function(data2){
        console.log("data2");
        console.log(data2);
    //iterate through 5-days
        for (i = 0; i < 5; i++){
            var date = new Date((data2.daily[(i+1)-1].dt)*1000).toLocaleDateString();
            var icon = data2.daily[(i+1)-1].weather[0].icon;
            var iconUrl = "https://openweathermap.org/img/wn/"+icon+".png";
            var temp = data2.daily[(i+1)-1].temp.day+"°F";
            var humidity = data2.daily[(i+1)-1].humidity+"%";
            
            $("#futureDate"+i).html(date);
            $("#futureImg"+i).html("<img src="+iconUrl+">");
            $("#futureTemp"+i).html(temp);
            $("#futureHumidity"+i).html(humidity);
        }
    });
    });
}


getSearchedCities();
if (searchedCities.length > 0){
    currentWeather(searchedCities[searchedCities.length]);
    futureForecast(searchedCities[searchedCities.length]);
};

// Create List of Searched Cities from Local Storage
function getSearchedCities(){
    cityHistory.html("");
    for (var i = 0; i < searchedCities.length;i++){
        var cityLink = document.createElement("input");
        cityLink.setAttribute("type","text");
        cityLink.setAttribute("readonly",true);
        cityLink.setAttribute("class", "form-control d-block bg-white");
        cityLink.setAttribute("value",searchedCities[i]);
        cityLink.addEventListener("click",function(){
            currentWeather(cityLink.value);
        });
        cityHistory.append(cityLink);
    };
}