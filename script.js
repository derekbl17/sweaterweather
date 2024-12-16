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
const savedCities = [];

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
    alert("error no such city");
  } else {
    const userCity = {
      Name: `${data.place.name}`,
    };
    let duplicates = false;
    for (let i = 0; i < savedCities.length; i++) {
      console.log(savedCities);
      console.log(userCity);
      if (JSON.stringify(savedCities[i]) == JSON.stringify(userCity)) {
        alert("city already exists");
        duplicates = true;
        return;
      }
    }
    if (duplicates === false) {
      savedCities.push(userCity);
    }
  }
  lsCities();
};

searchButton.addEventListener("click", (event) => {
  event.preventDefault();
  const userInput = document.getElementById("city-search").value;
  console.log(userInput);
  userInput ? fetcher(userInput) : alert("input cant be empty");
});

function lsCities() {
  if (!savedCities) {
    savedCities = JSON.parse(localStorage.getItem("savedCities"));
  }
  lsCityContainer.innerHTML = "";
  localStorage.setItem(`savedCities`, JSON.stringify(savedCities));
  for (let i = 0; i < savedCities.length; i++) {
    console.log(i);
    const ls = async () => {
      const response = await fetch(
        `https://api.meteo.lt/v1/places/${savedCities[i].Name}/forecasts/long-term`
      );
      const data = await response.json();
      const cityCard = document.createElement("div");
      cityCard.className = "cityCard";
      const cardInfo = document.createElement("p");
      cardInfo.innerText = `${data.place.name}\nTemperature: ${data.forecastTimestamps[2].airTemperature}\nFeels like: ${data.forecastTimestamps[2].feelsLikeTemperature}\n${data.forecastTimestamps[2].conditionCode}`;
      cityCard.append(cardInfo);
      lsCityContainer.append(cityCard);
    };
    ls();
  }
}
lsCities();
