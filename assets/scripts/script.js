

var weatherApiUrl = 'https://api.openweathermap.org';
var api_Key = 'cfd8ddb77cee9609e1f3befbf11545a3';

var cityName = '';
//var countryCode = 'uk';
var limit = 5;
var forecastContainer = document.querySelector('#forecast');
var searchForm = document.querySelector('#search-form');
var searchButton = document.getElementById('search-button');
//var searchButton=document.querySelector('#search-button');
var cardTitle = document.querySelector('.card-title');
var cardText = document.querySelector('.card-text');
var searchInput = document.querySelector('#search-input');
var searchHistoryList = document.querySelector('#search-history');
var currentWeather = document.getElementById('current-weather');
cityname = searchForm.textContent;
var searchHistory = [];
//getLatsAndLongs(cityName);
populateSearchHistory()

function getLatsAndLongs(cityName) {
    //var url2=weatherApiUrl + "/geo/1.0/direct?q=" + cityName +","+stateCode+"," +countryCode + "&limit=" +limit +"&appid="+ API_key;
    addSearchTermToHistory(cityName);
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

function addSearchTermToHistory(cityName) {
    if (searchHistory.length < 5) {
        searchHistory.push(cityName);
    }
    else {
        searchHistory.shift();
        searchHistory.push(cityName);
    }
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    populateSearchHistory();
}

function populateSearchHistory() {

    // <li class="my-2">
    //           <button type="submit" class="btn btn-primary" id="history-button" aria-label="submit search">History Item 1</button>
    //         </li>

    var history = JSON.parse(localStorage.getItem('searchHistory'));
    searchHistoryList.innerHTML="";
    if (history) {
        history.forEach(function (city) {
            var li = document.createElement('li');
            li.setAttribute('class', 'my-2');
            var button = document.createElement('button');
            button.setAttribute('type', 'submit');
            button.setAttribute('class', 'btn btn-primary');
            button.setAttribute('id', 'history-button');
            button.setAttribute('aria-label', 'submit search');
            button.textContent = city;
            li.appendChild(button);
            searchHistoryList.appendChild(li);
        });
    }
}


function getWeather(location) {
    var lat = location.lat;
    var long = location.lon;
    var city = location.city;
    var url = weatherApiUrl + "/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&units=metric&exclude=minutely,hourly&appid=" + api_Key;
    forecastContainer.innerHTML = "";
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
            var uv = data.current.uvi;
            var icon = data.current.weather[0].icon;

            var city = data.current.name;

            var description = toTitleCase(data.current.weather[0].description);

            var timezone = data.current.timezone;
            var date = new Date(data.current.dt * 1000);
            var day = date.getDate();
            var month = date.getMonth() + 1;
            var year = date.getFullYear();
            var dateString = day + '/' + month + '/' + year;

            //render a card
            var todayDate = document.createElement('h3');
            var todayTemp = document.createElement('h3');
            var todayDescription = document.createElement('p');
            var todayHumidity = document.createElement('p');
            var todayWind = document.createElement('p');
            var todayUv = document.createElement('p');
            var todayUvButton = document.createElement('button');
            cardText.innerHTML="";
            if (uv < 3) {
                todayUvButton.classList.add('btn-green');
              } else if (uv < 7) {
                todayUvButton.classList.add('btn-amber');
              } else {
                todayUvButton.classList.add('btn-red');
              }

            todayDate.textContent = dateString;
            todayTemp.textContent = 'Temperature: ' + temp + '°C';
            todayDescription.textContent = 'Description: ' + description;
            todayHumidity.textContent = 'Humidity: ' + humidity + '%';
            todayWind.textContent = 'Wind Speed: ' + wind + 'km/h';
            todayUv.textContent = 'UV Index: ' + uv;
            todayUvButton.textContent = 'UV Index: ' + uv;


            currentWeather.appendChild(todayDate);
            currentWeather.appendChild(todayTemp);
            //currentWeather.appendChild(todayWind);
            //currentWeather.appendChild(todayHumidity);
            //currentWeather.appendChild(todayDescription);
            cardText.textContent+=description + ", Humidity: " + humidity + "%,  Wind: " + wind + "km/h";
            currentWeather.appendChild(todayUvButton);
            // cardTitle.textContent = dateString;
            // cardText.textContent = description + " " + temp + "°C";
            // cardText.textContent += " " + humidity + "%";
            // cardText.textContent += " " + wind + "km/h";
            // cardText.textContent += " " + uv + "UV Index";



            var iconUrl = "http://openweathermap.org/img/w/" + icon + ".png";
            //var img = document.createElement('img');
            document.getElementById("iconImg").src = iconUrl;




            //cardText.textContent += " " + temp_min + "°C";


            // var timezoneString = timezone / 3600;
            // var timezoneString = timezoneString.toFixed(2);
            // var timezoneString = timezoneString + ' hours';

            //populate daily data
            var daily = data.daily;
            //loop through daily data

            for (var i = 1; i < 6; i++) {
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
                var dailyCity = daily[i].weather.city;
                var dailyIconUrl = "http://openweathermap.org/img/w/" + dailyIcon + ".png";

                //render a card

                renderDailyCard(dailyCity, dailyTemp, dailyIconUrl, dailyDescription, dailyDateString, i);
            }
        })

}

function toTitleCase(str) {
    return str.replace(
      /\w\S*/g,
      function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
  }
function renderDailyCard(dailyCity, dailyTemp, dailyIcon, dailyDescription, dailyDateString, idx) {
    //BUILD THE HTML


    var dailyCard = document.createElement('div');
    var img = document.createElement('img');
    var dailyCardBody = document.createElement('div');
    var dailyCardTitle = document.createElement('h5');
    var dailyCardText = document.createElement('p');
    var dailyCardDescription = document.createElement('p');
    var dailyCardTemp= document.createElement('p');
    img.setAttribute('class', 'card-img-top weather-daily');
    img.setAttribute('src', dailyIcon);
    dailyCard.setAttribute('class', 'card col-15 col-md-3 col-lg-2 bg-dark weather-card');
    dailyCard.setAttribute('id', 'dailyCard' + idx);
    dailyCardBody.setAttribute('class', 'card-body');
    dailyCardTitle.setAttribute('class', 'card-title');
    dailyCardDescription.textContent = dailyDescription;
    //dailyCardTemp.textContent = dailyTemp + "°C";
    dailyCardTitle.textContent = cityName + " " + dailyDateString//(idx+1); //date will go here
    dailyCardText.setAttribute('class', 'card-text');
    dailyCardText.textContent = dailyTemp + "°C";


    
    forecastContainer.appendChild(dailyCard);
    dailyCard.appendChild(img);
    dailyCard.appendChild(dailyCardBody);
    dailyCard.appendChild(dailyCardTitle);
    dailyCard.appendChild(dailyCardText);
}

function processHistoryClick(event) {
    var button = event.target;
    cityName = button.textContent;
    getLatsAndLongs(cityName);
}



searchButton.addEventListener('click', function (event) {
    event.preventDefault();
    cityName = searchInput.value;
    console.log(`The search was for: ${cityName}`);
    getLatsAndLongs(cityName);
});
searchHistoryList.addEventListener('click', processHistoryClick)












