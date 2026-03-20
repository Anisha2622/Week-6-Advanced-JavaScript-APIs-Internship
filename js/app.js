document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('searchForm');
    const cityInput = document.getElementById('cityInput');
    const weatherContent = document.getElementById('weatherContent');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const errorMessage = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');
    const recentSearchesContainer = document.getElementById('recentSearches');
    
    const settingsPanel = document.getElementById('settingsPanel');
    const toggleSettingsBtn = document.getElementById('toggleSettingsBtn');
    const saveSettingsBtn = document.getElementById('saveSettingsBtn');
    const apiKeyInput = document.getElementById('apiKeyInput');

    // --- FEATURE 1: Clean, Light, Minimal Glassmorphism UI ---
    if (!document.getElementById('premium-weather-css')) {
        const style = document.createElement('style');
        style.id = 'premium-weather-css';
        style.textContent = `
            /* Clean Light Animated Background */
            body {
                background: linear-gradient(135deg, var(--bg-top) 0%, var(--bg-bottom) 100%) !important;
                background-attachment: fixed !important;
                color: var(--text-main) !important;
                transition: background 1.5s ease;
            }

            /* Clean, elegant glass styling */
            .panel {
                background: rgba(255, 255, 255, 0.65) !important;
                backdrop-filter: blur(25px) saturate(150%) !important;
                -webkit-backdrop-filter: blur(25px) saturate(150%) !important;
                border: 1px solid rgba(255, 255, 255, 0.8) !important;
                box-shadow: 0 10px 35px rgba(0, 0, 0, 0.05) !important;
                border-radius: 28px !important;
                color: var(--text-main) !important;
            }

            .current-weather-panel {
                background: linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.5)) !important;
            }

            .detail-card, .forecast-card {
                background: rgba(255, 255, 255, 0.45) !important;
                border-radius: 20px !important;
                border: 1px solid rgba(255, 255, 255, 0.7) !important;
                transition: all 0.3s ease !important;
                color: var(--text-main) !important;
            }
            
            .detail-card:hover, .forecast-card:hover {
                background: rgba(255, 255, 255, 0.85) !important;
                transform: translateY(-4px) !important;
                box-shadow: 0 12px 24px rgba(0,0,0,0.06) !important;
            }

            /* Buttons & Inputs */
            .btn-primary {
                background: #3B82F6 !important;
                color: white !important;
                box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3) !important;
                border: none !important;
            }
            .btn-primary:hover {
                background: #2563EB !important;
                transform: translateY(-2px) !important;
            }

            input { 
                background: rgba(255, 255, 255, 0.8) !important; 
                border: 1px solid rgba(0,0,0,0.1) !important; 
                color: var(--text-dark) !important; 
            }
            input:focus { 
                background: #fff !important; 
                border-color: #3B82F6 !important; 
                box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15) !important; 
            }

            /* Typography */
            #cityName { font-size: 2.5rem; font-weight: 700; color: var(--text-dark); text-shadow: none; letter-spacing: -0.5px;}
            #weatherDesc { color: #3B82F6 !important; font-weight: 500; font-size: 1.2rem; text-shadow: none; }
            #temperature { 
                font-size: 6rem; 
                font-weight: 300; 
                color: var(--text-dark); 
                text-shadow: none; 
                background: none; 
                -webkit-text-fill-color: initial; 
                letter-spacing: -3px;
            }
            
            .detail-label { color: var(--text-muted); font-size: 0.85rem; font-weight: 600; text-transform: uppercase; }
            .detail-value { color: var(--text-dark); font-size: 1.6rem; font-weight: 600; }
            .detail-card i { color: #3B82F6 !important; }
            .panel-header h3 { color: var(--text-muted); font-weight: 600; }
            .panel-header i { color: #3B82F6; }
            .logo h1 { color: var(--text-dark); text-shadow: none; }
            .logo i { color: #3B82F6; filter: none; }
            .btn-icon { background: rgba(255, 255, 255, 0.8); border: 1px solid rgba(0,0,0,0.08); color: var(--text-dark); }
            .btn-icon:hover { background: #fff; }

            /* Smart Insights & Pills */
            .smart-insight { 
                background: rgba(59, 130, 246, 0.1); 
                color: #2563EB; 
                border: none; 
                box-shadow: none; 
                padding: 6px 14px; 
                margin-top: 10px; 
                display: inline-block; 
                border-radius: 20px; 
                font-weight: 500; 
                font-size: 0.9rem; 
            }
            .recent-pill { 
                background: rgba(255, 255, 255, 0.7); 
                color: var(--text-dark); 
                border: 1px solid rgba(0,0,0,0.1); 
            }
            .recent-pill:hover { 
                background: #3B82F6; 
                color: white; 
                border-color: #3B82F6; 
            }

            /* Settings Panel */
            .settings-panel { background: rgba(255, 255, 255, 0.95) !important; border: 1px solid #e2e8f0 !important; }
            .settings-header { color: #3B82F6; }
            .settings-panel p { color: var(--text-muted); }

            /* Progress bars */
            .progress-bar-bg { background: rgba(0,0,0,0.06); box-shadow: inset 0 1px 2px rgba(0,0,0,0.05); height: 6px; border-radius: 4px; margin-top: 10px;}
            .progress-bar-fill { height: 100%; border-radius: 4px; width: 0%; transition: width 1.5s ease; }

            /* Premium Clean Icons */
            .premium-main-icon {
                width: 150px;
                height: 150px;
                filter: drop-shadow(0 10px 15px rgba(0,0,0,0.15));
                margin-top: -1.5rem;
                margin-right: -1.5rem;
            }
            .premium-forecast-icon {
                width: 65px;
                height: 65px;
                filter: drop-shadow(0 6px 10px rgba(0,0,0,0.1));
                margin: 0.8rem 0;
            }
        `;
        document.head.appendChild(style);
    }

    // --- FEATURE 2: Animated SVG Icons ---
    const getPremiumIcon = (code) => {
        const base = 'https://www.amcharts.com/wp-content/themes/amcharts4/css/img/icons/weather/animated/';
        const map = {
            '01d': 'day.svg', '01n': 'night.svg', '02d': 'cloudy-day-1.svg', '02n': 'cloudy-night-1.svg',
            '03d': 'cloudy.svg', '03n': 'cloudy.svg', '04d': 'cloudy.svg', '04n': 'cloudy.svg',
            '09d': 'rainy-6.svg', '09n': 'rainy-6.svg', '10d': 'rainy-3.svg', '10n': 'rainy-5.svg',
            '11d': 'thunder.svg', '11n': 'thunder.svg', '13d': 'snowy-6.svg', '13n': 'snowy-6.svg',
            '50d': 'cloudy.svg', '50n': 'cloudy.svg'
        };
        return base + (map[code] || 'day.svg');
    };

    // --- FEATURE 3: Soft, Clean Color Themes ---
    const updateDynamicBackground = (condition, iconCode) => {
        const root = document.documentElement;
        const isDay = iconCode.includes('d');

        const themes = {
            Clear: isDay ? 
                { top: '#e0f2fe', bottom: '#bae6fd', textMain: '#334155', textDark: '#0f172a', textMuted: '#64748b' } : // Light blue sunny
                { top: '#1e293b', bottom: '#0f172a', textMain: '#f1f5f9', textDark: '#ffffff', textMuted: '#94a3b8' },  // Dark blue night
            Clouds: isDay ?
                { top: '#f1f5f9', bottom: '#e2e8f0', textMain: '#334155', textDark: '#0f172a', textMuted: '#64748b' } : // Soft gray cloudy
                { top: '#334155', bottom: '#1e293b', textMain: '#f1f5f9', textDark: '#ffffff', textMuted: '#94a3b8' },
            Rain: { top: '#cbd5e1', bottom: '#94a3b8', textMain: '#1e293b', textDark: '#0f172a', textMuted: '#475569' },
            Drizzle: { top: '#cbd5e1', bottom: '#94a3b8', textMain: '#1e293b', textDark: '#0f172a', textMuted: '#475569' },
            Snow: { top: '#f8fafc', bottom: '#e2e8f0', textMain: '#334155', textDark: '#0f172a', textMuted: '#64748b' },
            Thunderstorm: { top: '#475569', bottom: '#334155', textMain: '#f8fafc', textDark: '#ffffff', textMuted: '#cbd5e1' }
        };

        const theme = themes[condition] || themes.Clouds;

        root.style.setProperty('--bg-top', theme.top);
        root.style.setProperty('--bg-bottom', theme.bottom);
        root.style.setProperty('--text-main', theme.textMain);
        root.style.setProperty('--text-dark', theme.textDark);
        root.style.setProperty('--text-muted', theme.textMuted);
    };

    // --- Number Counting Animation ---
    const animateValue = (element, start, end, duration) => {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3); 
            const current = Math.floor(easeOut * (end - start) + start);
            
            element.textContent = `${current}°`;
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                element.textContent = `${end}°`;
            }
        };
        window.requestAnimationFrame(step);
    };

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
        errorText.textContent = message;
        errorMessage.style.display = 'flex';
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
        // FAILSAFE: Check if API script was loaded correctly
        if (typeof WeatherAPI === 'undefined') {
            showError("API script is missing. Please make sure js/api.js is linked properly in your HTML.");
            return;
        }

        const prefs = Storage.getKeys();
        if (!prefs.apiKey) {
            showError("Please enter your OpenWeatherMap API key in Settings.");
            settingsPanel.classList.add('active');
            return;
        }

        hideError();
        weatherContent.classList.add('hidden');
        weatherContent.classList.remove('fade-in'); 
        loadingIndicator.style.display = 'block';

        try {
            // FAILSAFE: Add a timeout to prevent infinite loading screens
            const fetchWithTimeout = new Promise(async (resolve, reject) => {
                const timer = setTimeout(() => reject(new Error("Request timed out. Please check your internet connection.")), 10000); // 10 seconds max
                
                try {
                    let currentWeather, forecast;
                    if (typeof WeatherAPI.getCoordinates === 'function') {
                        const coords = await WeatherAPI.getCoordinates(city, prefs.apiKey);
                        [currentWeather, forecast] = await Promise.all([
                            WeatherAPI.fetchCurrentWeatherByCoords(coords.lat, coords.lon, prefs.apiKey, prefs.units),
                            WeatherAPI.fetchForecastByCoords(coords.lat, coords.lon, prefs.apiKey, prefs.units)
                        ]);
                        currentWeather.name = coords.name;
                        if (coords.country) currentWeather.sys = { ...currentWeather.sys, country: coords.country };
                    } else {
                        [currentWeather, forecast] = await Promise.all([
                            WeatherAPI.fetchCurrentWeather(city, prefs.apiKey, prefs.units),
                            WeatherAPI.fetchForecast(city, prefs.apiKey, prefs.units)
                        ]);
                    }
                    clearTimeout(timer);
                    resolve({currentWeather, forecast});
                } catch (err) {
                    clearTimeout(timer);
                    reject(err);
                }
            });

            const { currentWeather, forecast } = await fetchWithTimeout;

            updateCurrentUI(currentWeather);
            updateForecastUI(forecast);
            
            Storage.saveSearch(currentWeather.name);
            renderRecentSearches();
            
            loadingIndicator.style.display = 'none';
            weatherContent.classList.remove('hidden');
            
            void weatherContent.offsetWidth; 
            weatherContent.classList.add('fade-in');
            
            setTimeout(() => {
                document.querySelectorAll('.progress-bar-fill').forEach(bar => {
                    bar.style.width = bar.getAttribute('data-target');
                });
            }, 100);
            
        } catch (error) {
            showError(error.message);
        }
    };

    const updateCurrentUI = (data) => {
        const hour = new Date().getHours();
        let greeting = 'Good Evening';
        if (hour >= 5 && hour < 12) greeting = 'Good Morning';
        else if (hour >= 12 && hour < 17) greeting = 'Good Afternoon';

        document.getElementById('cityName').innerHTML = `
            <span style="font-size: 1rem; display: block; font-weight: 600; color: var(--text-muted); text-shadow: none; letter-spacing: 0.5px; margin-bottom: 4px; text-transform: uppercase;">
                ${greeting}
            </span>
            ${data.name}, ${data.sys?.country || ''}
        `;
        
        let insight = "Perfect weather to step outside!";
        if (data.main.temp >= 30) insight = "It's quite hot, stay hydrated! 💧";
        else if (data.main.temp <= 10) insight = "Bundle up, it's cold outside! 🧣";
        else if (data.weather[0].main === 'Rain' || data.weather[0].main === 'Drizzle') insight = "Don't forget your umbrella! ☂️";
        else if (data.weather[0].main === 'Clear') insight = "Enjoy the beautiful skies! ☀️";
        else if (data.weather[0].main === 'Thunderstorm') insight = "Stormy weather, stay indoors! ⚡";

        document.getElementById('weatherDesc').innerHTML = `
            ${data.weather[0].description} <br>
            <span class="smart-insight">${insight}</span>
        `;
        
        const tempElement = document.getElementById('temperature');
        const targetTemp = Math.round(data.main.temp);
        animateValue(tempElement, 0, targetTemp, 1200);
        
        const iconEl = document.getElementById('weatherIcon');
        iconEl.src = getPremiumIcon(data.weather[0].icon);
        iconEl.className = 'premium-main-icon'; 
        iconEl.classList.remove('hidden');
        
        const humidityTarget = `${data.main.humidity}%`;
        const windPercent = Math.min((data.wind.speed / 30) * 100, 100); 
        const windTarget = `${windPercent}%`;

        document.getElementById('humidity').innerHTML = `
            ${data.main.humidity}%
            <div class="progress-bar-bg"><div class="progress-bar-fill" data-target="${humidityTarget}" style="background: #3B82F6;"></div></div>
        `;
        document.getElementById('windSpeed').innerHTML = `
            ${data.wind.speed} <span style="font-size:1rem;font-weight:500;">m/s</span>
            <div class="progress-bar-bg"><div class="progress-bar-fill" data-target="${windTarget}" style="background: #8B5CF6;"></div></div>
        `;

        document.getElementById('feelsLike').innerHTML = `${Math.round(data.main.feels_like)}°`;
        document.getElementById('pressure').innerHTML = `${data.main.pressure} <span style="font-size:1rem;font-weight:500;">hPa</span>`;

        updateDynamicBackground(data.weather[0].main, data.weather[0].icon);
    };

    const updateForecastUI = (forecastData) => {
        const grid = document.getElementById('forecastGrid');
        grid.innerHTML = ''; 

        forecastData.forEach(day => {
            const dateObj = new Date(day.dt * 1000);
            const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
            
            const card = document.createElement('div');
            card.className = 'forecast-card';
            
            const premiumIcon = getPremiumIcon(day.weather[0].icon);
            
            card.innerHTML = `
                <div class="forecast-date">${dayName}</div>
                <img src="${premiumIcon}" alt="icon" class="premium-forecast-icon">
                <div class="forecast-temp">${Math.round(day.main.temp)}°</div>
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
            if (currentCity && currentCity !== '--') {
                loadWeatherData(currentCity);
            } else {
                loadWeatherData(prefs.defaultCity);
            }
        }
    });

    init();
});