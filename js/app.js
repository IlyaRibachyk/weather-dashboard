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
        const title = document.createElement('h3');
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
form.addEventListener('submit', (event) => {
    event.preventDefault();

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
    renderDays(days);
    
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

renderDays(days)

let average = 0;
for (const day of days) {
    average += day.temp;
}
console.log(`Середнє значення: ${average / days.length}`)