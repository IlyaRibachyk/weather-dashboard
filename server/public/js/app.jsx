function WeatherCard({ day, tempC, description, weather }) {
    const [showFahrenheit, setShowFahrenheit] = React.useState(false);

    const tempF = (tempC * 9) / 5 + 32;

    // let imgSrc;

    // if (weather === 'sunny') {
    //     imgSrc = 'assets/img/sunny.png';
    // } else if (weather === 'cloudy') {
    //     imgSrc = 'assets/img/cloud.webp';
    // } else {
    //     imgSrc = 'assets/img/rain.png';
    // }

    return (
        <article onClick={() => setShowFahrenheit(!showFahrenheit)} style={{ cursor: 'pointer' }}>
            <h3>{day}</h3>
            {/* <img src={imgSrc} alt={description} /> */}
            <WeatherCanvasIcon weather={weather} />
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

// Обрано Canvas замість статичного <img> для іконки погоди
function WeatherCanvasIcon({ weather }) {
    const canvasRef = React.useRef(null);
    const frameRef = React.useRef(null);

    React.useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let angle = 0;
        const drops = Array.from({ length: 10 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height
        }));

        function drawSun() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate(angle);
            ctx.fillStyle = '#FFC107';
            ctx.beginPath();
            ctx.arc(0, 0, 14, 0, Math.PI * 2);
            ctx.fill();
            for (let i = 0; i < 8; i++) {
                const a = (Math.PI / 4) * i;
                ctx.beginPath();
                ctx.moveTo(Math.cos(a) * 19, Math.sin(a) * 19);
                ctx.lineTo(Math.cos(a) * 27, Math.sin(a) * 27);
                ctx.strokeStyle = '#FFC107';
                ctx.lineWidth = 3;
                ctx.stroke();
            }
            ctx.restore();
            angle += 0.02;
        }

        function drawCloud() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const dx = Math.sin(angle) * 5;
            ctx.fillStyle = '#B7C6DE';
            ctx.beginPath();
            ctx.arc(22 + dx, 32, 11, 0, Math.PI * 2);
            ctx.arc(36 + dx, 26, 14, 0, Math.PI * 2);
            ctx.arc(50 + dx, 32, 11, 0, Math.PI * 2);
            ctx.fill();
            angle += 0.03;
        }

        function drawRain() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawCloud();
            ctx.strokeStyle = '#4A90D9';
            ctx.lineWidth = 2;
            drops.forEach(drop => {
                ctx.beginPath();
                ctx.moveTo(drop.x, drop.y);
                ctx.lineTo(drop.x, drop.y + 8);
                ctx.stroke();
                drop.y += 4;
                if (drop.y > canvas.height) {
                    drop.y = -8;
                    drop.x = Math.random() * canvas.width;
                }
            });
        }

        // Цикл анімації через requestAnimationFrame
        function loop() {
            if (weather === 'sunny') drawSun();
            else if (weather === 'cloudy') drawCloud();
            else drawRain();
            frameRef.current = requestAnimationFrame(loop);
        }
        loop();
        
        return () => cancelAnimationFrame(frameRef.current);
    }, [weather]);

    return <canvas ref={canvasRef} width={70} height={70} />;
}