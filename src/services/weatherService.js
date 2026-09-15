import axios from 'axios';
import NodeCache from 'node-cache';
import { APIError } from '../middleware/errorHandler.js';

const cache = new NodeCache({ stdTTL: parseInt(process.env.CACHE_TTL || 600) });

const API_KEY = process.env.OPENWEATHERMAP_API_KEY;
const BASE_URL = process.env.OPENWEATHERMAP_BASE_URL || 'https://api.openweathermap.org/data/2.5';

if (!API_KEY) {
  throw new Error('OPENWEATHERMAP_API_KEY is not set in environment variables');
}

/**
 * Fetch current weather for a location
 */
export const getCurrentWeather = async (city, units = 'metric') => {
  const cacheKey = `weather_current_${city}_${units}`;
  const cached = cache.get(cacheKey);

  if (cached) {
    return { ...cached, cached: true };
  }

  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        q: city,
        appid: API_KEY,
        units,
      },
    });

    const data = formatWeatherData(response.data);
    cache.set(cacheKey, data);

    return { ...data, cached: false };
  } catch (error) {
    if (error.response?.status === 404) {
      throw new APIError(`City "${city}" not found`, 404);
    }
    throw new APIError(`Failed to fetch weather data: ${error.message}`, 500);
  }
};

/**
 * Fetch 5-day forecast for a location
 */
export const getForecast = async (city, units = 'metric') => {
  const cacheKey = `weather_forecast_${city}_${units}`;
  const cached = cache.get(cacheKey);

  if (cached) {
    return { ...cached, cached: true };
  }

  try {
    const response = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        q: city,
        appid: API_KEY,
        units,
      },
    });

    const data = formatForecastData(response.data);
    cache.set(cacheKey, data);

    return { ...data, cached: false };
  } catch (error) {
    if (error.response?.status === 404) {
      throw new APIError(`City "${city}" not found`, 404);
    }
    throw new APIError(`Failed to fetch forecast data: ${error.message}`, 500);
  }
};

/**
 * Fetch weather for multiple cities
 */
export const getMultipleCitiesWeather = async (cities, units = 'metric') => {
  try {
    const promises = cities.map(city => getCurrentWeather(city, units));
    const results = await Promise.allSettled(promises);

    return results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      }
      return {
        city: cities[index],
        error: result.reason.message,
      };
    });
  } catch (error) {
    throw new APIError(`Failed to fetch multiple cities data: ${error.message}`, 500);
  }
};

/**
 * Fetch weather by coordinates (latitude, longitude)
 */
export const getWeatherByCoords = async (lat, lon, units = 'metric') => {
  const cacheKey = `weather_coords_${lat}_${lon}_${units}`;
  const cached = cache.get(cacheKey);

  if (cached) {
    return { ...cached, cached: true };
  }

  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        lat,
        lon,
        appid: API_KEY,
        units,
      },
    });

    const data = formatWeatherData(response.data);
    cache.set(cacheKey, data);

    return { ...data, cached: false };
  } catch (error) {
    throw new APIError(`Failed to fetch weather by coordinates: ${error.message}`, 500);
  }
};

/**
 * Clear cache for a specific city or all
 */
export const clearCache = (city = null) => {
  if (city) {
    const keys = cache.keys();
    keys.forEach(key => {
      if (key.includes(city)) {
        cache.del(key);
      }
    });
  } else {
    cache.flushAll();
  }
};

// Helper functions
function formatWeatherData(data) {
  return {
    city: data.name,
    country: data.sys.country,
    coordinates: {
      lat: data.coord.lat,
      lon: data.coord.lon,
    },
    temperature: {
      current: data.main.temp,
      feels_like: data.main.feels_like,
      min: data.main.temp_min,
      max: data.main.temp_max,
    },
    humidity: data.main.humidity,
    pressure: data.main.pressure,
    visibility: data.visibility,
    weather: {
      main: data.weather[0].main,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
    },
    wind: {
      speed: data.wind.speed,
      deg: data.wind.deg,
      gust: data.wind.gust,
    },
    cloudiness: data.clouds.all,
    sunrise: new Date(data.sys.sunrise * 1000).toISOString(),
    sunset: new Date(data.sys.sunset * 1000).toISOString(),
    timestamp: new Date(data.dt * 1000).toISOString(),
  };
}

function formatForecastData(data) {
  const groupedByDay = {};

  data.list.forEach(item => {
    const date = new Date(item.dt * 1000).toLocaleDateString();

    if (!groupedByDay[date]) {
      groupedByDay[date] = [];
    }

    groupedByDay[date].push({
      time: new Date(item.dt * 1000).toLocaleTimeString(),
      temperature: item.main.temp,
      feels_like: item.main.feels_like,
      weather: {
        main: item.weather[0].main,
        description: item.weather[0].description,
        icon: item.weather[0].icon,
      },
      wind_speed: item.wind.speed,
      humidity: item.main.humidity,
      pressure: item.main.pressure,
      cloudiness: item.clouds.all,
      rain: item.rain ? item.rain['3h'] : 0,
    });
  });

  return {
    city: data.city.name,
    country: data.city.country,
    coordinates: {
      lat: data.city.coord.lat,
      lon: data.city.coord.lon,
    },
    forecast: groupedByDay,
  };
}
