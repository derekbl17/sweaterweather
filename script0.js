const mainCityContainer = document.getElementById("main-cities");
const lsCityContainer = document.getElementById("ls-cards");
const searchButton = document.getElementById("search-button");
const mainCities = [
  "vilnius",
  "kaunas",
  "klaipeda",
  "siauliai",
  "panevezys",
  "alytus",
];
let savedCities = JSON.parse(localStorage.getItem("savedCities")) || [];

function arise(values = 6) {
  for (let i = 0; i < values; i++) {
    const fetcher = async () => {
      const response = await fetch(
        `https://api.meteo.lt/v1/places/${mainCities[i]}/forecasts/long-term`
      );
      const data = await response.json();
      const cityCard = document.createElement("div");
      cityCard.className = "cityCard";
      const cardInfo = document.createElement("p");
      cardInfo.innerText = `${data.place.name}\nTemperature: ${data.forecastTimestamps[2].airTemperature}\nFeels like: ${data.forecastTimestamps[2].feelsLikeTemperature}\n${data.forecastTimestamps[2].conditionCode}`;
      cityCard.append(cardInfo);
      mainCityContainer.append(cityCard);
    };
    fetcher();
  }
}
arise();

const fetcher = async (usrInputVal) => {
  const response = await fetch(
    `https://api.meteo.lt/v1/places/${usrInputVal}/forecasts/long-term`
  );
  const data = await response.json();
  if (data.error) {
    alert("Error: no such city");
  } else {
    const userCity = {
      Name: `${data.place.name}`,
    };
    const duplicates = savedCities.some(
      (city) => JSON.stringify(city) === JSON.stringify(userCity)
    );
    if (duplicates) {
      alert("City already exists");
    } else {
      savedCities.push(userCity);
      localStorage.setItem("savedCities", JSON.stringify(savedCities));
      lsCities();
    }
  }
};

searchButton.addEventListener("click", (event) => {
  event.preventDefault();
  const userInput = document.getElementById("city-search").value.trim();
  if (userInput) {
    fetcher(userInput);
  } else {
    alert("Input can't be empty");
  }
});

function lsCities() {
  lsCityContainer.innerHTML = "";
  savedCities.forEach(async (city) => {
    const response = await fetch(
      `https://api.meteo.lt/v1/places/${city.Name}/forecasts/long-term`
    );
    const data = await response.json();
    const cityCard = document.createElement("div");
    cityCard.className = "cityCard";
    const cardInfo = document.createElement("p");
    cardInfo.innerText = `${data.place.name}\nTemperature: ${data.forecastTimestamps[2].airTemperature}\nFeels like: ${data.forecastTimestamps[2].feelsLikeTemperature}\n${data.forecastTimestamps[2].conditionCode}`;
    cityCard.append(cardInfo);
    lsCityContainer.append(cityCard);
  });
}

lsCities();
