import express from 'express';
import {
  getCurrentWeather,
  getForecast,
  getMultipleCitiesWeather,
  getWeatherByCoords,
  clearCache,
} from '../services/weatherService.js';
import { APIError } from '../middleware/errorHandler.js';

const router = express.Router();

/**
 * GET /api/weather/current?city=London&units=metric
 * Fetch current weather for a specific city
 */
router.get('/current', async (req, res, next) => {
  try {
    const { city, units = 'metric' } = req.query;

    if (!city) {
      throw new APIError('City parameter is required', 400);
    }

    const weather = await getCurrentWeather(city, units);
    res.json(weather);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/weather/forecast?city=London&units=metric
 * Fetch 5-day forecast for a specific city
 */
router.get('/forecast', async (req, res, next) => {
  try {
    const { city, units = 'metric' } = req.query;

    if (!city) {
      throw new APIError('City parameter is required', 400);
    }

    const forecast = await getForecast(city, units);
    res.json(forecast);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/weather/multiple?cities=London,Paris,NewYork&units=metric
 * Fetch current weather for multiple cities
 */
router.get('/multiple', async (req, res, next) => {
  try {
    const { cities, units = 'metric' } = req.query;

    if (!cities) {
      throw new APIError('Cities parameter is required (comma-separated)', 400);
    }

    const cityList = cities.split(',').map(c => c.trim());
    const weather = await getMultipleCitiesWeather(cityList, units);
    res.json({ cities: weather });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/weather/coords?lat=51.5074&lon=-0.1278&units=metric
 * Fetch weather by latitude and longitude
 */
router.get('/coords', async (req, res, next) => {
  try {
    const { lat, lon, units = 'metric' } = req.query;

    if (!lat || !lon) {
      throw new APIError('Latitude and longitude parameters are required', 400);
    }

    const weather = await getWeatherByCoords(lat, lon, units);
    res.json(weather);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/weather/cache/clear
 * Clear cache (all or for a specific city)
 */
router.post('/cache/clear', (req, res) => {
  const { city } = req.body;
  clearCache(city);
  res.json({
    message: city ? `Cache cleared for ${city}` : 'All cache cleared',
    timestamp: new Date().toISOString(),
  });
});

export default router;
