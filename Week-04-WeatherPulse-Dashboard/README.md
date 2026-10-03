# Week 4: Asynchronous JavaScript & RESTful APIs (WeatherPulse Pro)

**Student Developer:** Rekha Kumari  
**Repository:** [github.com/Rekha-1kumari/clonerC](https://github.com/Rekha-1kumari/clonerC)  
**Due Date:** 31 Oct 2026 (Completed)

---

## Project Overview
WeatherPulse Pro is a real-time meteorological dashboard built with asynchronous JavaScript (`fetch` API and `async/await`), consuming public REST API endpoints to dynamically render live telemetry, 24-hour hourly trendlines, and 7-day extended forecasts.

### Key Features Implemented:
1. **Asynchronous REST Integration:**
   - Powered by the Open-Meteo REST API (completely free, open, zero API key dependencies).
   - Geocoding API: `https://geocoding-api.open-meteo.com/v1/search?name={city}`.
   - Forecast API: `https://api.open-meteo.com/v1/forecast` retrieving current telemetry, hourly steps, and daily forecasts.
2. **Comprehensive Error Handling:**
   - Offline detection using `navigator.onLine`.
   - Comprehensive `try...catch` wrapper with user-friendly error banner and animation.
   - Graceful fallback for non-existent cities or network dropouts.
3. **Dynamic Nested JSON Parsing:**
   - Formats complex nested structures into current conditions, 6 distinct telemetry cards (Humidity, Wind Speed, Surface Pressure, UV Index, Sunrise, Sunset).
   - 24-hour horizontal forecast scroll with active hour highlighting.
   - 7-day extended outlook with high/low temperature ranges.
4. **Geolocation & User Experience:**
   - One-click "Detect My Location" utilizing browser `navigator.geolocation`.
   - Dynamic Celsius (°C) and Fahrenheit (°F) temperature toggle with instant recalculation.
   - Quick search chips for popular cities with `localStorage` search history persistence.

---

## How to Test:
- Open `index.html` in your browser.
- Search for any city worldwide (e.g., Tokyo, London, Paris, Mumbai, Sydney).
- Toggle between °C and °F to observe instant dynamic conversions.
- Click "Detect My Location" to view live coordinates weather.
