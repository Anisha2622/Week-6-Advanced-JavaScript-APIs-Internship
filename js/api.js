const WeatherAPI = {
    BASE_URL: '[https://api.openweathermap.org/data/2.5](https://api.openweathermap.org/data/2.5)',
    
    async fetchCurrentWeather(city, apiKey, units = 'metric') {
        try {
            const response = await fetch(`${this.BASE_URL}/weather?q=${city}&appid=${apiKey}&units=${units}`);
            
            if (!response.ok) {
                if (response.status === 401) throw new Error('Invalid API Key. Please update in settings.');
                if (response.status === 404) throw new Error(`City "${city}" not found.`);
                throw new Error('Failed to fetch weather data.');
            }
            
            return await response.json();
        } catch (error) {
            throw error;
        }
    },

    async fetchForecast(city, apiKey, units = 'metric') {
        try {
            const response = await fetch(`${this.BASE_URL}/forecast?q=${city}&appid=${apiKey}&units=${units}`);
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
        } catch (error) {
            throw error;
        }
    }
};
