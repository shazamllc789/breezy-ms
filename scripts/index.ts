const cityForm: HTMLFormElement = document.querySelector(".city-form");
const cityInput: HTMLInputElement = document.querySelector(".city-input");
const cards: HTMLElement = document.querySelector(".cards");

const getData = async function (city: string) {
  console.log(city);
  const ApiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}`;
  const response: Response = await fetch(
    `${ApiURL}&appid=${apiKey}&units=metric`
  );
  const data: JSON = await response.json();
  cityInput.value = "";
  createCard(data);
};

const createCard = function (data: any) {
  // Initialize card
  const card: HTMLElement = document.createElement("section");
  card.classList.add("card");
  const closeCard: HTMLElement = document.createElement("i");
  closeCard.classList.add("fas", "fa-times", "close");
  closeCard.addEventListener("click", function () {
    this.parentElement.remove();
  });

  // Destructure Object
  const {
    main: { temp: temp },
    weather: {
      [0]: { main: weather },
    },
    main: { feels_like: feelslike },
    name: cityLocation,
    timezone: timezoneOffset,
    main: { humidity: humidity },
    wind: { speed: windSpeed },
    wind: { deg: windDirection },
    main: { temp_min: minTemp },
    main: { temp_max: maxTemp },
  } = data;

  // Translate time

  const d = new Date();
  const [localTime, localOffset] = [d.getTime(), d.getTimezoneOffset() * 60000];
  const utc = localTime + localOffset;
  const a = utc + 1000 * timezoneOffset;
  const cityTime = new Date(a);

  //   const weather: string = data["weather"][0]["main"];
  const icon: Object = {
    Thunderstorm: `<i class="fas fa-bolt"></i>`,
    Drizzle: `<i class="fas fa-cloud-rain"></i>`,
    Rain: `<i class="fas fa-cloud-showers-heavy"></i>`,
    Snow: `<i class="fas fa-snowflake"></i>`,
    Mist: `<i class="fas fa-smog"></i>`,
    Haze: `<i class="fas fa-cloud-sun"></i>`,
    Squall: `<i class="fas fa-cloud-showers-heavy"></i>`,
    Tornado: `<i class="fas fa-wind"></i>`,
    Clear: `<i class="fas fa-sun"></i>`,
    Clouds: `<i class='fas fa-cloud'></i>`,
  };

  card.insertAdjacentHTML(
    "beforeend",
    `
    <i class="fas fa-times close"></i>
    <section>
        <span class='temp'>${
          (icon as any)[weather] || (icon as any)["Clouds"]
        }${temp}°C</span>
        <span class='weather'>${weather}</span>
        <span class='feelslike'>Feels like: ${feelslike}°C</span>
    </section>
    <hr>
    <section>
        <span class='location'>${cityLocation}</span>
        <span class='time'>${cityTime.toLocaleTimeString(navigator.language, {
          hour: "2-digit",
          minute: "2-digit",
        })}</span>
    </section>
    <hr>
    <section class='spread'>
        <span class='humidity'>
            <span class='bold'>Humidity:</span>
            ${humidity}
        </span>
        <span class='windspeed'>
            <span class='bold'>Windspeed:</span>
            ${windSpeed}km/h
        </span>
        <span class='winddirection'>
            <span class='bold'>Wind direction:</span>
            ${windDirection}°
        </span>
    </section>
    <hr>
    <section class='spread'>
        <span class='mintemp'>
            <span class='bold'>Min temperature:</span>
            ${minTemp}°C
        </span>
        <span class='maxtemp'>
            <span class='bold'>Max temperature:</span>
            ${maxTemp}°C
        </span>
    </section>
  `
  );

  // Define card color
  // If < 10 degrees
  const tempNumber = parseInt(temp);
  if (tempNumber <= 7.5) {
    var cardColor = "cold";
  } else if (tempNumber <= 15) {
    var cardColor = "normal";
  } else if (tempNumber <= 22.5) {
    var cardColor = "warm";
  } else {
    var cardColor = "hot";
  }

  // Add color, and finish up the cards
  card.classList!.add(cardColor);
  card.append(closeCard);
  cards.append(card);
};

cityForm?.addEventListener("submit", (e: SubmitEvent) => {
  e.preventDefault();
  const city: string = cityInput.value;

  getData(city);
});

// Close Card

const apiKey = "ea390100406a8a63c2e527be8c448e77";
