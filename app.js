/* Global Variables */
const weatherApiUrl = 'https://api.openweathermap.org/data/2.5/weather';
const openWeatherApiKey = 'ae684c8809f260571a8216177ef33e56'; // Personal API Key for OpenWeatherMap API

// Get current date dynamically in MM.DD.YYYY format
let currentDate = new Date();
let formattedDate = `${currentDate.getMonth() + 1}.${currentDate.getDate()}.${currentDate.getFullYear()}`;

const userForm = document.getElementById('userInfo');

// Event listener attached to the "Generate" button
const submitButton = document.getElementById('generate');
submitButton.addEventListener('click', handleGenerateClick);

/* Function triggered by button click */
function handleGenerateClick(event) {
    event.preventDefault();

    // Capture user input for zip code and feelings
    const userZipCode = document.getElementById('zip').value;
    const userFeelings = document.getElementById('feelings').value;

    if (userZipCode !== '') {
        submitButton.classList.remove('invalid');
        fetchWeatherData(weatherApiUrl, userZipCode, openWeatherApiKey)
            .then(function(weatherData) {
                // Send weather data and user input to server
                sendDataToServer('/add', {
                    temp: kelvinToCelsius(weatherData.main.temp),
                    date: formattedDate,
                    content: userFeelings
                });
            }).then(function() {
                // Update UI with new data
                refreshUI();
            }).catch(function(error) {
                console.error(error);
                alert('Invalid zip code. Please try again.');
            });

        userForm.reset();
    } else {
        submitButton.classList.add('invalid');
    }
}

/* Function to fetch weather data from the API */
const fetchWeatherData = async(apiUrl, zipCode, apiKey) => {
    const response = await fetch(`${apiUrl}?q=${zipCode}&appid=${apiKey}`);
    try {
        const weather = await response.json();
        return weather;
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
};

/* Function to send data to the server */
const sendDataToServer = async(endpoint = '', data = {}) => {
    const response = await fetch(endpoint, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });

    try {
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error posting data:', error);
    }
};

/* Function to update the UI with the latest data */
const refreshUI = async() => {
    const response = await fetch('/all');
    try {
        const allEntries = await response.json();
        console.log(allEntries);
        // Update UI elements with fetched data
        if (allEntries.date && allEntries.temp && allEntries.content) {
            document.getElementById('date').innerHTML = allEntries.date;
            document.getElementById('temp').innerHTML = `${allEntries.temp} °C`;
            document.getElementById('content').innerHTML = allEntries.content;
        }
    } catch (error) {
        console.error('Error updating UI:', error);
    }
};

// Helper function to convert temperature from Kelvin to Celsius
function kelvinToCelsius(kelvin) {
    if (kelvin < 0) {
        return 'Below absolute zero (0 K)';
    } else {
        return (kelvin - 273.15).toFixed(2);
    }
}
