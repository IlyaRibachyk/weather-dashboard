console.log('script.js підключено');
const days = [
    { day: 'Пн', temp: 21, description: 'ясно', weather: 'sunny' },
    { day: 'Вт', temp: 18, description: 'хмарно', weather: 'cloudy' },
    { day: 'Ср', temp: 10, description: 'дощ', weather: 'rain' },
    { day: 'Чт', temp: 21, description: 'ясно', weather: 'sunny' },
    { day: 'Пт', temp: 24, description: 'ясно', weather: 'sunny' },
    { day: 'Сб', temp: 15, description: 'хмарно', weather: 'cloudy' },
    { day: 'Нд', temp: 19, description: 'ясно', weather: 'sunny' }
]

// константи weather codes
const weatherCodes = {
    0: { description: "ясно", weather: "sunny" },
    1: { description: "ясно", weather: "sunny" },
    2: { description: "хмарно", weather: "cloudy" },
    3: { description: "хмарно", weather: "cloudy" },
    45: { description: "хмарно", weather: "cloudy" },
    48: { description: "дощ", weather: "cloudy" },
    51: { description: "дощ", weather: "rain" },
    61: { description: "дощ", weather: "rain" },
    63: { description: "дощ", weather: "rain" },
    71: { description: "дощ", weather: "rain" },
    95: { description: "дощ", weather: "rain" }
};

// API
const URL = "https://api.open-meteo.com/v1/forecast?latitude=50.45&longitude=30.52&current=temperature_2m,weather_code&timezone=auto";

// Функція визначає текстову класифікацію погоди залежно від температури
function feel(currentTempC) {
    if (currentTempC < 0) {
        return 'Морозно';
    } else if (currentTempC < 20) {
        return 'Прохолодно';
    } else {
        return 'Тепло';
    }
}

// Стрілкова функція для переводу градусів Цельсія у Фаренгейти
const toFahrenheit = celsius => celsius * 9 / 5 + 32;

// const staticCard = document.querySelector('#cards article');
// if (staticCard) {
//     staticCard.remove();
// }

const listContainer = document.querySelector('#cards')

// Створює елемент article для кожного дня
function renderDays(items, container) {
    container.innerHTML = '';
    items.forEach(item => {
        const card = document.createElement('article');
        const title = document.createElement('h3');
        const img = document.createElement('img');
        title.textContent = item.name ? `${item.name} — ${item.day}` : item.day;

        if (item.weather === 'sunny') {
            img.src = 'assets/img/sunny.png';
            img.alt = 'Сонячно, без опадів';
        } else if (item.weather === 'cloudy') {
            img.src = 'assets/img/cloud.webp';
            img.alt = 'Хмарно, без опадів';
        } else {
            img.src = 'assets/img/rain.png';
            img.alt = 'Хмарно, з опадами';
        }

        const description = document.createElement('p');
        const temperature = document.createElement('span');
        temperature.textContent = `${item.temp}°C,`;
        description.append(temperature, ` ${item.description}`);

        card.append(title, img, description);
        container.append(card);
    });
}

for (const day of days) {
    const status = feel(day.temp);
    const tempInF = toFahrenheit(day.temp);
    console.log(`День: ${day.day} | ${day.temp}°C (${tempInF}°F) | [${status}]`);
}

const dayInput = document.querySelector('#day-input');

// Валідація полів форми для дня тижня
dayInput.addEventListener('input', () => {
    const value = dayInput.value;
    const d = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"]
  
    if (!d.includes(value)) {
        dayInput.setCustomValidity('Неправильно вказаний день. Правильний формат: Пн, Вт, ...');
    } else {
        dayInput.setCustomValidity('');
    }
});

const descInput = document.querySelector('#desc-input');

// Валідація полів форми для опису погоди
descInput.addEventListener('input', () => {
    const value = descInput.value;
    const desc = ["ясно", "хмарно", "дощ"]
  
    if (!desc.includes(value)) {
        descInput.setCustomValidity('Неправильно вказано опис. Треба або ясно, або хмарно, або дощ');
    } else {
        descInput.setCustomValidity('');
    }
});

const form = document.querySelector('#weather-form');
const tempInput = document.querySelector('#temp-input');

// Валідація полів форми для температури
tempInput.addEventListener('input', () => {
    const value = Number(tempInput.value);
  
    if (value < -50 || value > 50) {
        tempInput.setCustomValidity('Температура поза реалістичним діапазоном');
    } else if (tempInput.value == '') {
        tempInput.setCustomValidity("Температура - це обов'язкове поле");
    } else {
        tempInput.setCustomValidity('');
    }
});

// Обробка відправки форми та додавання нового дня
form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const cityValue = document.querySelector('#city-input').value;
    const dayValue = document.querySelector('#day-input').value;
    const tempValue = Number(document.querySelector('#temp-input').value);
    const descValue = document.querySelector('#desc-input').value;

    let weather;
    if (descValue === "ясно") {
        weather = "sunny";
    } else if (descValue === "хмарно") {
        weather = "cloudy";
    } else {
        weather = "rain";
    }

    const newWeatherData = {
        day: dayValue,
        temp: tempValue,
        description: descValue,
        weather: weather
    };

    days.push(newWeatherData);
    if (window.updateWeatherCards) {
        window.updateWeatherCards(prevItems => [...prevItems, newWeatherData]);
    }

    const newCity = {
        id: Date.now(),
        name: cityValue,
        day: dayValue,
        temp: tempValue,
        description: descValue,
        weather: weather,
        time: new Date().toISOString()
    };

    try {
        await addCity(newCity);
    } catch (error) {
        console.error('Не вдалося зберегти місто в IndexedDB:', error);
    }

    form.reset();
});

const warmestBtn = document.querySelector('#find-warmest-btn');
const warmestResult = document.querySelector('#warmest-day-result');

// Пошук найтеплішого дня
warmestBtn.addEventListener('click', () => {
  if (days.length === 0) {
    warmestResult.textContent = 'Масив даних порожній';
    return;
  }

  let warmest = days[0];
  for (let i = 1; i < days.length; i++) {
    if (days[i].temp > warmest.temp) {
      warmest = days[i];
    }
  }

  warmestResult.textContent = `Найтепліший день: ${warmest.day} (${warmest.temp}°C, ${warmest.description})`;
});

const statusMessage = document.querySelector('#status-message');

// Показує/ховає індикатор завантаження та блокує кнопку "Оновити" на час запиту
function showLoading(isLoading) {
    const refreshBtn = document.querySelector('#refresh-btn');
    if (isLoading) {
        statusMessage.textContent = 'Завантаження прогнозу погоди...';
        statusMessage.style.color = 'blue';
        if (refreshBtn) refreshBtn.disabled = true;
    } else {
        if (refreshBtn) refreshBtn.disabled = false;
    }
}

// Виводить користувачу зрозуміле повідомлення про помилку (без технічних деталей)
function showError(message) {
    statusMessage.textContent = message;
    statusMessage.style.color = 'red';
}

// Очищує попереднє повідомлення про статус перед новим запитом
function clearStatus() {
    statusMessage.textContent = '';
}

// Завантажує поточну погоду з Open-Meteo API (без ключа) і виводить її в DOM
async function loadData() {
    showLoading(true);
    clearStatus();
    try {
        const response = await fetch(URL);
        if (!response.ok) throw new Error(`Код ${response.status}`);
        
        const data = await response.json();
        console.log("Отримані дані від API:", data);

        const currentTemp = data.current.temperature_2m;
        const code = data.current.weather_code;
        const rawTime = data.current.time;
        
        const formattedTime = rawTime.replace('T', ' ');
        const weatherDetail = weatherCodes[code] || { description: "хмарно", weather: "cloudy" };
        const apiWeatherData = [{
            day: `Зараз (${formattedTime})`,
            temp: currentTemp,
            description: weatherDetail.description,
            weather: weatherDetail.weather
        }];

        // renderDays(apiWeatherData, listContainer);
        if (window.updateWeatherCards) {
            window.updateWeatherCards(apiWeatherData);
        }
    } catch (error) {
        showError('Не вдалося отримати прогноз погоди');
        console.error("Деталі помилки:", error);
    } finally {
        showLoading(false);
    }
}

const refreshBtn = document.querySelector('#refresh-btn');
if (refreshBtn) {
    refreshBtn.addEventListener('click', loadData);
}

loadData();

// renderDays(days, listContainer);

let average = 0;
for (const day of days) {
    average += day.temp;
}
console.log(`Середнє значення: ${average / days.length}`);

// Модель одного збереженого міста
// { id, name, lat, lon, temperature, weatherCode, time }
function saveToLocalStorage(cities) {
    localStorage.setItem('savedCities', JSON.stringify(cities));
}

function loadFromLocalStorage() {
    try {
        const raw = localStorage.getItem('savedCities');
        return raw ? JSON.parse(raw) : [];
    } catch (error) {
        console.error('Пошкоджені дані в localStorage:', error);
        return [];
    }
}

// Створюємо базу CitiesDB з object store "cities"
function openDB() {
    return new Promise((resolve, reject) => {

        // тимчасово для скріншота - навмисно викликаємо помилку
        // reject(new Error('IndexedDB недоступна (тест)'));
        // return;

        const request = indexedDB.open('CitiesDB', 1);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('cities')) {
                db.createObjectStore('cities', { keyPath: 'id' });
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

// Додає нове місто або оновлює наявне
async function addCity(city) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction('cities', 'readwrite');
        tx.objectStore('cities').put(city);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
}

// Повертає всі збережені міста
async function getAllCities() {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction('cities', 'readonly');
        const request = tx.objectStore('cities').getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

// Видаляє місто за id
async function deleteCity(id) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction('cities', 'readwrite');
        tx.objectStore('cities').delete(id);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
}

// Одноразово переносить дані зі старого localStorage в IndexedDB
async function migrateFromLocalStorageIfNeeded() {
    const alreadyMigrated = localStorage.getItem('citiesMigrated') === 'true';
    if (alreadyMigrated) return;

    const existing = await getAllCities();
    if (existing.length > 0) {
        localStorage.setItem('citiesMigrated', 'true');
        return;
    }

    const oldCities = loadFromLocalStorage();
    for (const city of oldCities) {
        await addCity(city);
    }
    localStorage.setItem('citiesMigrated', 'true');
}

// виконує одноразову міграцію, а потім читає й виводить усі збережені міста
(async () => {
    try {
        await migrateFromLocalStorageIfNeeded();
        const cities = await getAllCities();
        console.log('Збережені міста з IndexedDB:', cities);
    } catch (error) {
        showError('Не вдалося відкрити локальну базу даних. Перевірте, чи не увімкнено приватний режим перегляду.');
        console.error(error);
    }
})();

const routes = [
    { path: '/', view: renderHome },
    { path: '/cities', view: renderCitiesList },
    { path: '/cities/:id', view: renderCityDetail }
];

function renderHome() {
    showPage('page-home');
}

async function renderCitiesList() {
    showPage('page-cities-list');
    const container = document.getElementById('page-cities-list');
    container.innerHTML = '<h2>Збережені міста</h2><ul id="cities-list-ul"></ul>';

    const cities = await getAllCities();
    const ul = document.getElementById('cities-list-ul');

    if (cities.length === 0) {
        ul.innerHTML = '<li>Ще немає збережених міст</li>';
        return;
    }

    cities.forEach(city => {
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.href = `#/cities/${city.id}`;
        link.setAttribute('data-link', '');
        link.textContent = `${city.name} — ${city.day} (${city.temp}°C)`;
        li.append(link);
        ul.append(li);
    });
}

// /cities/:id - бере вже збережені дані міста й показує через ту саму renderWeatherCards
async function renderCityDetail(params) {
    showPage('page-city-detail');
    const container = document.getElementById('page-city-detail');

    const cities = await getAllCities();
    const city = cities.find(c => String(c.id) === params.id);

    if (!city) {
        container.innerHTML = '<p>Місто не знайдено.</p><a href="#/cities" data-link>← Назад до списку</a>';
        return;
    }

    container.innerHTML = '<div id="city-detail-card"></div><a href="#/cities" data-link>← Назад до списку</a>';
    renderDays([city], document.getElementById('city-detail-card'));
}

// Показує лише один контейнер-сторінку, ховаючи решту
function showPage(id) {
    const pageIds = ['page-home', 'page-cities-list', 'page-city-detail', 'page-not-found'];
    pageIds.forEach(pid => {
        const el = document.getElementById(pid);
        if (el) el.style.display = pid === id ? '' : 'none';
    });
}

// Зіставляє поточний шлях з одним із патернів у routes і витягує параметри
function matchRoute(path) {
    const pathParts = path.split('/').filter(Boolean);
    for (const route of routes) {
        const routeParts = route.path.split('/').filter(Boolean);
        if (routeParts.length !== pathParts.length) continue;

        const params = {};
        const isMatch = routeParts.every((part, i) => {
            if (part.startsWith(':')) {
                params[part.slice(1)] = pathParts[i];
                return true;
            }
            return part === pathParts[i];
        });

        if (isMatch) return { view: route.view, params };
    }
    return null;
}

// Головна функція роутера: визначає поточний шлях і викликає відповідну view
function router() {
    const path = location.hash.slice(1) || '/';
    const match = matchRoute(path);

    if (!match) {
        showPage('page-not-found');
        return;
    }
    match.view(match.params);
}

window.addEventListener('hashchange', router);
window.addEventListener('DOMContentLoaded', router);

// Перехоплюємо кліки по всіх посиланнях з data-link для клієнтської навігації
document.addEventListener('click', (event) => {
    const link = event.target.closest('a[data-link]');
    if (!link) return;
    event.preventDefault();
    location.hash = link.getAttribute('href').replace('#', '');
});