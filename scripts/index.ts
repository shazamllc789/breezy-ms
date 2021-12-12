const cityForm: HTMLFormElement = document.querySelector(".city-form");
const cityInput: HTMLInputElement = document.querySelector(".city-input");
const cards: HTMLElement = document.querySelector(".cards");

const createClose = function (parent: HTMLElement, addAnimation: boolean) {
  const closeCard: HTMLElement = document.createElement("i");
  closeCard.classList.add("fas", "fa-times", "close");
  parent.append(closeCard);
  closeCard.addEventListener("click", () => {
    if (addAnimation) {
      parent.classList.add("remove");
      parent.addEventListener("animationend", function () {
        parent.remove();
      });
    } else {
      parent.remove();
    }
  });
};

const getData = async function (city: string) {
  const ApiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}`;
  const response: Response = await fetch(
    `${ApiURL}&appid=${apiKey}&units=metric`
  );
  // Okay!
  const errorMessage: HTMLElement = document.createElement("p");
  errorMessage.classList.add("error");
  if (response.ok) {
    const data: JSON = await response.json();
    createCard(data);
  } else if (response.status === 404) {
    errorMessage.textContent = `'${cityInput.value}' is not a valid city!`;
    createClose(errorMessage, false);
    cityForm.append(errorMessage);
  }
  cityInput.value = "";
};

const createCard = function (data: any) {
  // Initialize card
  const card: HTMLElement = document.createElement("section");
  card.classList.add("card", "celcius");

  // Destructure Object
  const {
    main: { temp: temp },
    weather: {
      [0]: { main: weather },
    },
    sys: { country: country },
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
    <section>
        <span class='temp'>${
          (icon as any)[weather] || (icon as any)["Clouds"]
        }<span class='temp-number'>${temp}°C</span>
        </span>
        <span class='weather'>${weather}</span>
        <span class='feelslike'>Feels like: ${feelslike}°C</span>
    </section>
    <hr>
    <section>
        <span class='location'>${cityLocation}, ${country}</span>
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
            <span class='temp-number'>${minTemp}°C</span>
        </span>
        <span class='maxtemp'>
            <span class='bold'>Max temperature:</span>
            <span class='temp-number'>${maxTemp}°C</span>
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
  const convert = document.createElement("i");
  convert.classList.add("fas", "fa-exchange-alt", "convert");
  convert.addEventListener("click", () => {
    const tempElements: NodeList = card.querySelectorAll(".temp-number");
    // To Fahrenheit
    // multiply by 1.8 (or 9/5) and add 32.
    if (card.classList.contains("celcius")) {
      Array.from(tempElements, (e) => {
        const element = e!.parentElement.querySelector(".temp-number");
        const tempNumber = Number(
          element.textContent.substring(0, element.textContent.length - 2)
        );
        element.textContent = `${(tempNumber * 1.8 + 32).toFixed(1)}°F`;
      });
      card.classList.toggle("celcius");
      // To Celcius
      // subtract 32 and multiply by . 5556 (or 5/9).
    } else {
      Array.from(tempElements, (e) => {
        const element = e!.parentElement.querySelector(".temp-number");
        const tempNumber = Number(
          element.textContent.substring(0, element.textContent.length - 2)
        );
        element.textContent = `${((tempNumber - 32) * (5 / 9)).toFixed(2)}°C`;
      });
      card.classList.toggle("celcius");
    }
  });
  createClose(card, true);
  card.append(convert);
  cards.append(card);
};

cityForm?.addEventListener("submit", (e: SubmitEvent) => {
  e.preventDefault();
  const city: string = cityInput.value;

  getData(city);
});

const apiKey = "ea390100406a8a63c2e527be8c448e77";
