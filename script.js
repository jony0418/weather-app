//This is the API key that I use to get the data from the API also I use the var to get the elements from the HTML page
var API_KEY = '91781f1bc46b0ad54c8ff356c93470fd';
var searchForm = document.getElementById('search-form');
var searchHistory = document.getElementById('search-history');
var currentWeather = document.getElementById('current-weather');
var forecast = document.getElementById('forecast');
//Here I add the event listener to the search form to get the city from the input and use it to get the weather data
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    var city = document.getElementById('city').value;
    getWeatherData(city);
});
//Here I add the event listener to the search history to get the city from the button and use it to get the weather data
searchHistory.addEventListener('click', (e) => {
    if (e.target.classList.contains('history-item')) {
        getWeatherData(e.target.textContent);
    }
});

//Here is the function to get the weather data I use the argument city to get the data from the API 
function getWeatherData(city) {
    var url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
    //Here I use the fetch function to get the data from the API
    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            //Here I use the destructuring to get the data from the API and the coord and name from the data
            var { coord, name } = data;
            var { lat, lon } = coord;
            getCurrentWeather(lat, lon, name)
                .then((data) => {
                    //Here i call the function to display the current weather
                    displayCurrentWeather(data, name);
                })
            getForecast(lat, lon)
                .then((data) => {
                    //Here I call the function to display the forecast weather
                    displayForecast(data);
                })
                //After that I call the function to add the city to the search history
            addToSearchHistory(name);
        });
}

//This function is to get the current weather from the API using the lat and lon from the previous function 
//I exclude the minutely, hourly and alerts because I only need the current weather
function getCurrentWeather(lat, lon) {
    var url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&exclude=minutely,hourly,alerts`;
    return fetch(url).then((response) => response.json());
}
//In this function I get the forecast weather from the API using the lat and lon from the previous function
//in the documentation is said that is a 3 hour forecast so I use the filter function to get the data that ends with 12:00:00
function getForecast(lat, lon) {
    var url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    return fetch(url).then((response) => response.json());
}
//Here I display the current weather using the data from the API and the name from the previous function
function displayCurrentWeather(data, name) {
    var { dt, temp, humidity, wind_speed, weather } = data.current;
    var date = new Date(dt * 1000);
    var iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}.png`;
//This is the HTML that I use to display the current weather in the page
    currentWeather.innerHTML = `
        <div class="weather-card">
            <h2>${name}</h2>
            <p>${date.toLocaleDateString()}</p>
            <img src="${iconUrl}" alt="${weather[0].description}">
            <p>Temperature: ${temp}°C</p>
            <p>Humidity: ${humidity}%</p>
            <p>Wind Speed: ${wind_speed} m/s</p>
        </div>
    `;
}
//Here I display the forecast weather using the data from the API and the name from the previous function
function displayForecast(data) {
    var { list } = data;
    var dailyData = list.filter((item) => item.dt_txt.endsWith('12:00:00'));
//This is the HTML that I use to display the forecast weather in the page
    forecast.innerHTML = dailyData
        .map((day) => {
            var date = new Date(day.dt * 1000);
            var iconUrl = `https://openweathermap.org/img/wn/${day.weather[0].icon}.png`;
            return `
                <div class="weather-card">
                    <h3>${date.toLocaleDateString()}</h3>
                    <img src="${iconUrl}" alt="${day.weather[0].description}">
                    <p>Temperature: ${day.main.temp}°C</p>
                    <p>Wind Speed: ${day.wind.speed} m/s</p>
                    <p>Humidity: ${day.main.humidity}%</p>
                </div>
            `;
        })
        .join('');
}
//Here I add the city to the search history using the name from the previous function
function addToSearchHistory(name) {
    var button = document.createElement('button');
    button.textContent = name;
    button.classList.add('history-item');
    searchHistory.appendChild(button);
}
