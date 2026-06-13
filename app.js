const demoStreams = [
  {
    id: "bbb-hls",
    name: "Big Buck Bunny",
    category: "Movies",
    type: "HLS",
    url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
    description: "Public HLS demo stream for validating playback.",
    accent: "#22d3ee",
  },
  {
    id: "sintel-mp4",
    name: "Sintel Trailer",
    category: "Movies",
    type: "MP4",
    url: "https://media.w3.org/2010/05/sintel/trailer.mp4",
    description: "Public MP4 sample from W3C media examples.",
    accent: "#fb7185",
  },
  {
    id: "bbb-mp4",
    name: "Bunny Quick Play",
    category: "Kids",
    type: "MP4",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    description: "Authorized sample video stream for browser testing.",
    accent: "#86efac",
  },
  {
    id: "elephants-mp4",
    name: "Elephant Dream",
    category: "Documentary",
    type: "MP4",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    description: "Open movie sample with a cinematic player preview.",
    accent: "#c084fc",
  },
];

const storageKeys = {
  custom: "elix-custom-streams",
  favorites: "elix-favorites",
  theme: "elix-theme",
};

const state = {
  activeCategory: "All",
  activeView: "home",
  currentStream: null,
  hls: null,
  search: "",
  customStreams: readJson(storageKeys.custom, []),
  favorites: new Set(readJson(storageKeys.favorites, [])),
};

const elements = {
  root: document.documentElement,
  video: document.querySelector("#videoPlayer"),
  overlay: document.querySelector("#playerOverlay"),
  nowCategory: document.querySelector("#nowCategory"),
  nowTitle: document.querySelector("#nowTitle"),
  nowDescription: document.querySelector("#nowDescription"),
  favoriteButton: document.querySelector("#favoriteButton"),
  copyLinkButton: document.querySelector("#copyLinkButton"),
  favoriteCount: document.querySelector("#favoriteCount"),
  searchInput: document.querySelector("#searchInput"),
  categoryTabs: document.querySelector("#categoryTabs"),
  streamGrid: document.querySelector("#streamGrid"),
  resultCount: document.querySelector("#resultCount"),
  sectionKicker: document.querySelector("#sectionKicker"),
  sectionTitle: document.querySelector("#sectionTitle"),
  streamForm: document.querySelector("#streamForm"),
  formStatus: document.querySelector("#formStatus"),
  themeToggle: document.querySelector("#themeToggle"),
  navLinks: [...document.querySelectorAll(".nav-link")],
  scrollButtons: [...document.querySelectorAll("[data-scroll-target]")],
};

init();

function init() {
  applySavedTheme();
  bindEvents();
  renderCategories();
  renderStreams();
  updateFavoriteCount();
  registerServiceWorker();
}

function bindEvents() {
  elements.searchInput.addEventListener("input", (event) => {
    state.search = event.target.value.trim().toLowerCase();
    renderStreams();
  });

  elements.streamForm.addEventListener("submit", handleAddStream);
  elements.favoriteButton.addEventListener("click", toggleCurrentFavorite);
  elements.copyLinkButton.addEventListener("click", copyCurrentUrl);
  elements.themeToggle.addEventListener("click", toggleTheme);

  elements.navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      state.activeView = link.dataset.view;
      state.activeCategory = "All";
      elements.navLinks.forEach((item) => item.classList.toggle("is-active", item === link));
      renderCategories();
      renderStreams();
    });
  });

  elements.scrollButtons.forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelector(`#${button.dataset.scrollTarget}`)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  });
}

function allStreams() {
  return [...demoStreams, ...state.customStreams];
}

function visibleBaseStreams() {
  if (state.activeView === "favorites") {
    return allStreams().filter((stream) => state.favorites.has(stream.id));
  }

  if (state.activeView === "custom") {
    return state.customStreams;
  }

  return allStreams();
}

function renderCategories() {
  const categories = ["All", ...new Set(visibleBaseStreams().map((stream) => stream.category))];
  elements.categoryTabs.innerHTML = "";

  categories.forEach((category) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = category;
    button.classList.toggle("is-active", category === state.activeCategory);
    button.addEventListener("click", () => {
      state.activeCategory = category;
      renderCategories();
      renderStreams();
    });
    elements.categoryTabs.append(button);
  });
}

function renderStreams() {
  const streams = visibleBaseStreams().filter((stream) => {
    const matchesCategory = state.activeCategory === "All" || stream.category === state.activeCategory;
    const haystack = `${stream.name} ${stream.category} ${stream.description}`.toLowerCase();
    return matchesCategory && haystack.includes(state.search);
  });

  elements.sectionKicker.textContent = sectionKicker();
  elements.sectionTitle.textContent = sectionTitle();
  elements.resultCount.textContent = `${streams.length} item${streams.length === 1 ? "" : "s"}`;
  elements.streamGrid.innerHTML = "";

  if (streams.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "No streams match this view. Add an authorized source or clear filters.";
    elements.streamGrid.append(empty);
    return;
  }

  streams.forEach((stream) => {
    elements.streamGrid.append(createStreamCard(stream));
  });
}

function createStreamCard(stream) {
  const card = document.createElement("article");
  card.className = "stream-card";
  card.style.setProperty("--card-accent", stream.accent || "#22d3ee");

  const topline = document.createElement("div");
  topline.className = "card-topline";

  const category = document.createElement("span");
  category.className = "badge";
  category.textContent = stream.category;

  const type = document.createElement("span");
  type.className = "badge";
  type.textContent = stream.type || streamType(stream.url);

  topline.append(category, type);

  const title = document.createElement("h3");
  title.textContent = stream.name;

  const description = document.createElement("p");
  description.textContent = stream.description || "Personal authorized stream.";

  const actions = document.createElement("div");
  actions.className = "card-actions";

  const play = document.createElement("button");
  play.className = "button";
  play.type = "button";
  play.textContent = "Play";
  play.addEventListener("click", () => selectStream(stream));

  const favorite = document.createElement("button");
  favorite.className = "icon-button";
  favorite.type = "button";
  favorite.setAttribute("aria-label", `Toggle favorite for ${stream.name}`);
  favorite.textContent = state.favorites.has(stream.id) ? "♥" : "♡";
  favorite.classList.toggle("is-favorite", state.favorites.has(stream.id));
  favorite.addEventListener("click", () => {
    toggleFavorite(stream.id);
    renderStreams();
  });

  actions.append(play, favorite);
  card.append(topline, title, description, actions);
  return card;
}

function selectStream(stream) {
  state.currentStream = stream;
  elements.nowCategory.textContent = `${stream.category} · ${stream.type || streamType(stream.url)}`;
  elements.nowTitle.textContent = stream.name;
  elements.nowDescription.textContent = stream.description || "Personal authorized stream.";
  elements.overlay.classList.add("is-hidden");
  elements.favoriteButton.disabled = false;
  elements.copyLinkButton.disabled = false;
  updateCurrentFavoriteButton();
  loadVideo(stream.url);
  document.querySelector(".player-card")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function loadVideo(url) {
  destroyHls();
  elements.video.pause();
  elements.video.removeAttribute("src");
  elements.video.load();

  if (isHls(url) && window.Hls?.isSupported()) {
    state.hls = new Hls({
      maxBufferLength: 30,
      enableWorker: true,
    });
    state.hls.loadSource(url);
    state.hls.attachMedia(elements.video);
    state.hls.on(Hls.Events.ERROR, (_, data) => {
      if (data.fatal) {
        showPlayerMessage("This stream could not be loaded. Check the URL and CORS access.");
      }
    });
    return;
  }

  if (isDash(url)) {
    showPlayerMessage("DASH URL saved. Add a DASH-compatible browser/player library to play it.");
    elements.video.src = url;
    return;
  }

  elements.video.src = url;
}

function showPlayerMessage(message) {
  elements.overlay.textContent = message;
  elements.overlay.classList.remove("is-hidden");
}

function handleAddStream(event) {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const url = data.get("url").trim();

  if (!/^https?:\/\//i.test(url)) {
    elements.formStatus.textContent = "Use a valid http(s) stream URL.";
    return;
  }

  const stream = {
    id: `custom-${Date.now()}`,
    name: data.get("name").trim(),
    category: data.get("category").trim(),
    type: streamType(url),
    url,
    description: data.get("description").trim() || "Personal authorized stream.",
    accent: randomAccent(),
  };

  state.customStreams.unshift(stream);
  saveJson(storageKeys.custom, state.customStreams);
  elements.streamForm.reset();
  elements.formStatus.textContent = "Stream saved locally.";
  state.activeView = "custom";
  state.activeCategory = "All";
  elements.navLinks.forEach((link) => {
    link.classList.toggle("is-active", link.dataset.view === "custom");
  });
  renderCategories();
  renderStreams();
}

function toggleCurrentFavorite() {
  if (!state.currentStream) {
    return;
  }
  toggleFavorite(state.currentStream.id);
  updateCurrentFavoriteButton();
  renderStreams();
}

function toggleFavorite(id) {
  if (state.favorites.has(id)) {
    state.favorites.delete(id);
  } else {
    state.favorites.add(id);
  }
  saveJson(storageKeys.favorites, [...state.favorites]);
  updateFavoriteCount();
}

function updateCurrentFavoriteButton() {
  const isFavorite = state.currentStream && state.favorites.has(state.currentStream.id);
  elements.favoriteButton.textContent = isFavorite ? "Remove favorite" : "Add favorite";
}

async function copyCurrentUrl() {
  if (!state.currentStream) {
    return;
  }

  try {
    await navigator.clipboard.writeText(state.currentStream.url);
    elements.copyLinkButton.textContent = "Copied";
    setTimeout(() => {
      elements.copyLinkButton.textContent = "Copy URL";
    }, 1500);
  } catch {
    elements.copyLinkButton.textContent = "Copy failed";
  }
}

function updateFavoriteCount() {
  elements.favoriteCount.textContent = state.favorites.size;
}

function streamType(url) {
  if (isHls(url)) {
    return "HLS";
  }
  if (isDash(url)) {
    return "DASH";
  }
  return "MP4";
}

function isHls(url) {
  return /\.m3u8($|\?)/i.test(url);
}

function isDash(url) {
  return /\.mpd($|\?)/i.test(url);
}

function randomAccent() {
  const accents = ["#22d3ee", "#fb7185", "#86efac", "#c084fc", "#facc15", "#38bdf8"];
  return accents[Math.floor(Math.random() * accents.length)];
}

function sectionKicker() {
  if (state.activeView === "favorites") {
    return "Saved";
  }
  if (state.activeView === "custom") {
    return "Personal";
  }
  return "Explore";
}

function sectionTitle() {
  if (state.activeView === "favorites") {
    return "Favorite streams";
  }
  if (state.activeView === "custom") {
    return "My streams";
  }
  return "Featured streams";
}

function destroyHls() {
  if (state.hls) {
    state.hls.destroy();
    state.hls = null;
  }
}

function applySavedTheme() {
  const theme = localStorage.getItem(storageKeys.theme);
  elements.root.classList.toggle("light", theme === "light");
}

function toggleTheme() {
  const isLight = elements.root.classList.toggle("light");
  localStorage.setItem(storageKeys.theme, isLight ? "light" : "dark");
}

function readJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

function saveJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/service-worker.js").catch(() => {});
  }
}
