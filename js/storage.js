const Storage = {
    getKeys() {
        const prefs = localStorage.getItem('weatherPrefs');
        return prefs ? JSON.parse(prefs) : { apiKey: '', defaultCity: 'London', units: 'metric' };
    },
    
    saveKeys(prefs) {
        localStorage.setItem('weatherPrefs', JSON.stringify(prefs));
    },
    
    getRecentSearches() {
        const recent = localStorage.getItem('weatherRecent');
        return recent ? JSON.parse(recent) : [];
    },
    
    saveSearch(city) {
        let recent = this.getRecentSearches();
        recent = recent.filter(c => c.toLowerCase() !== city.toLowerCase());
        recent.unshift(city);
        if (recent.length > 5) recent.pop();
        
        localStorage.setItem('weatherRecent', JSON.stringify(recent));
        return recent;
    }
};
