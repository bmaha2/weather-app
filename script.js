
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
  // This .on("click") function will trigger the AJAX Call
  $("#find-city").on("click", function (event) {
    event.preventDefault();
    var city = $("#input-city").val();

    // building the URL needed to query the database
    var queryURL = generateCityForecastURL(city);
    fetchWeatherData(queryURL);
    
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

  }
  function formatTemp (temp) {
    return ((temp - 273.15) * 1.80 + 32).toFixed(1);

  }
  function generateIconURL(icon) {
    return "https://openweathermap.org/img/wn/" + icon + ".png";

  }
  function renderTodaysWeather(todaysData, city) {

    var date = todaysData.dt_txt;
    console.log(date);
    var formatted_date = date.split(" ").splice(0, 1);
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
      $("#UV-index").append("UV Index: " + response.value);
    });
  }
  function renderForecast(response) {
    var days = extractForecastData(response.list);
    console.log(days);
    var cards = $(".card");
    cards.each(function(index, element) {
      var currentCard = $(element);
      var currentData = days[index];
      currentCard.find(".date").html(currentData.date);
      currentCard.find(".icon").attr("src",generateIconURL( currentData.icon));
      currentCard.find(".temp").html("Temp: " + currentData.temp + " &#xb0;F");
      currentCard.find(".humidity").html("Humidity: " + currentData.humidity + "%");   
      

    })
  }
  function extractForecastData(list) {
    var forecastData = [];
    for (var i= 0; i < 40; i+=8) {
      console.log(i);
      var data = {};
      data.date = list[i].dt_txt;
      data.icon = list[i].weather[0].icon;
      data.temp = formatTemp(list[i].main.temp);
      data.humidity = list[i].main.humidity;      
      forecastData.push(data);
    }
    return forecastData;
  }
});
