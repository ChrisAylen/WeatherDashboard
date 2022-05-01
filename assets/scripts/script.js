

var weatherApiUrl = 'https://api.openweathermap.org';
var api_Key = 'cfd8ddb77cee9609e1f3befbf11545a3';
//var iconUrl = "http://openweathermap.org/img/w/" + icon + ".png";
var cityName = 'London';
var countryCode = 'uk';
var limit = 5;
var forecastContainer = document.querySelector('#forecast');

getLatsAndLongs(cityName);


function getLatsAndLongs(cityName) {
    //var url2=weatherApiUrl + "/geo/1.0/direct?q=" + cityName +","+stateCode+"," +countryCode + "&limit=" +limit +"&appid="+ API_key;
    var url = weatherApiUrl + "/geo/1.0/direct?q=" + cityName + "&limit=" + limit + "&appid=" + api_Key;
    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            if (!data[0]) {
                alert("City not found");
            }
            //append the search to history
            //fetch the weather for the firstr city
            getWeather(data[0]);

        })
};

function getWeather(location) {
    var lat = location.lat;
    var long = location.lon;
    var city = location.city;
    var url = weatherApiUrl + "/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&units=metric&exclude=minutely,hourly&appid=" + api_Key;

    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            var weather = data.current.weather[0];
            var temp = data.current.temp;
            var temp_min = data.current.temp_min;
            var temp_max = data.current.temp_max;
            var humidity = data.current.humidity;
            var wind = data.current.wind_speed;
            var icon = data.current.weather.icon;

            var city = data.current.name;

            var description = data.current.weather[0].description;

            var timezone = data.current.timezone;
            var date = new Date(data.current.dt * 1000);
            var day = date.getDate();
            var month = date.getMonth() + 1;
            var year = date.getFullYear();
            var dateString = day + '/' + month + '/' + year;

            //render a card

            // var timezoneString = timezone / 3600;
            // var timezoneString = timezoneString.toFixed(2);
            // var timezoneString = timezoneString + ' hours';

            //populate daily data
            var daily = data.daily;
            //loop through daily data
            for (var i = 0; i < 5; i++) {
                //render the daily cards
                var dailyWeather = daily[i];
                var dailyTemp = daily[i].temp.day;
                var dailyIcon = daily[i].weather[0].icon;
                var dailyDescription = daily[i].weather[0].description;
                var dailyDate = new Date(dailyWeather.dt * 1000);
                var dailyDay = dailyDate.getDate();
                var dailyMonth = dailyDate.getMonth() + 1;
                var dailyYear = dailyDate.getFullYear();
                var dailyDateString = dailyDay + '/' + dailyMonth + '/' + dailyYear;

                // var dailyIcon = dailyWeather.weather[0].icon;
                // var dailyDescription = dailyWeather.weather[0].description;
                // var dailyDate = new Date(dailyWeather.dt * 1000);
                // var dailyDay = dailyDate.getDate();
                // var dailyMonth = dailyDate.getMonth() + 1;
                // var dailyYear = dailyDate.getFullYear();
                // var dailyDateString = dailyDay + '/' + dailyMonth + '/' + dailyYear;
                // var weatherObject={
                //     dailyWeather: daily[i],
                //     dailyCity:city,
                //     dailyTemp: daily[i].temp.day,
                //     dailyIcon: daily[i].weather[0].icon,
                //     dailyDescription: daily[i].weather[0].description,
                //     //dailyDate:new Date(dailyWeather.dt * 1000),
                //     dailyDay:dailyWeather.dt.getDate(),
                //     dailyMonth:dailyWeather.dt.getMonth() + 1,
                //     dailyYear:dailyWeather.dt.getFullYear(),
                //     dailyDateString:dailyDay + '/' + dailyMonth + '/' + dailyYear
                //render a card
                renderDailyCard(city, dailyTemp, dailyIcon, dailyDescription, dailyDateString,i);
            }
        })

}


function renderDailyCard(city, dailyTemp, dailyIcon, dailyDescription, dailyDateString, idx) {
    //BUILD THE HTML

                // <div class="card col-15 col-md-3 col-lg-2 bg-dark weather-card" style="height: 18rem;">
                // <img src="..." class="card-img-top" alt="...">
                // <div class="card-body">
                //   <h5 class="card-title">Day 1</h5>
                //   <p class="card-text">Weather info goes here</p>
                // </div>

    var dailyCard = document.createElement('div');
    var img = document.createElement('img');
    var dailyCardBody = document.createElement('div');
    var dailyCardTitle = document.createElement('h5');
    var dailyCardText = document.createElement('p');
    //img.setAttribute('src', dailyIcon);
    img.setAttribute('class', 'card-img-top');
    
    dailyCard.setAttribute('class', 'card col-15 col-md-3 col-lg-2 bg-dark weather-card');
    dailyCard.setAttribute('id', 'dailyCard' + idx);
    dailyCardBody.setAttribute('class', 'card-body');
    dailyCardTitle.setAttribute('class', 'card-title');
    dailyCardTitle.textContent="Day " + (idx+1); //date will go here
    dailyCardText.setAttribute('class', 'card-text');
    dailyCardText.textContent="Weather info goes here";
    //dailyCardTitle.textContent = city;

    //dailyCard.classList.add('daily-card');
    forecastContainer.appendChild(dailyCard);
    dailyCard.appendChild(img);
    dailyCard.appendChild(dailyCardBody);
    dailyCard.appendChild(dailyCardTitle);
    dailyCard.appendChild(dailyCardText);
    //dailyCard.appendChild(cardTitle);

    //forecastContainer.appendChild(img);
    //forecastContainer.appendChild(dailyCardBody);



    // <div class="card col-15 col-md-3 col-lg-2 bg-dark weather-card daily-card" id="dailyCard0"></div>
}













