const mainCityContainer = document.getElementById("main-cities");
const lsCityContainer = document.getElementById("ls-cards");
const searchButton = document.getElementById("search-button");
const dateSelector = document.getElementById("date-select");
let index = dateSelector.value
console.log(index)
const mainCities = [
  "vilnius",
  "kaunas",
  "klaipeda",
  "siauliai",
  "panevezys",
  "alytus",
];
let savedCities = JSON.parse(localStorage.getItem("savedCities")) || [];

dateSelector.addEventListener('change', function() {
  index = dateSelector.value;
  console.log(index)
  arise();
})

function arise(values = 6) {
  mainCityContainer.innerHTML=""
  for (let i = 0; i < values; i++) {
    const fetcher = async () => {
      const response = await fetch(
        `https://api.meteo.lt/v1/places/${mainCities[i]}/forecasts/long-term`
      );
      const data = await response.json();
      const cityCard = document.createElement("div");
      cityCard.className = "cityCard";
      const cardInfo = document.createElement("p");
      cardInfo.innerText = `${data.place.name}\nTemperature: ${data.forecastTimestamps[index].airTemperature}\nFeels like: ${data.forecastTimestamps[index].feelsLikeTemperature}\n${data.forecastTimestamps[index].conditionCode}`;
      cityCard.append(cardInfo);
      mainCityContainer.append(cityCard);
      const image = document.createElement("img");
      image.src = `./media/${data.forecastTimestamps[index].conditionCode}.png`
      image.alt = `${data.forecastTimestamps[index].conditionCode}`
      cardInfo.append(image)
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
  if (data.error && usrInputVal != 'refresh') {
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
    const image = document.createElement("img");
    image.src = `./media/${data.forecastTimestamps[index].conditionCode}.png`
    image.alt = `${data.forecastTimestamps[index].conditionCode}`
    cardInfo.innerText = `${data.place.name}\nTemperature: ${data.forecastTimestamps[index].airTemperature}\nFeels like: ${data.forecastTimestamps[index].feelsLikeTemperature}\n${data.forecastTimestamps[index].conditionCode}`;
    cardInfo.append(image)
    cityCard.append(cardInfo);
    lsCityContainer.append(cityCard);
    const removeButton = document.createElement('button')
    removeButton.innerText = "Remove"
    removeButton.className = "removeButton"
    removeButton.addEventListener("click", (event) => {
      event.preventDefault()
      savedCities = savedCities.filter(city => city.Name !== data.place.name);
      localStorage.setItem("savedCities", JSON.stringify(savedCities));
      fetcher('refresh')
      lsCities()
      console.log(savedCities)
      console.log(data.place.name)
    })
    cardInfo.append(removeButton)
  });
}

lsCities();
