const API_BASE = 'http://localhost:3000/api/weather';
const DEFAULT_CITIES = ['London', 'Paris', 'New York'];
let currentUnit = 'metric';

// DOM Elements
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const unitSelect = document.getElementById('unitSelect');
const weatherCards = document.getElementById('weatherCards');
const errorContainer = document.getElementById('errorContainer');
const forecastSection = document.getElementById('forecastSection');
const forecastContainer = document.getElementById('forecastContainer');

// Event Listeners
searchBtn.addEventListener('click', handleSearch);
cityInput.addEventListener('keypress', (e) => e.key === 'Enter' && handleSearch());
unitSelect.addEventListener('change', (e) => {
  currentUnit = e.target.value;
  loadDefaultCities();
});

// Functions
function showError(message) {
  errorContainer.textContent = message;
  errorContainer.style.display = 'block';
  setTimeout(() => {
    errorContainer.style.display = 'none';
  }, 5000);
}

async function handleSearch() {
  const city = cityInput.value.trim();
  if (!city) {
    showError('Please enter a city name');
    return;
  }

  weatherCards.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px;"><p>Loading...</p></div>';
  forecastSection.style.display = 'none';

  try {
    const [current, forecast] = await Promise.all([
      fetch(`${API_BASE}/current?city=${encodeURIComponent(city)}&units=${currentUnit}`).then(r => r.json()),
      fetch(`${API_BASE}/forecast?city=${encodeURIComponent(city)}&units=${currentUnit}`).then(r => r.json()),
    ]);

    if (current.error) {
      showError(current.error);
      weatherCards.innerHTML = '';
      return;
    }

    displayWeatherCard(current);
    if (forecast.forecast) {
      displayForecast(forecast);
    }
    cityInput.value = '';
  } catch (error) {
    showError('Failed to fetch weather data');
    weatherCards.innerHTML = '';
  }
}

async function loadDefaultCities() {
  weatherCards.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px;"><p>Loading weather data...</p></div>';
  forecastSection.style.display = 'none';

  try {
    const citiesParam = DEFAULT_CITIES.join(',');
    const response = await fetch(`${API_BASE}/multiple?cities=${citiesParam}&units=${currentUnit}`);
    const data = await response.json();

    weatherCards.innerHTML = '';
    data.cities.forEach(city => {
      if (!city.error) {
        displayWeatherCard(city);
      }
    });
  } catch (error) {
    showError('Failed to load default cities');
  }
}

function displayWeatherCard(weather) {
  const weatherIcon = getWeatherIcon(weather.weather.main);
  const tempUnit = currentUnit === 'metric' ? '°C' : '°F';
  const speedUnit = currentUnit === 'metric' ? 'm/s' : 'mph';

  const card = document.createElement('div');
  card.className = 'weather-card';
  card.innerHTML = `
    <div class="card-header">
      <div class="city-info">
        <h2>${weather.city}</h2>
        <p>${weather.country}</p>
      </div>
      <div class="weather-icon">${weatherIcon}</div>
    </div>
    <div class="temperature">${Math.round(weather.temperature.current)}${tempUnit}</div>
    <div class="weather-description">${weather.weather.description}</div>
    <div class="weather-details">
      <div class="detail-item">
        <div class="detail-label">Feels Like</div>
        <div class="detail-value">${Math.round(weather.temperature.feels_like)}${tempUnit}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Humidity</div>
        <div class="detail-value">${weather.humidity}%</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Wind Speed</div>
        <div class="detail-value">${weather.wind.speed} ${speedUnit}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Pressure</div>
        <div class="detail-value">${weather.pressure} hPa</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Visibility</div>
        <div class="detail-value">${(weather.visibility / 1000).toFixed(1)} km</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Cloudiness</div>
        <div class="detail-value">${weather.cloudiness}%</div>
      </div>
    </div>
  `;
  weatherCards.appendChild(card);
}

function displayForecast(forecast) {
  forecastContainer.innerHTML = '';
  let itemCount = 0;

  Object.entries(forecast.forecast).forEach(([date, timeSlots]) => {
    // Take first forecast of each day
    const slot = timeSlots[0];
    const weatherIcon = getWeatherIcon(slot.weather.main);
    const tempUnit = currentUnit === 'metric' ? '°C' : '°F';

    const forecastCard = document.createElement('div');
    forecastCard.className = 'forecast-card';
    forecastCard.innerHTML = `
      <div class="forecast-time">${date}</div>
      <div style="text-align: center; font-size: 2rem;">${weatherIcon}</div>
      <div class="forecast-temp">${Math.round(slot.temperature)}${tempUnit}</div>
      <div class="forecast-condition">${slot.weather.description}</div>
      <div class="detail-label" style="margin-top: 10px;">Humidity: ${slot.humidity}%</div>
    `;
    forecastContainer.appendChild(forecastCard);
    itemCount++;

    if (itemCount >= 5) return; // Show max 5 days
  });

  forecastSection.style.display = 'block';
}

function getWeatherIcon(weatherMain) {
  const iconMap = {
    'Clear': '☀️',
    'Clouds': '☁️',
    'Rain': '🌧️',
    'Drizzle': '🌦️',
    'Thunderstorm': '⛈️',
    'Snow': '❄️',
    'Mist': '🌫️',
    'Smoke': '🌫️',
    'Haze': '🌫️',
    'Dust': '🌪️',
    'Fog': '🌫️',
    'Sand': '🌪️',
    'Ash': '🌫️',
    'Squall': '🌪️',
    'Tornado': '🌪️',
  };
  return iconMap[weatherMain] || '🌡️';
}

// Initialize
loadDefaultCities();
