var API_KEY = '91781f1bc46b0ad54c8ff356c93470fd';
var searchForm = document.getElementById('search-form');
var searchHistory = document.getElementById('search-history');
var currentWeather = document.getElementById('current-weather');
var forecast = document.getElementById('forecast');

searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    var city = document.getElementById('city').value;
    await getWeatherData(city);
});

searchHistory.addEventListener('click', async (e) => {
    if (e.target.classList.contains('history-item')) {
        await getWeatherData(e.target.textContent);
    }
});

async function getWeatherData(city) {
    try {
        var url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
        var response = await fetch(url);
        var data = await response.json();
        var { coord, name } = data;
        var { lat, lon } = coord;
        await getCurrentWeather(lat, lon, name);
        await getForecast(lat, lon);
        addToSearchHistory(name);
    } catch (error) {
        console.error("Error fetching city coordinates:", error);
    }
}

async function getCurrentWeather(lat, lon, name) {
    try {
        var url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&exclude=minutely,hourly,alerts`;
        var response = await fetch(url);
        var data = await response.json();
        displayCurrentWeather(data, name);
    } catch (error) {
        console.error("Error fetching current weather data:", error);
    }
}

async function getForecast(lat, lon) {
    try {
        var url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
        var response = await fetch(url);
        var data = await response.json();
        displayForecast(data);
    } catch (error) {
        console.error("Error fetching forecast data:", error);
    }
}

function displayCurrentWeather(data, name) {
    if (!data.current) {
        console.error("Current weather data is not available.");
        return;
    }

    var { dt, temp, humidity, wind_speed, weather } = data.current;
    var date = new Date(dt * 1000);
    var iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}.png`;

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

function displayForecast(data) {
    var { list } = data;
    var dailyData = list.filter((item) => item.dt_txt.endsWith('12:00:00'));

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
                    
function addToSearchHistory(name) {
var button = document.createElement('button');
button.textContent = name;
button.classList.add('history-item');
searchHistory.appendChild(button);
}
