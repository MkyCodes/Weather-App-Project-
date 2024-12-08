// Initialize an empty JavaScript object to serve as a data storage endpoint
let weatherData = {};

// Import Express to set up the server and handle routes
const express = require('express');

/* Required Dependencies */
const bodyParser = require('body-parser');

// Create an instance of the Express application
const app = express();

/* Middleware Configuration */
// Configure Express to use the body-parser middleware for parsing URL-encoded and JSON data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Enable Cross-Origin Resource Sharing (CORS) for handling requests from other domains
const cors = require('cors');
app.use(cors());

// Serve static files from the "website" directory
app.use(express.static('website'));

// POST route to handle incoming weather data
app.post('/addData', handlePostData);

function handlePostData(req, res) {
    weatherData['temperature'] = req.body.temp;
    weatherData['dateRecorded'] = req.body.date;
    weatherData['userFeeling'] = req.body.content;
    res.send(weatherData);
}

// Set up the GET route to retrieve stored weather data
app.get('/fetchAll', fetchWeatherData);

function fetchWeatherData(req, res) {
    res.send(weatherData);
}

// Set up the server to listen on a specified port
const serverPort = 8080;
const server = app.listen(serverPort, () => {
    console.log(`Server is running on port: ${serverPort}`); // Debugging callback
});
