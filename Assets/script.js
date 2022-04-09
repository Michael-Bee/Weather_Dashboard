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
console.log(searchedCities);


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

//Current Weather API Call
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
                return mike.json();
            })
            .then(function(leslie){
            console.log(leslie);

        
        //Set Current Weather
        var currentDate = new Date(data.dt*1000).toLocaleDateString();
        var iconUrl = "https://openweathermap.org/img/wn/"+ data.weather[0].icon +"@2x.png";
        $(thisCity).html(data.name + " ("+currentDate+") "+"<img src="+iconUrl+">");
        $(currentTemp).html(data.main.temp+"°F");
        $(currentMax).html(data.main.temp_max+"°F");
        $(currentMin).html(data.main.temp_min+"°F");
        $(currentWindSpeed).html(data.wind.speed+" MPH");
        $(currentHumidity).html(data.main.humidity+"%");

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
    });
    });
};


//Future Forecast API Calls
function futureForecast(location) {
    var requestURL = "https://api.openweathermap.org/data/2.5/weather?q="+location+"&units=imperial&appid=d06b4b9bd23164f4a665e77178e06ab9";


    fetch(requestURL)
        .then(function(response){
            return response.json();
        })
        .then(function(data){
                console.log(data);
        
        var lon = data.coord.lon
        var lat = data.coord.lat
        var lastURL ="https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+lon+"&units=imperial&appid=d06b4b9bd23164f4a665e77178e06ab9";

    fetch(lastURL)
        .then(function(mike){
            return mike.json();
    })
    .then(function(leslie){
            console.log(leslie);
    
        for (i = 0; i < 5; i++){
            var date = new Date((leslie.daily[(i+1)-1].dt)*1000).toLocaleDateString();
            var icon = leslie.daily[(i+1)-1].weather[0].icon;
            var iconUrl = "https://openweathermap.org/img/wn/"+icon+".png";
            var temp = leslie.daily[(i+1)-1].temp.day+"°F";
            var humidity = leslie.daily[(i+1)-1].humidity+"%";
            
       
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