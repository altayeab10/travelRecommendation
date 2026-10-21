// TravelBloom: destination search and result rendering.
// Uses the existing travel_recommendation_api.json data structure.
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("conditionInput");
const clearButton = document.getElementById("btnClear");
const resultsContainer = document.getElementById("resultsContainer");
const resultsMessage = document.getElementById("resultsMessage");
const searchButton = document.getElementById("btnSearch");
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

let travelData = null;

async function loadTravelData() {
  // Keep the successful response in memory so each search doesn't fetch JSON again.
  if (travelData) return travelData;

  const response = await fetch("travel_recommendation_api.json");
  if (!response.ok) {
    throw new Error(`Could not load destination data (${response.status}).`);
  }

  travelData = await response.json();
  return travelData;
}

function normalizeText(value) {
  return String(value ?? "").toLowerCase().trim();
}

function findDestinations(data, query) {
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) return [];

  // Category shortcuts take precedence over the broader name and description search.
  const beaches = Array.isArray(data.beaches) ? data.beaches : [];
  const mosques = Array.isArray(data.mosques) ? data.mosques : [];
  const countries = Array.isArray(data.countries) ? data.countries : [];
  const allCities = countries.flatMap(country => Array.isArray(country.cities) ? country.cities : []);

  if (["beach", "beaches"].includes(normalizedQuery)) return beaches;
  if (["mosque", "mosques"].includes(normalizedQuery)) return mosques;
  if (["country", "countries"].includes(normalizedQuery)) return allCities;

  const matchingCities = [];
  countries.forEach(country => {
    const countryName = normalizeText(country.name);
    const cities = Array.isArray(country.cities) ? country.cities : [];

    if (countryName.includes(normalizedQuery)) {
      // A country match returns every city in that country.
      matchingCities.push(...cities);
      return;
    }

    cities.forEach(city => {
      const cityName = normalizeText(city.name);
      const description = normalizeText(city.description);
      if (cityName.includes(normalizedQuery) || description.includes(normalizedQuery)) {
        matchingCities.push(city);
      }
    });
  });

  // Also allow searching for the name of a beach or mosque.
  const matchingSpecialPlaces = [...beaches, ...mosques].filter(place =>
    normalizeText(place.name).includes(normalizedQuery) ||
    normalizeText(place.description).includes(normalizedQuery)
  );

  return [...matchingCities, ...matchingSpecialPlaces];
}

function setMessage(title, description, type = "") {
  resultsMessage.className = `results-message ${type}`.trim();
  resultsMessage.replaceChildren();

  const icon = document.createElement("span");
  icon.className = "message-icon";
  const iconElement = document.createElement("i");
  iconElement.className = type === "error-message"
    ? "fa-solid fa-triangle-exclamation"
    : "fa-regular fa-map";
  icon.appendChild(iconElement);

  const textWrap = document.createElement("div");
  const heading = document.createElement("strong");
  heading.textContent = title;
  const paragraph = document.createElement("p");
  paragraph.textContent = description;
  textWrap.append(heading, paragraph);
  resultsMessage.append(icon, textWrap);
  resultsMessage.hidden = false;
}

function createDestinationCard(place, index) {
  const card = document.createElement("article");
  card.className = "destination-card";
  card.style.animationDelay = `${Math.min(index * 70, 350)}ms`;

  const imageWrap = document.createElement("div");
  imageWrap.className = "destination-image-wrap";

  const image = document.createElement("img");
  image.className = "destination-image";
  image.loading = "lazy";
  image.alt = place.name ? `View of ${place.name}` : "Travel destination";
  image.src = place.imageUrl || "";
  image.addEventListener("error", () => {
    // Keep the card readable if a third-party image URL stops working.
    imageWrap.style.background = "linear-gradient(135deg, #dbe7dc, #a9c2b1)";
    image.removeAttribute("src");
    image.alt = "Image unavailable for this destination";
  }, { once: true });

  const tag = document.createElement("span");
  tag.className = "destination-tag";
  tag.textContent = "DESTINATION";
  imageWrap.append(image, tag);

  const copy = document.createElement("div");
  copy.className = "destination-copy";
  const title = document.createElement("h3");
  title.textContent = place.name || "Untitled destination";
  const description = document.createElement("p");
  description.textContent = place.description || "Discover more about this beautiful place.";
  copy.append(title, description);

  card.append(imageWrap, copy);
  return card;
}

function displayResults(results, query) {
  resultsContainer.replaceChildren();

  if (!results.length) {
    setMessage(
      "No destinations found just yet.",
      `We couldn't find a match for “${query}”. Try “beaches”, “mosques”, “countries”, or a city name.`
    );
    return;
  }

  resultsMessage.hidden = true;
  const count = document.createElement("p");
  count.className = "results-count";
  count.textContent = `${results.length} ${results.length === 1 ? "place" : "places"} found for “${query}”`;
  resultsContainer.appendChild(count);

  const grid = document.createElement("div");
  grid.className = "results-grid";
  results.forEach((place, index) => grid.appendChild(createDestinationCard(place, index)));
  resultsContainer.appendChild(grid);
}

async function performSearch(query) {
  const cleanQuery = query.trim();
  if (!cleanQuery) {
    searchInput.focus();
    setMessage("Start with a destination or category.", "Try “beaches”, “mosques”, “countries”, or a place name.");
    return;
  }

  searchButton.disabled = true;
  searchButton.innerHTML = 'Searching <i class="fa-solid fa-spinner fa-spin"></i>';
  resultsContainer.replaceChildren();
  setMessage("Finding places for you…", "Loading travel recommendations.", "loading-message");

  try {
    const data = await loadTravelData();
    const results = findDestinations(data, cleanQuery);
    displayResults(results, cleanQuery);
  } catch (error) {
    console.error("TravelBloom search error:", error);
    setMessage(
      "We couldn't load destinations.",
      "Please run the project with VS Code Live Server and try again.",
      "error-message"
    );
  } finally {
    searchButton.disabled = false;
    searchButton.innerHTML = 'Search places <i class="fa-solid fa-arrow-right"></i>';
  }
}

searchForm.addEventListener("submit", event => {
  event.preventDefault();
  performSearch(searchInput.value);
});

clearButton.addEventListener("click", () => {
  searchInput.value = "";
  resultsContainer.replaceChildren();
  setMessage(
    "Your next favorite place is out there.",
    "Start with a search above, or choose one of the popular categories."
  );
  searchInput.focus();
});

document.querySelectorAll(".search-chip").forEach(chip => {
  chip.addEventListener("click", () => {
    // Reuse the same search flow for category chips and typed queries.
    const query = chip.dataset.query || "";
    searchInput.value = query;
    performSearch(query);
  });
});

menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.innerHTML = isOpen
    ? '<i class="fa-solid fa-xmark"></i>'
    : '<i class="fa-solid fa-bars"></i>';
});
