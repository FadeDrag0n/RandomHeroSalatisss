const heroName = document.getElementById("heroName");
const roulette = document.getElementById("roulette");
const spinBtn = document.getElementById("spinBtn");
const filterButtons = document.querySelectorAll(".filters button");

const activeFilters = new Set();

const welcomeOverlay = document.getElementById("welcomeOverlay");
const resultOverlay = document.getElementById("resultOverlay");
const resultHeroName = document.getElementById("resultHeroName");
const resultHeroImg = document.getElementById("resultHeroImg");

function closeWelcome() {
  welcomeOverlay.style.display = "none";
}

function closeResult() {
  resultOverlay.style.display = "none";
}

function reroll() {
  resultOverlay.style.display = "none";
  spinBtn.click();
}

/* ---------- ГЕРОИ ---------- */

const heroes = [
  { name: "Енчантрес", file: "enchantress.png", attr: "Ловкость" },
  { name: "Джакиро", file: "jakiro.png", attr: "Интеллект" },
  { name: "Скаймаг", file: "skywrath_mage.png", attr: "Интеллект" },
  { name: "Снепфайр", file: "snapfire.png", attr: "Ловкость" },
  { name: "Шадоушаман", file: "shadow_shaman.png", attr: "Интеллект" },
  { name: "Марси", file: "marci.png", attr: "Универсал" },
  { name: "Лион", file: "lion.png", attr: "Интеллект" },
  { name: "Лич", file: "lich.png", attr: "Интеллект" },
  { name: "Виверна", file: "winter_wyvern.png", attr: "Интеллект" },
  { name: "Феникс", file: "phoenix.png", attr: "Универсал" },
  { name: "Дазл", file: "dazzle.png", attr: "Интеллект" },
  { name: "Оракл", file: "oracle.png", attr: "Интеллект" },
  { name: "Пугна", file: "pugna.png", attr: "Интеллект" },
  { name: "Трент", file: "treant.png", attr: "Сила" },
  { name: "Сайленсер", file: "silencer.png", attr: "Интеллект" },
  { name: "Бейн", file: "bane.png", attr: "Интеллект" },
  { name: "Дизраптор", file: "disruptor.png", attr: "Интеллект" },
  { name: "Висп", file: "wisp.png", attr: "Универсал" },
  { name: "Шадоудемон", file: "shadow_demon.png", attr: "Интеллект" },
];

const basePool = [
  "Енчантрес",
  "Джакиро",
  "Скаймаг",
  "Снепфайр",
  "Шадоушаман",
  "Марси",
];
const favorites = ["Скаймаг", "Шадоушаман", "Снепфайр"];

const damage = [
  "Енчантрес",
  "Джакиро",
  "Скаймаг",
  "Снепфайр",
  "Лион",
  "Лич",
  "Феникс",
];
const control = [
  "Бейн",
  "Дизраптор",
  "Лион",
  "Шадоушаман",
  "Сайленсер",
  "Скаймаг",
  "Трент",
];
const save = [
  "Дазл",
  "Енчантрес",
  "Оракл",
  "Феникс",
  "Пугна",
  "Шадоудемон",
  "Виверна",
  "Висп",
];

/* ---------- ФИЛЬТРЫ ---------- */

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const filter = btn.dataset.filter;

    if (filter === "newHeroes") activeFilters.delete("favorites");
    if (filter === "favorites") activeFilters.delete("newHeroes");

    if (activeFilters.has(filter)) {
      activeFilters.delete(filter);
      btn.classList.remove("active");
    } else {
      activeFilters.add(filter);
      btn.classList.add("active");
    }

    // выключаем взаимоисключающую кнопку визуально
    filterButtons.forEach((b) => {
      if (b.dataset.filter === "newHeroes" && activeFilters.has("favorites"))
        b.classList.remove("active");
      if (b.dataset.filter === "favorites" && activeFilters.has("newHeroes"))
        b.classList.remove("active");
    });
  });
});

/* ---------- ПУЛ ---------- */

function getPool() {
  let pool;

  if (activeFilters.has("newHeroes")) {
    pool = heroes.filter((h) => !basePool.includes(h.name));
  } else if (activeFilters.has("favorites")) {
    pool = heroes.filter((h) => favorites.includes(h.name));
  } else {
    pool = heroes.filter((h) => basePool.includes(h.name));
  }

  if (activeFilters.has("damage"))
    pool = pool.filter((h) => damage.includes(h.name));

  if (activeFilters.has("control"))
    pool = pool.filter((h) => control.includes(h.name));

  if (activeFilters.has("save"))
    pool = pool.filter((h) => save.includes(h.name));

  return pool;
}

/* ---------- РУЛЕТКА ---------- */

function renderRoulette(pool) {
  roulette.innerHTML = "";
  let extended = [];

  for (let i = 0; i < 20; i++) {
    extended = extended.concat(pool);
  }

  extended.forEach((hero) => {
    const img = document.createElement("img");
    img.src = "content/" + hero.file;
    roulette.appendChild(img);
  });

  return extended;
}

spinBtn.addEventListener("click", () => {
  const pool = getPool();

  if (pool.length === 0) {
    heroName.innerText = "Нет героев под выбранные критерии!";
    return;
  }

  roulette.innerHTML = "";

  // Бесконечная прокрутка — очень длинная лента
  let extended = [];
  for (let i = 0; i < 40; i++) {
    extended = extended.concat(pool);
  }

  extended.forEach((hero) => {
    const img = document.createElement("img");
    img.src = "content/" + hero.file;
    roulette.appendChild(img);
  });

  // Новый механизм выпадения
  const randomIndex = Math.floor(Math.random() * extended.length);
  const selectedHero = extended[randomIndex];

  const offset = randomIndex * 220 - 900;

  roulette.style.transition = "none";
  roulette.style.transform = "translateX(0)";

  setTimeout(() => {
    roulette.style.transition = "transform 5s cubic-bezier(.08,.6,.2,1)";
    roulette.style.transform = `translateX(-${offset}px)`;
  }, 50);

  setTimeout(() => {
    heroName.innerText = `${selectedHero.name} (${selectedHero.attr})`;

    // Показываем fullscreen результат
    resultHeroName.innerText = `${selectedHero.name} (${selectedHero.attr})`;
    resultHeroImg.src = "content/" + selectedHero.file;
    resultOverlay.style.display = "flex";
  }, 5000);
});

// При загрузке страницы
window.addEventListener("load", () => {
  welcomeOverlay.style.display = "flex"; // показываем только приветствие
  resultOverlay.style.display = "none"; // гарантированно скрываем результат
});
