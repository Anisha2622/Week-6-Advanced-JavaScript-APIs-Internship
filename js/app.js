document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('searchForm');
    const cityInput = document.getElementById('cityInput');
    const weatherContent = document.getElementById('weatherContent');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const errorMessage = document.getElementById('errorMessage');
    const recentSearchesContainer = document.getElementById('recentSearches');
    
    const settingsPanel = document.getElementById('settingsPanel');
    const toggleSettingsBtn = document.getElementById('toggleSettingsBtn');
    const saveSettingsBtn = document.getElementById('saveSettingsBtn');
    const apiKeyInput = document.getElementById('apiKeyInput');

    const init = () => {
        const prefs = Storage.getKeys();
        
        if (!prefs.apiKey) {
            settingsPanel.classList.add('active');
            weatherContent.classList.add('hidden');
        } else {
            apiKeyInput.value = prefs.apiKey;
            loadWeatherData(prefs.defaultCity);
        }
        
        renderRecentSearches();
    };

    const showError = (message) => {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        weatherContent.classList.add('hidden');
        loadingIndicator.style.display = 'none';
    };

    const hideError = () => {
        errorMessage.style.display = 'none';
    };

    const renderRecentSearches = () => {
        const recent = Storage.getRecentSearches();
        recentSearchesContainer.innerHTML = '';
        
        recent.forEach(city => {
            const pill = document.createElement('span');
            pill.className = 'recent-pill';
            pill.textContent = city;
            pill.addEventListener('click', () => {
                cityInput.value = city;
                loadWeatherData(city);
            });
            recentSearchesContainer.appendChild(pill);
        });
    };

    const loadWeatherData = async (city) => {
        const prefs = Storage.getKeys();
        if (!prefs.apiKey) {
            showError("Please enter your OpenWeatherMap API key in Settings.");
            settingsPanel.classList.add('active');
            return;
        }

        hideError();
        weatherContent.classList.add('hidden');
        loadingIndicator.style.display = 'block';

        try {
            const [currentWeather, forecast] = await Promise.all([
                WeatherAPI.fetchCurrentWeather(city, prefs.apiKey, prefs.units),
                WeatherAPI.fetchForecast(city, prefs.apiKey, prefs.units)
            ]);

            updateCurrentUI(currentWeather);
            updateForecastUI(forecast);
            
            Storage.saveSearch(currentWeather.name);
            renderRecentSearches();
            
            weatherContent.classList.remove('hidden');
        } catch (error) {
            showError(error.message);
        } finally {
            loadingIndicator.style.display = 'none';
        }
    };

    const updateCurrentUI = (data) => {
        document.getElementById('cityName').textContent = `${data.name}, ${data.sys.country}`;
        document.getElementById('weatherDesc').textContent = data.weather[0].description;
        document.getElementById('temperature').textContent = `${Math.round(data.main.temp)}°`;
        document.getElementById('weatherIcon').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
        
        document.getElementById('humidity').textContent = `${data.main.humidity}%`;
        document.getElementById('windSpeed').textContent = `${data.wind.speed} m/s`;
        document.getElementById('feelsLike').textContent = `${Math.round(data.main.feels_like)}°`;
        document.getElementById('pressure').textContent = `${data.main.pressure} hPa`;
    };

    const updateForecastUI = (forecastData) => {
        const grid = document.getElementById('forecastGrid');
        grid.innerHTML = ''; 

        forecastData.forEach(day => {
            const dateObj = new Date(day.dt * 1000);
            const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
            
            const card = document.createElement('div');
            card.className = 'forecast-card';
            card.innerHTML = `
                <div class="forecast-date">${dayName}</div>
                <img src="[https://openweathermap.org/img/wn/$](https://openweathermap.org/img/wn/$){day.weather[0].icon}@2x.png" alt="icon">
                <div class="forecast-temp">${Math.round(day.main.temp)}°</div>
                <div style="font-size: 0.9rem; color: var(--text-muted); text-transform: capitalize;">
                    ${day.weather[0].main}
                </div>
            `;
            grid.appendChild(card);
        });
    };

    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const city = cityInput.value.trim();
        if (city) loadWeatherData(city);
    });

    toggleSettingsBtn.addEventListener('click', () => {
        settingsPanel.classList.toggle('active');
    });

    saveSettingsBtn.addEventListener('click', () => {
        const newKey = apiKeyInput.value.trim();
        const prefs = Storage.getKeys();
        prefs.apiKey = newKey;
        Storage.saveKeys(prefs);
        
        settingsPanel.classList.remove('active');
        
        if (newKey && weatherContent.classList.contains('hidden')) {
            loadWeatherData(prefs.defaultCity);
        } else if (newKey) {
            const currentCity = document.getElementById('cityName').textContent.split(',')[0];
            loadWeatherData(currentCity || prefs.defaultCity);
        }
    });

    init();
});
