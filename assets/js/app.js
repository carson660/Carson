const gameData = [
  {
    id: "starlight-odyssey",
    title: "星光远征 Starlight Odyssey",
    genres: ["冒险", "角色扮演"],
    platforms: ["PC", "PlayStation"],
    release: 2024,
    rating: 4.8,
    playerCount: "230K",
    description: "在星际航路中建立你的舰队，与伙伴解开三大星域的远古谜题。",
    accent: "linear-gradient(135deg, rgba(99, 240, 255, 0.4), rgba(45, 91, 255, 0.35))",
    upcoming: false,
  },
  {
    id: "ember-strike",
    title: "余烬突袭 Ember Strike",
    genres: ["射击", "竞技"],
    platforms: ["PC", "Xbox"],
    release: 2023,
    rating: 4.6,
    playerCount: "410K",
    description: "快节奏战术射击，动态天气与可破坏场景带来酣畅淋漓的对战体验。",
    accent: "linear-gradient(135deg, rgba(255, 114, 94, 0.4), rgba(255, 180, 86, 0.3))",
    upcoming: false,
  },
  {
    id: "nova-riders",
    title: "新星骑士 Nova Riders",
    genres: ["竞速", "多人"],
    platforms: ["PlayStation", "Xbox", "PC"],
    release: 2022,
    rating: 4.5,
    playerCount: "150K",
    description: "在零重力赛道上驾驶磁悬浮飞行器，参加跨星球巡回赛。",
    accent: "linear-gradient(120deg, rgba(158, 114, 255, 0.45), rgba(75, 222, 255, 0.25))",
    upcoming: false,
  },
  {
    id: "valley-keepers",
    title: "山谷守望 Valley Keepers",
    genres: ["策略", "模拟"],
    platforms: ["PC", "Switch"],
    release: 2021,
    rating: 4.3,
    playerCount: "96K",
    description: "结合城建与塔防的策略作品，带领部落重建被风暴吞噬的山谷。",
    accent: "linear-gradient(140deg, rgba(139, 204, 128, 0.35), rgba(73, 126, 255, 0.2))",
    upcoming: false,
  },
  {
    id: "chronicle-of-echoes",
    title: "回声编年 Chronicle of Echoes",
    genres: ["解谜", "剧情"],
    platforms: ["PC", "Mobile"],
    release: 2019,
    rating: 4.2,
    playerCount: "310K",
    description: "穿梭时间线的互动叙事，破解家族秘密并改写历史。",
    accent: "linear-gradient(150deg, rgba(110, 210, 255, 0.38), rgba(255, 150, 245, 0.25))",
    upcoming: false,
  },
  {
    id: "echo-of-aurora",
    title: "极光回响 Echo of Aurora",
    genres: ["音乐", "独立"],
    platforms: ["Switch", "Mobile"],
    release: 2020,
    rating: 4.7,
    playerCount: "120K",
    description: "跟随极光旋律完成节奏谜题，解锁世界各地的音乐传说。",
    accent: "linear-gradient(135deg, rgba(145, 236, 255, 0.45), rgba(255, 216, 136, 0.25))",
    upcoming: false,
  },
  {
    id: "mech-frontier",
    title: "机甲前线 Mech Frontier",
    genres: ["动作", "合作"],
    platforms: ["PC", "PlayStation", "Xbox"],
    release: 2024,
    rating: 4.9,
    playerCount: "520K",
    description: "驾驶可自定义的巨型机甲，与好友共同抵御外星虫潮。",
    accent: "linear-gradient(120deg, rgba(78, 188, 255, 0.45), rgba(255, 127, 80, 0.3))",
    upcoming: false,
  },
  {
    id: "garden-verse",
    title: "花园诗篇 Garden Verse",
    genres: ["模拟", "休闲"],
    platforms: ["PC", "Mobile"],
    release: 2018,
    rating: 4.1,
    playerCount: "72K",
    description: "打造属于你的梦幻花园，与全球园艺家交换灵感。",
    accent: "linear-gradient(150deg, rgba(172, 236, 124, 0.38), rgba(120, 190, 255, 0.22))",
    upcoming: false,
  },
  {
    id: "rift-walkers",
    title: "裂隙行者 Rift Walkers",
    genres: ["类 Rogue", "合作"],
    platforms: ["PC", "PlayStation"],
    release: 2025,
    rating: 0,
    playerCount: "即将上线",
    description: "多人穿越维度的动作冒险，随机关卡与构筑策略层出不穷。",
    accent: "linear-gradient(140deg, rgba(255, 123, 182, 0.4), rgba(123, 162, 255, 0.3))",
    upcoming: true,
  },
  {
    id: "project-orion",
    title: "猎户计划 Project Orion",
    genres: ["科幻", "沙盒"],
    platforms: ["PC"],
    release: 2024,
    rating: 4.4,
    playerCount: "公测中",
    description: "开放世界太空探索，自由建造空间站并参与星际贸易。",
    accent: "linear-gradient(135deg, rgba(104, 132, 255, 0.4), rgba(112, 246, 255, 0.28))",
    upcoming: true,
  },
];

const state = {
  activeGenre: "all",
  trendingMode: "rating",
  wishlist: new Set(),
};

const selectors = {
  navToggle: document.querySelector(".nav__toggle"),
  navList: document.querySelector(".nav__list"),
  searchForm: document.querySelector(".search"),
  searchInput: document.querySelector("[data-search]"),
  genreFilters: document.querySelector("[data-genre-filters]"),
  releaseFilter: document.querySelector("[data-filter-release]"),
  ratingFilter: document.querySelector("[data-filter-rating]"),
  platformFilter: document.querySelector("[data-filter-platform]"),
  libraryList: document.querySelector("[data-library-list]"),
  emptyState: document.querySelector("[data-empty-state]"),
  trendingList: document.querySelector("[data-trending-list]"),
  trendingButtons: document.querySelectorAll("[data-trending-mode]"),
  wishlistCount: document.querySelector("[data-wishlist-count]"),
  form: document.querySelector("#join"),
  formMessage: document.querySelector("[data-form-message]"),
  yearField: document.querySelector("[data-year]"),
};

const uniqueGenres = Array.from(new Set(gameData.flatMap((game) => game.genres)));
const uniquePlatforms = Array.from(new Set(gameData.flatMap((game) => game.platforms))).sort();

function init() {
  if (!selectors.searchForm) return;
  renderGenreFilters();
  populatePlatformFilter();
  renderLibrary(gameData);
  renderTrending();
  bindEvents();
  updateYear();
}

function renderGenreFilters() {
  const fragment = document.createDocumentFragment();

  uniqueGenres.forEach((genre) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "chip";
    button.dataset.genre = genre;
    button.textContent = genre;
    fragment.appendChild(button);
  });

  selectors.genreFilters.appendChild(fragment);
}

function populatePlatformFilter() {
  const fragment = document.createDocumentFragment();

  uniquePlatforms.forEach((platform) => {
    const option = document.createElement("option");
    option.value = platform;
    option.textContent = platform;
    fragment.appendChild(option);
  });

  selectors.platformFilter.appendChild(fragment);
}

function bindEvents() {
  selectors.searchForm.addEventListener("submit", (event) => event.preventDefault());
  selectors.searchInput.addEventListener("input", applyFilters);
  selectors.releaseFilter.addEventListener("change", applyFilters);
  selectors.ratingFilter.addEventListener("change", applyFilters);
  selectors.platformFilter.addEventListener("change", applyFilters);
  selectors.genreFilters.addEventListener("click", handleGenreClick);

  selectors.trendingButtons.forEach((button) => {
    button.addEventListener("click", () => {
      selectors.trendingButtons.forEach((btn) => btn.classList.remove("is-active"));
      button.classList.add("is-active");
      state.trendingMode = button.dataset.trendingMode;
      renderTrending();
    });
  });

  if (selectors.navToggle && selectors.navList) {
    selectors.navToggle.addEventListener("click", () => {
      const isOpen = selectors.navList.classList.toggle("is-open");
      selectors.navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    document.addEventListener("click", (event) => {
      if (!selectors.navList.contains(event.target) && event.target !== selectors.navToggle && !selectors.navToggle.contains(event.target)) {
        selectors.navList.classList.remove("is-open");
        selectors.navToggle.setAttribute("aria-expanded", "false");
      }
    });

    selectors.navList.addEventListener("click", (event) => {
      const target = event.target;
      if (target instanceof Element) {
        const link = target.closest("a");
        if (link) {
          selectors.navList.classList.remove("is-open");
          selectors.navToggle.setAttribute("aria-expanded", "false");
        }
      }
    });
  }

  if (selectors.form) {
    selectors.form.addEventListener("submit", handleFormSubmit);
  }
}

function handleGenreClick(event) {
  const button = event.target.closest("[data-genre]");
  if (!button) return;

  state.activeGenre = button.dataset.genre;
  selectors.genreFilters.querySelectorAll(".chip").forEach((chip) => chip.classList.remove("is-active"));
  button.classList.add("is-active");
  applyFilters();
}

function applyFilters() {
  const keyword = selectors.searchInput.value.trim().toLowerCase();
  const releaseFilter = selectors.releaseFilter.value;
  const ratingFilter = selectors.ratingFilter.value;
  const platformFilter = selectors.platformFilter.value;

  const filtered = gameData.filter((game) => {
    const matchesKeyword =
      !keyword ||
      game.title.toLowerCase().includes(keyword) ||
      game.genres.some((genre) => genre.toLowerCase().includes(keyword)) ||
      game.description.toLowerCase().includes(keyword);

    const matchesGenre = state.activeGenre === "all" || game.genres.includes(state.activeGenre);

    const matchesRelease =
      releaseFilter === "any" ||
      (releaseFilter === "new" && game.release >= 2023) ||
      (releaseFilter === "recent" && game.release >= 2020 && game.release <= 2022) ||
      (releaseFilter === "classic" && game.release <= 2019);

    const matchesRating = ratingFilter === "any" || game.rating >= parseFloat(ratingFilter);

    const matchesPlatform = platformFilter === "any" || game.platforms.includes(platformFilter);

    return matchesKeyword && matchesGenre && matchesRelease && matchesRating && matchesPlatform;
  });

  renderLibrary(filtered);
}

function renderLibrary(list) {
  selectors.libraryList.innerHTML = "";

  if (!list.length) {
    selectors.emptyState.hidden = false;
    return;
  }
  selectors.emptyState.hidden = true;

  const fragment = document.createDocumentFragment();

  list.forEach((game) => {
    const card = document.createElement("article");
    card.className = "game-card";
    card.style.setProperty("--card-accent", game.accent);

    const header = document.createElement("header");
    const title = document.createElement("h3");
    title.textContent = game.title;
    header.appendChild(title);

    const rating = document.createElement("span");
    rating.innerHTML = `⭐ ${game.rating ? game.rating.toFixed(1) : "即将上线"}`;
    header.appendChild(rating);
    card.appendChild(header);

    const tagList = document.createElement("div");
    tagList.className = "game-card__tags";
    tagList.textContent = `${game.genres.join(" · ")} · ${game.platforms.join(" / ")}`;
    card.appendChild(tagList);

    const description = document.createElement("p");
    description.className = "game-card__description";
    description.textContent = game.description;
    card.appendChild(description);

    const meta = document.createElement("div");
    meta.className = "game-card__meta";
    const release = document.createElement("span");
    release.innerHTML = `🗓️ ${game.release}`;
    meta.appendChild(release);

    const players = document.createElement("span");
    players.innerHTML = `👥 ${game.playerCount}`;
    meta.appendChild(players);
    card.appendChild(meta);

    const button = document.createElement("button");
    button.type = "button";
    button.className = "btn btn--ghost";
    updateWishlistButton(button, state.wishlist.has(game.id));
    button.addEventListener("click", () => toggleWishlist(game.id, button));
    card.appendChild(button);

    fragment.appendChild(card);
  });

  selectors.libraryList.appendChild(fragment);
}

function toggleWishlist(gameId, button) {
  if (state.wishlist.has(gameId)) {
    state.wishlist.delete(gameId);
  } else {
    state.wishlist.add(gameId);
  }

  updateWishlistButton(button, state.wishlist.has(gameId));
  selectors.wishlistCount.textContent = state.wishlist.size;
}

function updateWishlistButton(button, isActive) {
  if (isActive) {
    button.classList.add("btn--primary");
    button.classList.remove("btn--ghost");
    button.textContent = "已在心愿单";
  } else {
    button.classList.add("btn--ghost");
    button.classList.remove("btn--primary");
    button.textContent = "加入心愿单";
  }
}

function renderTrending() {
  selectors.trendingList.innerHTML = "";

  let ranked;
  if (state.trendingMode === "rating") {
    ranked = [...gameData]
      .filter((game) => game.rating)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5);
  } else {
    ranked = [...gameData].filter((game) => game.upcoming).slice(0, 5);
  }

  if (!ranked.length) {
    const item = document.createElement("li");
    item.textContent = "暂无数据";
    selectors.trendingList.appendChild(item);
    return;
  }

  const fragment = document.createDocumentFragment();

  ranked.forEach((game, index) => {
    const item = document.createElement("li");
    item.style.setProperty("--card-accent", game.accent);

    const rank = document.createElement("span");
    rank.className = "rank";
    rank.textContent = index + 1;
    item.appendChild(rank);

    const content = document.createElement("div");
    const title = document.createElement("h3");
    title.textContent = game.title;
    content.appendChild(title);

    const meta = document.createElement("p");
    meta.className = "game-card__tags";
    meta.textContent = `${game.genres.join(" · ")} · ${game.platforms.join(" / ")}`;
    content.appendChild(meta);
    item.appendChild(content);

    const score = document.createElement("span");
    score.innerHTML = state.trendingMode === "rating" ? `⭐ ${game.rating.toFixed(1)}` : "即将上线";
    item.appendChild(score);

    fragment.appendChild(item);
  });

  selectors.trendingList.appendChild(fragment);
}

function handleFormSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const email = formData.get("email");
  const platform = formData.get("platform");

  if (!email || !platform) {
    showFormMessage("请填写完整信息后再提交。", true);
    return;
  }

  showFormMessage("感谢加入 GameQuest！我们会尽快与你联系。");
  event.currentTarget.reset();
}

function showFormMessage(message, isError = false) {
  selectors.formMessage.hidden = false;
  selectors.formMessage.textContent = message;
  selectors.formMessage.style.color = isError ? "#ff7a7a" : "var(--accent)";
  setTimeout(() => {
    selectors.formMessage.hidden = true;
  }, 5000);
}

function updateYear() {
  if (selectors.yearField) {
    selectors.yearField.textContent = new Date().getFullYear();
  }
}

init();
