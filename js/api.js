const WeatherAPI = {
    BASE_URL: 'https://api.openweathermap.org/data/2.5',
    GEO_URL: 'https://api.openweathermap.org/geo/1.0',
    
    // 1. OpenWeatherMap requires Geocoding for new accounts
    async getCoordinates(city, apiKey) {
        const response = await fetch(`${this.GEO_URL}/direct?q=${city}&limit=1&appid=${apiKey}`);
        
        if (!response.ok) {
            if (response.status === 401) throw new Error('Invalid API Key. Please wait a few more minutes for it to activate.');
            throw new Error('Failed to reach Geocoding service.');
        }
        
        const data = await response.json();
        
        if (!data || data.length === 0) {
            throw new Error(`City "${city}" not found. Please check spelling.`);
        }
        
        return { 
            lat: data[0].lat, 
            lon: data[0].lon, 
            name: data[0].name, 
            country: data[0].country 
        };
    },

    // 2. Re-added this function to fix your error! It acts as a bridge for your app.js
    async fetchCurrentWeather(city, apiKey, units = 'metric') {
        const coords = await this.getCoordinates(city, apiKey);
        const data = await this.fetchCurrentWeatherByCoords(coords.lat, coords.lon, apiKey, units);
        
        // Ensure proper spelling and country code from geocoding is applied
        data.name = coords.name;
        if (coords.country) {
            data.sys = data.sys || {};
            data.sys.country = coords.country;
        }
        return data;
    },

    // 3. Re-added this function to fix your error!
    async fetchForecast(city, apiKey, units = 'metric') {
        const coords = await this.getCoordinates(city, apiKey);
        return this.fetchForecastByCoords(coords.lat, coords.lon, apiKey, units);
    },

    // 4. Base fetch functions using coordinates
    async fetchCurrentWeatherByCoords(lat, lon, apiKey, units = 'metric') {
        const response = await fetch(`${this.BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`);
        if (!response.ok) throw new Error('Failed to fetch current weather.');
        return await response.json();
    },

    async fetchForecastByCoords(lat, lon, apiKey, units = 'metric') {
        const response = await fetch(`${this.BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`);
        if (!response.ok) throw new Error('Failed to fetch forecast.');
        
        const data = await response.json();
        const dailyData = [];
        const seenDates = new Set();
        
        data.list.forEach(item => {
            const date = new Date(item.dt * 1000).toLocaleDateString();
            if (!seenDates.has(date)) {
                seenDates.add(date);
                dailyData.push(item);
            }
        });
        
        return dailyData.slice(1, 6); 
    }
};