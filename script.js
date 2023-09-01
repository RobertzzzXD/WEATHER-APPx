const apiKey = 'dI9oHNeKaWQcvjCUukpJI47rzACdTrPX';
const cities = ['Texas', 'New York'];
const weatherInfo = document.getElementById('weatherInfo');

function fetchWeatherData(city) {
    return fetch(`http://dataservice.accuweather.com/locations/v1/cities/search?q=${city}&apikey=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            if (data.length === 0) {
                alert(`City not found for ${city}.`);
                return null;
            }

            const cityKey = data[0].Key;
            return fetch(`http://dataservice.accuweather.com/forecasts/v1/daily/5day/${cityKey}?apikey=${apiKey}&metric=true`);
        })
        .then(response => response.json())
        .catch(error => {
            console.error(`Error fetching data for ${city}:`, error);
        });
}

function displayWeatherInfo(data, cityName) {
    if (data) {
        const dailyForecasts = data.DailyForecasts;
        for (let i = 0; i < 7; i++) {
            const date = new Date(dailyForecasts[i].Date);
            const dayName = getDayName(date);
            const formattedDate = `${dayName}, ${date.toLocaleDateString()}`;
            const minTemp = dailyForecasts[i].Temperature.Minimum.Value;
            const maxTemp = dailyForecasts[i].Temperature.Maximum.Value;

            const forecast = document.createElement('div');
            forecast.innerHTML = `<strong>${formattedDate} (${cityName}):</strong> Min Temp: ${minTemp}°C, Max Temp: ${maxTemp}°C`;
            weatherInfo.appendChild(forecast);

            // Insert a horizontal line between Texas and New York forecasts for the 5th day
            if (cityName === 'Texas' && i === 4) {
                const lineBreak = document.createElement('hr');
                weatherInfo.appendChild(lineBreak);
            }
        }
    }
}

function getDayName(date) {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return daysOfWeek[date.getDay()];
}

document.getElementById('getWeatherButton').addEventListener('click', () => {
    weatherInfo.innerHTML = '';
    cities.forEach(city => {
        fetchWeatherData(city)
            .then(data => {
                displayWeatherInfo(data, city);
            });
    });
});