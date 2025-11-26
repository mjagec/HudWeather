function currentWeather(){
fetch("/api/weather?lat=55.95&lon=-3.19")
  .then(res => res.json())
  .then(data => {
    console.log(data)

    weather = data.weather.map(main =>{
      return `<p style='margin:0;'>${main.main}</p>`;
    }).join('');
    document.querySelector('#current-weather').innerHTML = weather;

    description = data.weather.map(main =>{
      return `<p style='margin:0;'>${main.description}.</p>`;
    }).join('');
    document.querySelector('#description').innerHTML = description;

    let locationIcon = document.querySelector('.weather-icon');
    var {icon} = data.weather[0];
    locationIcon.innerHTML = `<img src="style/icons/${icon}.png">`;

    /* General data */
    var rawDataTemp = data.main.temp
    var removedDecimalTemp = Math.trunc(rawDataTemp);
    document.querySelector('#temp').innerHTML = removedDecimalTemp + '°'

    var rawDataFeelsLike = data.main.feels_like
    var removedDecimalFeelsLike = Math.trunc(rawDataFeelsLike);
    document.querySelector('#feels-like').innerHTML = 'Feels like ' + removedDecimalFeelsLike  + ' °C'
    
    document.querySelector('#humidity').innerHTML = data.main.humidity
    document.querySelector('#pressure').innerHTML = data.main.pressure 
    document.querySelector('#wind-deg').innerHTML = data.wind.deg 
    document.querySelector('#wind-speed').innerHTML = data.wind.speed 
    
    /* Sunrise */
    var sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString("en-US");
    document.querySelector('#sunrise').innerHTML = sunrise

    /* Sunset */
    var sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString("en-US");
    document.querySelector('#sunset').innerHTML = sunset
  })
  .catch(error => console.log("Error, something went wrong"))
}

function forecastWeather(){
  fetch("/api/forecast?lat=53.649&lon=-1.7842")
  .then(res => res.json())
  .then(data => {
    // 5 day / 3 hour forecast returns data.list.
    if (!data || !Array.isArray(data.list)) {
      console.error('Unexpected forecast response', data);
      const statusEl = document.querySelector('#forecast-status');
      if (statusEl) {
        statusEl.textContent = 'Forecast unavailable at the moment.';
      }
      return;
    }

    console.log(data.list)

    const statusEl = document.querySelector('#forecast-status');
    if (statusEl) {
      statusEl.textContent = '';
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
  .catch(error => console.log("Error, something went wrong with forecast", error))
}

currentWeather();
forecastWeather();
