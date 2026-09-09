console.log('script.js підключено')
const days = [{ day: 'Пн', temp: 21 }, { day: 'Вт', temp: 18 }, { day: 'Ср', temp: 10 }, { day: 'Чт', temp: 21 }, { day: 'Пт', temp: 24 }, { day: 'Сб', temp: 15 }, { day: 'Нд', temp: 19 }]

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

for (const day of days) {
    const status = feel(day.temp);
    const tempInF = toFahrenheit(day.temp);
    console.log(`День: ${day.day} | ${day.temp}°C (${tempInF}°F) | [${status}]`);
}

