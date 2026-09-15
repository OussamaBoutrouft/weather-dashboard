import { describe, it, expect, beforeEach } from '@jest/globals';
import axios from 'axios';
import * as weatherService from '../src/services/weatherService.js';

jest.mock('axios');

describe('Weather Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch current weather successfully', async () => {
    const mockData = {
      name: 'London',
      sys: { country: 'GB', sunrise: 1000, sunset: 2000 },
      coord: { lat: 51.51, lon: -0.13 },
      main: { temp: 20, feels_like: 19, temp_min: 15, temp_max: 25, humidity: 70, pressure: 1013 },
      visibility: 10000,
      weather: [{ main: 'Clouds', description: 'overcast clouds', icon: '04d' }],
      wind: { speed: 5, deg: 180, gust: 10 },
      clouds: { all: 90 },
      dt: 1000,
    };

    axios.get.mockResolvedValue({ data: mockData });

    const result = await weatherService.getCurrentWeather('London', 'metric');

    expect(result).toBeDefined();
    expect(result.city).toBe('London');
    expect(result.temperature.current).toBe(20);
  });

  it('should handle errors when fetching weather', async () => {
    axios.get.mockRejectedValue({ response: { status: 404 } });

    try {
      await weatherService.getCurrentWeather('InvalidCity', 'metric');
    } catch (error) {
      expect(error.status).toBe(404);
    }
  });
});
