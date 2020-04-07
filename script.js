
/*
submit request for city

create queryURL the user provides
add it history

when data returned
extract:
city name
date
an icon for weather condition
the temperature
humidity
wind-speed
UV index
within UV
three conditoins
add css class 
favorable
moderate
severe
request for 5day forecast
append the data to the page

user clicks the history 
query with that city

api.openweathermap.org/data/2.5/weather?q=London
api key:
 ccc5796d60184c50f2674c57d349cd70
 http://api.openweathermap.org/data/2.5/weather?q=London&appid=ccc5796d60184c50f2674c57d349cd70

api.openweathermap.org/data/2.5/forecast?q={city name}&appid={your api key}

*/

$(document).ready(function () {
  var APIKey = "ccc5796d60184c50f2674c57d349cd70";
  var history = [];
  $("#input-city").val("");

  // This .on("click") function will trigger the AJAX Call
  $("#find-city").on("click", function (event) {
    event.preventDefault();


    var city = $("#input-city").val();
    // building the URL needed to query the database
    var queryURL = generateCityForecastURL(city);
    fetchWeatherData(queryURL);
    getLocalstorage();
    setLocalStorage();
    //document.getElementById("city-form").reset();


  });

  function generateCityForecastURL(city) {

    return "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + APIKey;
  }

  function fetchWeatherData(queryURL) {
    
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(processWeatherData);


  }
  function processWeatherData(response) {
    console.log(response);
    var todaysData = response.list[0];
    renderTodaysWeather(todaysData, response.city);
    renderForecast(response);
    //$(".weather-details").empty();
  }
  function formatTemp(temp) {
    return ((temp - 273.15) * 1.80 + 32).toFixed(1);

  }
  function generateIconURL(icon) {
    return "https://openweathermap.org/img/wn/" + icon + ".png";
  }
  function renderTodaysWeather(todaysData, city) {
    var date = todaysData.dt;
    //console.log(date);
    var formatted_date = new Date(date * 1000).toLocaleDateString();
    console.log(formatted_date);
    var uvLat = city.coord.lat;
    var uvLon = city.coord.lon;
    fetchUVData(uvLat, uvLon);
    var weatherIcon = todaysData.weather[0].icon;

    $("#city-name").append(city.name).append(" (" + formatted_date + ") ").append(`<img id="weatherIcon" src ="${generateIconURL(weatherIcon)}">`);
    var tempF = formatTemp(todaysData.main.temp);

    $("#temperature").append("Temperature: " + tempF + " &#xb0;F");
    $("#humidity").append("Humidity: " + todaysData.main.humidity + " %");
    $("#wind-speed").append("Wind Speed: " + (todaysData.wind.speed * 2.236936).toFixed(1) + " MPH");

  }
  function fetchUVData(uvLat, uvLon) {
    $.ajax({
      url: "https://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat=" + uvLat + "&lon=" + uvLon,
      method: "GET"
    }).then(function (response) {
      $("#UV-index").append("UV Index: " + '<span id= "level">' + response.value + '</span>');
      if (response.value > 0 && response.value < 3) {
        $("#level").addClass("normal");
      } else if (response.value >= 3 && response.value < 6) {
        $("#level").addClass("moderate");
      } else {
        $("#level").addClass("severe");

      }


    });

  }
  function renderForecast(response) {
    $("#fiveDayForecast").html("5-Day Forecast:");
    var days = extractForecastData(response.list);
    console.log(days);
    var cards = $(".card");
    cards.each(function (index, element) {
      var currentCard = $(element);
      var currentData = days[index];
      currentCard.find(".date").html(currentData.date);
      currentCard.find(".icon").attr("src", generateIconURL(currentData.icon));
      currentCard.find(".temp").html("Temp: " + currentData.temp + " &#xb0;F");
      currentCard.find(".humidity").html("Humidity: " + currentData.humidity + "%");


    })
  }
  function extractForecastData(list) {
    var forecastData = [];
    for (var i = 0; i < 40; i += 8) {
      console.log(i);
      var data = {};
      data.date = new Date(list[i].dt * 1000).toLocaleDateString();
      data.icon = list[i].weather[0].icon;
      data.temp = formatTemp(list[i].main.temp);
      data.humidity = list[i].main.humidity;
      forecastData.push(data);
    }
    return forecastData;
  }
  function setLocalStorage() {
    $('input[type="text"]').each(function () {
      var id = $(this).attr('id');
      var value = $(this).val();
      history.push(value)
      localStorage.setItem(id, JSON.stringify(history));

    });
  }
  function getLocalstorage() {
    //var id = $('input[type="text"]').attr('id');

    var value = JSON.parse(localStorage.getItem("input-city"));
    console.log(value)
    if (value === null) {
      return;
    }
    $(".history").empty();
    var ul = $("<ul>");
    for (var i = 0; i < value.length; i++) {
      var li = $("<li>").append(value[i]);
      ul.append(li);
    }
    $(".history").append(ul);
  }
});
