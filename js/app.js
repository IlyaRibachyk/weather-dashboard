console.log('script.js підключено')
const days = [
    { day: 'Пн', temp: 21, description: 'ясно', weather: 'sunny' },
    { day: 'Вт', temp: 18, description: 'хмарно', weather: 'cloudy' },
    { day: 'Ср', temp: 10, description: 'дощ', weather: 'rain' },
    { day: 'Чт', temp: 21, description: 'ясно', weather: 'sunny' },
    { day: 'Пт', temp: 24, description: 'ясно', weather: 'sunny' },
    { day: 'Сб', temp: 15, description: 'хмарно', weather: 'cloudy' },
    { day: 'Нд', temp: 19, description: 'ясно', weather: 'sunny' }
]

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

const staticCard = document.querySelector('#cards article');
if (staticCard) {
    staticCard.remove();
}

const listContainer = document.querySelector('#cards')

// Створює елемент article для кожного дня
function renderDays(days) {
    listContainer.innerHTML = '';
    days.forEach(day => {
        const card = document.createElement('article');
        const title = document.createElement('h2');
        const img = document.createElement('img');
        title.textContent = day.day;
        if (day.weather === 'sunny') {
            img.src = 'assets/img/sunny.png';
            img.alt = 'Сонячно, без опадів';
        } else if (day.weather === 'cloudy') {
            img.src = 'assets/img/cloud.webp';
            img.alt = 'Хмарно, без опадів';
        } else if (day.weather === 'rain') {
            img.src = 'assets/img/rain.png';
            img.alt = 'Хмарно, з опадами';
        }

        const description = document.createElement('p');

        const temperature = document.createElement('span');
        temperature.textContent = `${day.temp}°C,`;

        if (day.temp < 0) description.classList.add('cold');

        description.append(temperature, ` ${day.description}`);

        card.append(title, img, description);
        listContainer.append(card);
    });
}

for (const day of days) {
    const status = feel(day.temp);
    const tempInF = toFahrenheit(day.temp);
    console.log(`День: ${day.day} | ${day.temp}°C (${tempInF}°F) | [${status}]`);
}

renderDays(days)

let average = 0;
for (const day of days) {
    average += day.temp;
}
console.log(`Середнє значення: ${average / 7}`)