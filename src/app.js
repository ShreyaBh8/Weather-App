const express = require('express');
const app = express();
const hbs = require('hbs');
const path = require('path');
const requests = require('requests');
const port = 3000;

const tempPath = path.join(__dirname, '../templates/hbs');
const partialPath = path.join(__dirname, '../templates/partials');

const staticPath = path.join(__dirname, '../public');
app.use(express.static(staticPath));

app.set('view engine', 'hbs');
app.set('views', tempPath);

hbs.registerPartials(partialPath);

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/weather', (req, res) => {
    const cityName = req.query.name || 'Pune'; 

    requests(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=739ad22fbe5fc9a1998f18c0c44b0f08`)
        .on('data', function (chunk) {
            try {
                const obj = JSON.parse(chunk);
                const city = obj.name;

                const temperature = (obj.main.temp - 273.15).toFixed(2);
                const weather = obj.weather[0].main;
                const minTemp = (obj.main.temp_min - 273.15).toFixed(2);
                const maxTemp = (obj.main.temp_max - 273.15).toFixed(2);
                const humidity = obj.main.humidity;
                const visibility = obj.visibility;
                const feel = (obj.main.feels_like - 273.15).toFixed(2);
                const speed = (obj.wind.speed * 3.6).toFixed(2);
                const country = obj.sys.country;

                res.render('weather', {
                    location: city,
                    tempval: temperature,
                    status: weather,
                    tempmin: minTemp,
                    tempmax: maxTemp,
                    country: country,
                    hum: humidity,
                    vis: visibility,
                    speed: speed,
                    temp: feel
                });
            } catch (e) {
                res.render('404', { error: 'Could not retrieve data' });
            }
        })
        .on('end', function (err) {
            if (err) console.log('Connection closed due to errors', err);
        });
});


app.get('/about/*', (req, res) => {
    res.render('404', {
        error: "Oops, this about us page couldn't be found !!"
    });
});

app.get('/weather/*', (req, res) => {
    res.render('404', {
        error: "Oops, this weather page couldn't be found !!"
    });
});


app.get('*', (req, res) => {
    res.render('404', {
        error: "Oops, this page couldn't be found !!"
    });
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
