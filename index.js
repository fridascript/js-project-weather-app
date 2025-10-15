"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const weatherURL = `https://opendata-download-metfcst.smhi.se/api/category/snow1g/version/1/geotype/point/lon/18.062639/lat/59.329468/data.json?timeseries=24`;
const fetchWeather = async () => {
    try {
        const response = await fetch(weatherURL);
        if (!response.ok)
            throw new Error(`HTTP error: ${response.status}`);
        const data = await response.json();
    }
    catch (error) {
    }
    console.log(`caught and error, ${error}`);
};
//# sourceMappingURL=index.js.map