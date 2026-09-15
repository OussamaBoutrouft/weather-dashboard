# 🌤️ Weather Dashboard

A real-time weather dashboard that fetches data from OpenWeatherMap API. Get current weather, forecasts, and multi-city weather information with a beautiful, responsive UI.

## Features

✨ **Real-time Weather Data**
- Current weather conditions for any city
- 5-day weather forecast
- Multi-city weather comparison
- Weather by coordinates (latitude/longitude)

📊 **Comprehensive Information**
- Temperature (current, feels like, min, max)
- Humidity and pressure
- Wind speed and direction
- Cloud coverage
- Sunrise/Sunset times
- Visibility

⚡ **Performance**
- Server-side caching (10 minutes default)
- CORS enabled
- Fast API responses
- Error handling

🎨 **Beautiful UI**
- Responsive design (mobile, tablet, desktop)
- Dark theme with gradient effects
- Smooth animations
- Weather-specific icons

## Tech Stack

**Backend:**
- Node.js + Express.js
- Axios for API calls
- Node-Cache for caching
- CORS support

**Frontend:**
- Vanilla JavaScript
- HTML5 + CSS3
- Responsive Grid Layout
- No external dependencies

**API:**
- OpenWeatherMap API (free tier)

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/OussamaBoutrouft/weather-dashboard.git
cd weather-dashboard
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set up Environment Variables
```bash
cp .env.example .env
```

Edit `.env` and add your OpenWeatherMap API key:
```env
OPENWEATHERMAP_API_KEY=your_api_key_here
```

**Get your API key:**
1. Go to [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for free
3. Generate an API key in your dashboard

### 4. Start the Server
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Server runs on `http://localhost:3000`

## API Endpoints

### Get Current Weather
```
GET /api/weather/current?city=London&units=metric
```

**Parameters:**
- `city` (required): City name
- `units` (optional): `metric` or `imperial` (default: `metric`)

**Response:**
```json
{
  "city": "London",
  "country": "GB",
  "temperature": {
    "current": 20,
    "feels_like": 19,
    "min": 15,
    "max": 25
  },
  "humidity": 70,
  "weather": {
    "main": "Clouds",
    "description": "overcast clouds"
  },
  "wind": {
    "speed": 5
  },
  "cached": false
}
```

### Get Forecast
```
GET /api/weather/forecast?city=London&units=metric
```

### Get Multiple Cities
```
GET /api/weather/multiple?cities=London,Paris,NewYork&units=metric
```

### Get Weather by Coordinates
```
GET /api/weather/coords?lat=51.5074&lon=-0.1278&units=metric
```

### Clear Cache
```
POST /api/weather/cache/clear

Body: { "city": "London" }  // optional
```

## Usage

### Via Web Interface
1. Open `public/index.html` in your browser
2. Enter a city name and press Search
3. View current weather and 5-day forecast
4. Toggle between Celsius and Fahrenheit

### Via API
```bash
# Get current weather
curl "http://localhost:3000/api/weather/current?city=London"

# Get forecast
curl "http://localhost:3000/api/weather/forecast?city=Paris"

# Get multiple cities
curl "http://localhost:3000/api/weather/multiple?cities=London,Paris,Tokyo"
```

## File Structure

```
weather-dashboard/
├── src/
│   ├── server.js              # Express server entry point
│   ├── middleware/
│   │   └── errorHandler.js    # Error handling middleware
│   ├── routes/
│   │   └── weather.js         # Weather API routes
│   └── services/
│       └── weatherService.js  # Weather API logic & caching
├── public/
│   ├── index.html             # Frontend HTML
│   ├── styles.css             # Styling
│   └── app.js                 # Frontend JavaScript
├── tests/
│   └── weatherService.test.js # Unit tests
├── .env.example               # Environment template
├── package.json               # Dependencies
└── README.md                  # This file
```

## Configuration

### Environment Variables
```env
# API Configuration
OPENWEATHERMAP_API_KEY=your_key
OPENWEATHERMAP_BASE_URL=https://api.openweathermap.org/data/2.5

# Server
PORT=3000
NODE_ENV=development

# Cache TTL in seconds (default 600 = 10 minutes)
CACHE_TTL=600

# CORS
CORS_ORIGIN=*
```

## Performance & Caching

- API responses are cached server-side for **10 minutes** by default
- Reduce API calls and improve response times
- Configure cache TTL via `CACHE_TTL` environment variable
- Clear cache via `POST /api/weather/cache/clear`

## Error Handling

```json
{
  "error": "City \"InvalidCity\" not found",
  "status": 404,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Common Errors:**
- `400`: Missing required parameters
- `404`: City not found
- `500`: Server error (check API key)

## Testing

```bash
npm test
```

Tests use Jest and are located in the `tests/` directory.

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Rate Limiting

OpenWeatherMap Free Tier:
- 60 calls per minute
- 1,000,000 calls per month

The server-side caching helps stay within these limits.

## Troubleshooting

### "API key not found"
- Make sure `.env` file exists
- Verify `OPENWEATHERMAP_API_KEY` is set correctly
- Restart the server

### "City not found"
- Check spelling
- Use English city names
- Try with country code: "London, GB"

### CORS errors
- Update `CORS_ORIGIN` in `.env`
- Default is `*` (allow all origins)

### Slow responses
- Check cache status (responses marked with `"cached": true` are faster)
- Clear cache if data seems stale: `POST /api/weather/cache/clear`

## Future Enhancements

- 📍 Geolocation support
- 📈 Historical data charts
- 🔔 Weather alerts
- 🌍 Map view
- 💾 Favorites/Bookmarks
- 📱 PWA support
- 🌙 Light/Dark theme toggle

## Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Support

Having issues? 
- Check the [Troubleshooting](#troubleshooting) section
- Open an [GitHub Issue](https://github.com/OussamaBoutrouft/weather-dashboard/issues)
- Check [OpenWeatherMap Docs](https://openweathermap.org/api)

## Author

**OussamaBoutrouft**
- GitHub: [@OussamaBoutrouft](https://github.com/OussamaBoutrouft)

## Acknowledgments

- [OpenWeatherMap API](https://openweathermap.org/api) for weather data
- [Express.js](https://expressjs.com/) framework
- [Node.js](https://nodejs.org/) runtime

---

**Made with ❤️ | Weather Dashboard v1.0.0**
