var APIKey = "&appid=9e2681b8631eb813fdb07a69bd9c0f8d";

var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=";

var citiesArray = localStorage.getItem("items")
  ? JSON.parse(localStorage.getItem("items"))
  : [];

var data = JSON.parse(localStorage.getItem("items"));

var userInput;

$("#city-btn").on("click", function (event) {
  event.preventDefault();

  //line that grabs input from the textbox
  var city = $("#city-input").val().trim();
  console.log("Initial City Search: " + city);

  if ($(this).attr("id") === "city-input") {
    var city = $("#city-input").val().trim();
    userInput = $(city).text();
    console.log(userInput);
  } else {
    userInput = $(this).prev().val();
  }

  citiesArray.push(userInput);
  localStorage.setItem("items", JSON.stringify(citiesArray));
  cityButtons();
  currentCity(city);
});

function currentCity() {
  $(".city").empty();
  $(".temp").empty();
  $(".humidity").empty();
  $(".wind-speed").empty();
  $(".uv-index").empty();

  var city = $("#city-input").val().trim();
  console.log("city searched after currentCity fxn: " + city);

  var citySearchedURL = queryURL + city + APIKey;
  console.log(citySearchedURL);

  $.ajax({
    url: citySearchedURL,
    method: "GET",
  }).then(function (response) {
    var cityName = response.name;
    console.log("city name after API: " + cityName);
    var cityTempK = response.main.temp;
    var cityHumidity = response.main.humidity;
    var cityWindSpeedMetric = response.wind.speed;
    var cityLon = response.coord.lon;
    var cityLat = response.coord.lat;
    uvIndex(cityLon, cityLat);

    //Date Info
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();

    today = mm + "/" + dd + "/" + yyyy;
    //console.log(today);

    //Icon Info
    var weatherIconBaseURL = "https://openweathermap.org/img/wn/";
    var weatherIconSize = "@2x.png";
    var weatherIconEl = response.weather[0].icon;
    var weatherIconURL = weatherIconBaseURL + weatherIconEl + weatherIconSize;
    var weatherIconImg = $("<img>");
    weatherIconImg.attr("src", weatherIconURL);

    $(".city").append(cityName + " (");
    $(".city").append(today + ") ");
    $(".city").append(weatherIconImg);

    //Temp Info
    var cityTempF = ((cityTempK - 273.15) * 1.8 + 32).toFixed(0);
    //console.log(cityTempF);
    $(".temp").append("Temperature: " + cityTempF + " °F");

    //Wind Speed
    var cityWindSpeedMPH = (cityWindSpeedMetric * 2.236936).toFixed(0);
    //console.log("Wind Speed (MPH): " + cityWindSpeedMPH);
    $(".wind-speed").append("Wind Speed: " + cityWindSpeedMPH + " MPH");
  }); //End of function in ajax
}

function uvIndex(cityLon, cityLat) {
  var baseURL = "http://api.openweathermap.org/data/2.5/uvi?";
  var uvIndexAPIURL = baseURL + APIKey + "&lat=" + cityLat + "&lon=" + cityLat;
  //console.log(uvIndexAPIURL);

  $.ajax({
    url: uvIndexAPIURL,
    method: "GET",
  }).then(function (response) {
    var uvIndexVal = response.value;
    //console.log(uvIndexVal);

    $(".uv-index").append("UV Index: ");
    var uvBTN = $("<button>").text(uvIndexVal);
    $(".uv-index").append(uvBTN);

    if (uvIndexVal < 3) {
      console.log("UV Index is favorable");
      uvBTN.css("background-color", "green");
    } else if (uvIndexVal < 6 && uvIndexVal > 2) {
      console.log("UV Index is moderate");
      uvBTN.css("background-color", "yellow");
    } else if (uvIndexVal > 5) {
      console.log("UV Index is severe");
      uvBTN.css("background-color", "red");
    }
  }); //end of function in ajax
}

function cityButtons() {
  for (var i = 0; i < citiesArray.length; i++) {
    var cityList = $("<button>");
    cityList.attr("id", "cityBtnz");
    cityList.text(citiesArray[i]);
    cityList.attr("data-name", citiesArray[i]);
    $(".list-group").prepend(citiesArray[i]);
  }

  $("#cityBtnz").on("click", function (event) {
    event.preventDefault();
    console.log("button was clicked");
    console.log($(this).attr("data-name"));
    var prevCity = $(this).attr("data-name");
    console.log("city button clicked: " + prevCity);

    var city = prevCity;
  });
}
