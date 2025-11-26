function currentWeather(){
fetch("/api/weather?lat=57.44&lon=-2.78")
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
    console.log(data.daily)

    let week = data.daily;
    for(let i = 1, len = week.length; i < len; i++){

      document.querySelector('#date-tommorow').innerHTML = 'Tommorow ' + new Date(week[1].dt * 1000).toDateString();
      let forecastIcon = document.querySelector('.forecast-icon');
      var icon = week[1].weather[0].icon;
      forecastIcon.innerHTML = `<img src="style/icons/${icon}.png">`;
      document.querySelector('#forecast-tommorow-temp').innerHTML = Math.trunc(week[1].temp.day) + '°';

      document.querySelector('#date-d2').innerHTML = new Date(week[2].dt * 1000).toDateString();
      let forecastIconD2 = document.querySelector('.forecast-icon-d2');
      var icon = week[2].weather[0].icon;
      forecastIconD2.innerHTML = `<img src="style/icons/${icon}.png">`;
      document.querySelector('#forecast-d2-temp').innerHTML = Math.trunc(week[2].temp.day) + '°';

      document.querySelector('#date-d3').innerHTML = new Date(week[3].dt * 1000).toDateString();
      let forecastIconD3 = document.querySelector('.forecast-icon-d3');
      var icon = week[3].weather[0].icon;
      forecastIconD3.innerHTML = `<img src="style/icons/${icon}.png">`;
      document.querySelector('#forecast-d3-temp').innerHTML = Math.trunc(week[3].temp.day) + '°';

      document.querySelector('#date-d4').innerHTML = new Date(week[4].dt * 1000).toDateString();
      let forecastIconD4 = document.querySelector('.forecast-icon-d4');
      var icon = week[4].weather[0].icon;
      forecastIconD4.innerHTML = `<img src="style/icons/${icon}.png">`;
      document.querySelector('#forecast-d4-temp').innerHTML = Math.trunc(week[4].temp.day) + '°';

      document.querySelector('#date-d5').innerHTML = new Date(week[5].dt * 1000).toDateString();
      let forecastIconD5 = document.querySelector('.forecast-icon-d5');
      var icon = week[5].weather[0].icon;
      forecastIconD5.innerHTML = `<img src="style/icons/${icon}.png">`;
      document.querySelector('#forecast-d5-temp').innerHTML = Math.trunc(week[5].temp.day) + '°';

      document.querySelector('#date-d6').innerHTML = new Date(week[6].dt * 1000).toDateString();
      let forecastIconD6 = document.querySelector('.forecast-icon-d6');
      var icon = week[6].weather[0].icon;
      forecastIconD6.innerHTML = `<img src="style/icons/${icon}.png">`;
      document.querySelector('#forecast-d6-temp').innerHTML = Math.trunc(week[6].temp.day) + '°';
    }
  })
}

currentWeather();
forecastWeather();
