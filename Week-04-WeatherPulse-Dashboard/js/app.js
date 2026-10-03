/* ==========================================================================
   Week 4: Asynchronous JavaScript & RESTful APIs (WeatherPulse Pro)
   Student: Rekha Kumari | Web Development Internship
   ========================================================================== */

(function() {
  'use strict';

  // REST API Endpoints (Open-Meteo Public API - Zero API Keys Required)
  const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search';
  const FORECAST_API = 'https://api.open-meteo.com/v1/forecast';
  const RECENT_KEY = 'rekha_weather_recent_cities';
  const UNIT_KEY = 'rekha_weather_unit';

  // App State
  let currentUnit = 'c'; // 'c' | 'f'
  let currentCityData = null;
  let currentWeatherRaw = null;

  // DOM Elements
  const searchForm = document.getElementById('search-form');
  const searchInput = document.getElementById('search-input');
  const locateBtn = document.getElementById('locate-btn');
  const errorBanner = document.getElementById('error-banner');
  const errorText = document.getElementById('error-text');
  const recentChipsWrap = document.getElementById('recent-chips');
  const unitCelsiusBtn = document.getElementById('unit-c-btn');
  const unitFahrenheitBtn = document.getElementById('unit-f-btn');

  // Weather Display Containers
  const cityNameEl = document.getElementById('city-name');
  const countryBadgeEl = document.getElementById('country-badge');
  const localTimeEl = document.getElementById('local-time');
  const tempNumberEl = document.getElementById('temp-number');
  const weatherIconEl = document.getElementById('weather-icon');
  const weatherCondEl = document.getElementById('weather-condition');
  const feelsLikeEl = document.getElementById('feels-like-val');

  // Metrics
  const humidityEl = document.getElementById('val-humidity');
  const windSpeedEl = document.getElementById('val-wind');
  const pressureEl = document.getElementById('val-pressure');
  const uvIndexEl = document.getElementById('val-uv');
  const sunriseEl = document.getElementById('val-sunrise');
  const sunsetEl = document.getElementById('val-sunset');

  // Forecast containers
  const hourlyContainer = document.getElementById('hourly-scroll');
  const dailyContainer = document.getElementById('daily-list');

  // Weather Code Mapper
  const WMO_CODES = {
    0: { desc: 'Clear Sky', icon: '☀️' },
    1: { desc: 'Mainly Clear', icon: '🌤️' },
    2: { desc: 'Partly Cloudy', icon: '⛅' },
    3: { desc: 'Overcast', icon: '☁️' },
    45: { desc: 'Foggy', icon: '🌫️' },
    48: { desc: 'Depositing Rime Fog', icon: '🌫️' },
    51: { desc: 'Light Drizzle', icon: '🌦️' },
    53: { desc: 'Moderate Drizzle', icon: '🌧️' },
    55: { desc: 'Dense Drizzle', icon: '🌧️' },
    61: { desc: 'Slight Rain', icon: '🌦️' },
    63: { desc: 'Moderate Rain', icon: '🌧️' },
    65: { desc: 'Heavy Rain', icon: '⛈️' },
    71: { desc: 'Slight Snowfall', icon: '🌨️' },
    73: { desc: 'Moderate Snowfall', icon: '❄️' },
    75: { desc: 'Heavy Snowfall', icon: '❄️' },
    80: { desc: 'Rain Showers', icon: '🌦️' },
    81: { desc: 'Heavy Rain Showers', icon: '🌧️' },
    82: { desc: 'Violent Rain Showers', icon: '⛈️' },
    95: { desc: 'Thunderstorm', icon: '⚡' },
    96: { desc: 'Thunderstorm with Hail', icon: '⛈️' }
  };

  function getWeatherMeta(code) {
    return WMO_CODES[code] || { desc: 'Varied Clouds', icon: '🌤️' };
  }

  // Unit conversion helper
  function formatTemp(tempC) {
    if (tempC === null || tempC === undefined) return '--';
    if (currentUnit === 'f') {
      const tempF = Math.round((tempC * 9/5) + 32);
      return `${tempF}°F`;
    }
    return `${Math.round(tempC)}°C`;
  }

  function formatSpeed(kmh) {
    if (currentUnit === 'f') {
      const mph = Math.round(kmh * 0.621371);
      return `${mph} mph`;
    }
    return `${Math.round(kmh)} km/h`;
  }

  // Error handling
  function showError(msg) {
    errorText.textContent = msg;
    errorBanner.style.display = 'flex';
  }

  function clearError() {
    errorBanner.style.display = 'none';
  }

  // Asynchronous REST API: Geocoding Search
  async function searchCity(query) {
    clearError();
    if (!navigator.onLine) {
      showError('You appear to be offline. Please check your internet connection.');
      return;
    }

    try {
      const url = `${GEOCODING_API}?name=${encodeURIComponent(query)}&count=1&language=en&format=json`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Geocoding service error (${response.status})`);
      }

      const data = await response.json();
      if (!data.results || data.results.length === 0) {
        showError(`No locations found matching "${query}". Please check spelling.`);
        return;
      }

      const location = data.results[0];
      currentCityData = {
        name: location.name,
        country: location.country_code || location.country || '',
        admin: location.admin1 || '',
        lat: location.latitude,
        lon: location.longitude,
        timezone: location.timezone || 'auto'
      };

      saveRecentCity(location.name);
      await fetchWeatherData(location.latitude, location.longitude, location.timezone);

    } catch (err) {
      console.error(err);
      showError(`Network error while fetching location: ${err.message}`);
    }
  }

  // Asynchronous REST API: Telemetry & Multi-Day Forecast
  async function fetchWeatherData(lat, lon, timezone) {
    try {
      const tz = timezone || 'auto';
      const url = `${FORECAST_API}?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure,uv_index&hourly=temperature_2m,weather_code,precipitation_probability&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max&timezone=${encodeURIComponent(tz)}`;

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Weather service error (${res.status})`);
      }

      const weather = await res.json();
      currentWeatherRaw = weather;
      renderWeather();

    } catch (err) {
      console.error(err);
      showError(`Unable to retrieve forecast data: ${err.message}`);
    }
  }

  // Render Dashboard
  function renderWeather() {
    if (!currentCityData || !currentWeatherRaw) return;

    const current = currentWeatherRaw.current;
    const daily = currentWeatherRaw.daily;
    const hourly = currentWeatherRaw.hourly;
    const meta = getWeatherMeta(current.weather_code);

    // City & Hero
    cityNameEl.textContent = currentCityData.name;
    countryBadgeEl.textContent = currentCityData.country.toUpperCase();
    localTimeEl.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    tempNumberEl.textContent = formatTemp(current.temperature_2m);
    weatherIconEl.textContent = meta.icon;
    weatherCondEl.textContent = meta.desc;
    feelsLikeEl.textContent = `Feels like ${formatTemp(current.apparent_temperature)}`;

    // 6 Telemetry Metrics
    humidityEl.textContent = `${current.relative_humidity_2m}%`;
    windSpeedEl.textContent = formatSpeed(current.wind_speed_10m);
    pressureEl.textContent = `${Math.round(current.surface_pressure)} hPa`;
    uvIndexEl.textContent = current.uv_index !== undefined ? current.uv_index : (daily.uv_index_max[0] || 'Moderate');

    if (daily.sunrise && daily.sunrise[0]) {
      sunriseEl.textContent = daily.sunrise[0].split('T')[1].substring(0, 5);
    }
    if (daily.sunset && daily.sunset[0]) {
      sunsetEl.textContent = daily.sunset[0].split('T')[1].substring(0, 5);
    }

    // Render 24-hour horizontal forecast
    renderHourly(hourly);

    // Render 7-day extended forecast
    renderDaily(daily);
  }

  function renderHourly(hourly) {
    if (!hourly || !hourly.time) return;
    const now = new Date();
    const currentHourStr = now.toISOString().substring(0, 13);

    // Grab next 24 hourly steps
    let startIndex = hourly.time.findIndex(t => t.startsWith(currentHourStr));
    if (startIndex === -1) startIndex = 0;

    const slice = hourly.time.slice(startIndex, startIndex + 24);
    hourlyContainer.innerHTML = slice.map((timeStr, idx) => {
      const realIndex = startIndex + idx;
      const hourLabel = timeStr.split('T')[1].substring(0, 5);
      const code = hourly.weather_code[realIndex];
      const tempC = hourly.temperature_2m[realIndex];
      const m = getWeatherMeta(code);

      return `
        <div class="hourly-card ${idx === 0 ? 'active-hour' : ''}">
          <span style="font-size: 0.85rem; color: var(--text-muted);">${idx === 0 ? 'Now' : hourLabel}</span>
          <span style="font-size: 1.8rem;">${m.icon}</span>
          <span style="font-weight: 700;">${formatTemp(tempC)}</span>
        </div>
      `;
    }).join('');
  }

  function renderDaily(daily) {
    if (!daily || !daily.time) return;
    dailyContainer.innerHTML = daily.time.map((dateStr, idx) => {
      const d = new Date(dateStr + 'T00:00:00');
      const dayName = idx === 0 ? 'Today' : d.toLocaleDateString('en-US', { weekday: 'short' });
      const code = daily.weather_code[idx];
      const maxC = daily.temperature_2m_max[idx];
      const minC = daily.temperature_2m_min[idx];
      const m = getWeatherMeta(code);

      return `
        <div class="daily-row">
          <span class="daily-day">${dayName}</span>
          <div class="daily-condition">
            <span style="font-size: 1.4rem;">${m.icon}</span>
            <span>${m.desc}</span>
          </div>
          <div class="daily-temp-bar">
            <span style="color: var(--accent-cyan);">${formatTemp(maxC)}</span>
            <span style="color: var(--text-dim); font-size: 0.9rem;">${formatTemp(minC)}</span>
          </div>
        </div>
      `;
    }).join('');
  }

  // Geolocation Browser API
  function detectLocation() {
    if (!navigator.geolocation) {
      showError('Geolocation is not supported by your current browser.');
      return;
    }

    clearError();
    locateBtn.textContent = 'Detecting...';

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        locateBtn.innerHTML = '&#8982; Detect My Location';
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        currentCityData = {
          name: 'Current Location',
          country: 'GPS',
          lat,
          lon,
          timezone: 'auto'
        };

        await fetchWeatherData(lat, lon, 'auto');
      },
      (err) => {
        locateBtn.innerHTML = '&#8982; Detect My Location';
        showError(`Location access denied or timed out (${err.message}). Please search manually.`);
      },
      { timeout: 10000 }
    );
  }

  // Recent searches management
  function loadRecentCities() {
    const list = JSON.parse(localStorage.getItem(RECENT_KEY) || '["New Delhi", "Tokyo", "London", "San Francisco"]');
    renderRecentChips(list);
  }

  function saveRecentCity(cityName) {
    let list = JSON.parse(localStorage.getItem(RECENT_KEY) || '["New Delhi", "Tokyo", "London", "San Francisco"]');
    list = list.filter(c => c.toLowerCase() !== cityName.toLowerCase());
    list.unshift(cityName);
    if (list.length > 6) list.pop();
    localStorage.setItem(RECENT_KEY, JSON.stringify(list));
    renderRecentChips(list);
  }

  function renderRecentChips(list) {
    recentChipsWrap.innerHTML = list.map(c => `
      <button class="quick-chip" type="button" data-city="${c}">${c}</button>
    `).join('');
  }

  // Unit Switcher
  function setUnit(unit) {
    currentUnit = unit;
    localStorage.setItem(UNIT_KEY, unit);
    if (unit === 'c') {
      unitCelsiusBtn.classList.add('active');
      unitFahrenheitBtn.classList.remove('active');
    } else {
      unitFahrenheitBtn.classList.add('active');
      unitCelsiusBtn.classList.remove('active');
    }
    renderWeather();
  }

  // Event Listeners
  function attachEvents() {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const q = searchInput.value.trim();
      if (q) searchCity(q);
    });

    locateBtn.addEventListener('click', detectLocation);

    recentChipsWrap.addEventListener('click', (e) => {
      const chip = e.target.closest('.quick-chip');
      if (chip) {
        const city = chip.getAttribute('data-city');
        searchInput.value = city;
        searchCity(city);
      }
    });

    unitCelsiusBtn.addEventListener('click', () => setUnit('c'));
    unitFahrenheitBtn.addEventListener('click', () => setUnit('f'));
  }

  // Initial Boot
  function init() {
    const savedUnit = localStorage.getItem(UNIT_KEY) || 'c';
    currentUnit = savedUnit;
    if (savedUnit === 'f') {
      unitFahrenheitBtn.classList.add('active');
      unitCelsiusBtn.classList.remove('active');
    }

    loadRecentCities();
    attachEvents();

    // Default search for New Delhi
    searchCity('New Delhi');
  }

  init();
})();
