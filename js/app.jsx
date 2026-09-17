function WeatherCard({ day, tempC, description, weather }) {
    const [showFahrenheit, setShowFahrenheit] = React.useState(false);

    const tempF = (tempC * 9) / 5 + 32;

    let imgSrc;

    if (weather === 'sunny') {
        imgSrc = 'assets/img/sunny.png';
    } else if (weather === 'cloudy') {
        imgSrc = 'assets/img/cloud.webp';
    } else {
        imgSrc = 'assets/img/rain.png';
    }

    return (
        <article onClick={() => setShowFahrenheit(!showFahrenheit)} style={{ cursor: 'pointer' }}>
            <h3>{day}</h3>
            <img src={imgSrc} alt={description} />
            <p>
                <span>
                    {tempC}°C{showFahrenheit ? ` (${tempF.toFixed(1)}°F)` : ''},
                </span> {description}
            </p>
        </article>
    );
}

// WeatherApp - тримає масив днів у реактивному стані замість зовнішньої змінної days.
function WeatherApp({ initialDays }) {
    const [items, setItems] = React.useState(initialDays);

    React.useEffect(() => {
        window.updateWeatherCards = setItems;
    }, []);

    return (
        <>
            {items.map((item, index) => (
                <WeatherCard
                    key={item.day + index}
                    day={item.day}
                    tempC={item.temp}
                    description={item.description}
                    weather={item.weather}
                />
            ))}
        </>
    );
}

const initialDays = [
    { day: 'Пн', temp: 21, description: 'ясно', weather: 'sunny' },
    { day: 'Вт', temp: 18, description: 'хмарно', weather: 'cloudy' },
    { day: 'Ср', temp: 10, description: 'дощ', weather: 'rain' },
    { day: 'Чт', temp: 21, description: 'ясно', weather: 'sunny' },
    { day: 'Пт', temp: 24, description: 'ясно', weather: 'sunny' },
    { day: 'Сб', temp: 15, description: 'хмарно', weather: 'cloudy' },
    { day: 'Нд', temp: 19, description: 'ясно', weather: 'sunny' }
];

ReactDOM.createRoot(document.getElementById('cards')).render(
    <WeatherApp initialDays={initialDays} />
);