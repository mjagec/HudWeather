const statusEl = document.getElementById('status');
const useLocationBtn = document.getElementById('use-location-btn');
const citySelect = document.getElementById('city-select');

// Simple list of UK cities you support in the dropdown.
// Huddersfield is kept as the default to preserve the original behaviour.
const CITY_COORDS = {
  huddersfield: { name: 'Huddersfield', lat: 53.649, lon: -1.7842 },
  london: { name: 'London', lat: 51.5074, lon: -0.1278 },
  manchester: { name: 'Manchester', lat: 53.4808, lon: -2.2426 },
  birmingham: { name: 'Birmingham', lat: 52.4862, lon: -1.8904 },
  leeds: { name: 'Leeds', lat: 53.8008, lon: -1.5491 },
  glasgow: { name: 'Glasgow', lat: 55.8642, lon: -4.2518 }
};

function setStatus(message) {
  if (statusEl) {
    statusEl.textContent = message;
  }
}

function currentWeather(lat, lon) {
  fetch(`/api/weather?lat=${lat}&lon=${lon}`)
    .then(res => res.json())
    .then(data => {
      console.log(data);

      const weather = data.weather.map(main => {
        return `<p style='margin:0;'>${main.main}</p>`;
      }).join('');
      document.querySelector('#current-weather').innerHTML = weather;

      const description = data.weather.map(main => {
        return `<p style='margin:0;'>${main.description}.</p>`;
      }).join('');
      document.querySelector('#description').innerHTML = description;

      const locationIcon = document.querySelector('.weather-icon');
      const { icon } = data.weather[0];
      locationIcon.innerHTML = `<img src="style/icons/${icon}.png">`;

      /* General data */
      const rawDataTemp = data.main.temp;
      const removedDecimalTemp = Math.trunc(rawDataTemp);
      document.querySelector('#temp').innerHTML = removedDecimalTemp + '°';

      const rawDataFeelsLike = data.main.feels_like;
      const removedDecimalFeelsLike = Math.trunc(rawDataFeelsLike);
      document.querySelector('#feels-like').innerHTML = 'Feels like ' + removedDecimalFeelsLike + ' °C';

      document.querySelector('#humidity').innerHTML = data.main.humidity;
      document.querySelector('#pressure').innerHTML = data.main.pressure;
      document.querySelector('#wind-deg').innerHTML = data.wind.deg;
      document.querySelector('#wind-speed').innerHTML = data.wind.speed;

      /* Sunrise */
      const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString('en-US');
      document.querySelector('#sunrise').innerHTML = sunrise;

      /* Sunset */
      const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString('en-US');
      document.querySelector('#sunset').innerHTML = sunset;
    })
    .catch(error => {
      console.log('Error, something went wrong', error);
      setStatus('Current weather is unavailable at the moment.');
    });
}

function forecastWeather(lat, lon) {
  fetch(`/api/forecast?lat=${lat}&lon=${lon}`)
    .then(res => res.json())
    .then(data => {
      // 5 day / 3 hour forecast returns data.list.
      if (!data || !Array.isArray(data.list)) {
        console.error('Unexpected forecast response', data);
        const forecastStatusEl = document.querySelector('#forecast-status');
        if (forecastStatusEl) {
          forecastStatusEl.textContent = 'Forecast unavailable at the moment.';
        }
        return;
      }

      console.log(data.list);

      const forecastStatusEl = document.querySelector('#forecast-status');
      if (forecastStatusEl) {
        forecastStatusEl.textContent = '';
      }

      // 5 days * 8 entries per day ≈ 40 entries, 3-hour step.
      const list = data.list;

      // Helper to safely read a forecast entry by index
      const getEntry = (idx) => list[idx] || null;

      const updateDay = (index, dateSelector, iconSelector, tempSelector) => {
        const entry = getEntry(index);
        if (!entry) return;

        const date = new Date(entry.dt * 1000).toDateString();
        const icon = entry.weather && entry.weather[0] && entry.weather[0].icon;
        const temp = entry.main && entry.main.temp;

        const dateEl = document.querySelector(dateSelector);
        if (dateEl) {
          dateEl.innerHTML = dateSelector === '#date-tommorow'
            ? 'Tommorow ' + date
            : date;
        }

        const iconEl = document.querySelector(iconSelector);
        if (iconEl && icon) {
          iconEl.innerHTML = `<img src="style/icons/${icon}.png">`;
        }

        const tempEl = document.querySelector(tempSelector);
        if (tempEl && typeof temp === 'number') {
          tempEl.innerHTML = Math.trunc(temp) + '°';
        }
      };

      // Use approx daily steps (8 * 3h = 24h) starting from the next day.
      updateDay(8,  '#date-tommorow',  '.forecast-icon',      '#forecast-tommorow-temp');
      updateDay(16, '#date-d2',        '.forecast-icon-d2',   '#forecast-d2-temp');
      updateDay(24, '#date-d3',        '.forecast-icon-d3',   '#forecast-d3-temp');
      updateDay(32, '#date-d4',        '.forecast-icon-d4',   '#forecast-d4-temp');
      updateDay(40, '#date-d5',        '.forecast-icon-d5',   '#forecast-d5-temp');

    })
    .catch(error => {
      console.log('Error, something went wrong with forecast', error);
      const forecastStatusEl = document.querySelector('#forecast-status');
      if (forecastStatusEl) {
        forecastStatusEl.textContent = 'Forecast unavailable at the moment.';
      }
    });
}

function loadWeatherForCoords(lat, lon, label) {
  if (label) {
    setStatus(`Showing weather for ${label}.`);
  }
  currentWeather(lat, lon);
  forecastWeather(lat, lon);
}

function loadCityByKey(cityKey) {
  const city = CITY_COORDS[cityKey];
  if (!city) return;
  loadWeatherForCoords(city.lat, city.lon, city.name);
  if (citySelect) {
    citySelect.value = cityKey;
  }
}

function loadDefaultCity() {
  // Preserve original behaviour: default to Huddersfield
  loadCityByKey('huddersfield');
}

function getLocationAndLoadWeather(options = {}) {
  const { isAuto = false } = options;

  if (!navigator.geolocation) {
    setStatus('Geolocation is not supported by your browser. Showing default city (Huddersfield).');
    loadDefaultCity();
    return;
  }

  setStatus(isAuto ? 'Detecting your location…' : 'Getting your location…');

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      loadWeatherForCoords(latitude, longitude, 'your current location');
    },
    (err) => {
      console.error(err);
      setStatus('Could not determine your location. Showing default city (Huddersfield).');
      loadDefaultCity();
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
}

if (useLocationBtn) {
  useLocationBtn.addEventListener('click', () => getLocationAndLoadWeather({ isAuto: false }));
}

if (citySelect) {
  citySelect.addEventListener('change', (e) => {
    const cityKey = e.target.value;
    if (!cityKey) return;
    loadCityByKey(cityKey);
  });
}

// Try auto-location on initial load; fall back to Huddersfield if it fails.
window.addEventListener('load', () => {
  getLocationAndLoadWeather({ isAuto: true });
});
