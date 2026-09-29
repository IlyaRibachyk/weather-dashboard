const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Локальні дані: 6 міст
const cities = [
    { id: 1, name: 'Київ', lat: 50.45, lon: 30.52 },
    // { id: 99, name: '<img src=x onerror="alert(\'XSS\')">', lat: 0, lon: 0 },
    { id: 2, name: 'Львів',   lat: 49.84, lon: 24.03 },
    { id: 3, name: 'Одеса',   lat: 46.48, lon: 30.72 },
    { id: 4, name: 'Харків',  lat: 49.99, lon: 36.23 },
    { id: 5, name: 'Дніпро',  lat: 48.46, lon: 35.05 },
    { id: 6, name: 'Запоріжжя', lat: 47.84, lon: 35.14 }
];

// Роздача фронтенду з теки public
app.use(express.static(path.join(__dirname, 'public')));

// Список міст
app.get('/api/cities', (req, res) => {
    res.json(cities);
});

// Одне місто або 404
app.get('/api/cities/:id', (req, res) => {
    const city = cities.find((c) => String(c.id) === req.params.id);
    if (!city) {
        return res.status(404).json({ error: 'Місто не знайдено' });
    }
    res.json(city);
});

// Будь-який інший /api/ шлях: JSON 404, а не HTML
app.use('/api', (req, res) => {
    res.status(404).json({ error: 'Не знайдено' });
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Сервер запущено на http://localhost:${PORT}`);
    });
}

module.exports = app;
