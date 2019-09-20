import React from 'react';
import Forecast from './Forecast';
import Header from './Header';
import Footer from './Footer';
import keys from './env.js'

import './App.css';

class App extends React.Component {

  // Lifecycle methods

  constructor(props) {
    super(props);

    this.state = {
      city: null,
      coords: null,
      units: 'us', // TODO: Set this based on a cookie
      weather: null
    }

    this.changeUnits = this.changeUnits.bind(this);
    this.getWeather = this.getWeather.bind(this);
  }

  componentDidMount() {

    // Kick off the site by finding the user's location
    this.getUserLocation();
  }

  render() {
    return (
      <div className="container">
        <Header
          getUserLocation={this.getUserLocation}
          getWeather={this.getWeather}
          units={this.state.units}
          changeUnits={this.changeUnits} />

        <Forecast
          city={this.state.city}
          isFindingLocation={this.state.isFindingLocation}
          isLoadingWeather={this.state.isLoadingWeather}
          units={this.state.units}
          weather={this.state.weather} />

        <Footer />
      </div>
    );
  }

  // Custom methods

  /* Locate the user */
  getUserLocation() {
    let that = this;

    // Get the user's latitude and longitude
    this.setState({ 'isFindingLocation': true });

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(

        // If we get permission to the user's location, use it to kick off the API call
        function(userCoords) {

          that.setState({ 'isFindingLocation': false, coords: userCoords.coords });

          // Get the weather
          that.getWeather(userCoords.coords, that.state.units);
        },

        // If not, display a 'geolocation failed' message
        function(error) {
          console.log(error);
        },

        // Options
        {
          timeout: 10000
        });
    }
    else {

      // If the user's browser doesn't have a geolocation API at all, display an error
      console.log("Location unavailable from browser");
    }
  }

  /* Switch the units between imperial and metric */
  changeUnits() {
    this.getWeather(this.state.coords, (this.state.units === 'si' ? 'us' : 'si'));
  }

  /* Ask the server side to make an API call to Dark Sky to get the weather */
  getWeather(coords, units) {
    let that = this,
        url = 'http://localhost:3001/get-weather?longitude=' + coords.longitude + '&latitude=' + coords.latitude + '&units=' + units;

    this.setState({ 'isLoadingWeather': true });

    fetch(url, { credentials: 'include' })
      .then(results => {
        return results.json()
      })
      .then(data => {

        // Update the state with the retrieveved weather data and the city name
        that.setState({
          units: units,
          weather: data,
          isLoadingWeather: false
        });

        that.getCityName(coords);
      });
  }

  /* Use Google Maps' geocode API to retrieve the name of the user's city */
  getCityName(coords) {
    let
      that = this,
      geocodeUrl = 'https://maps.googleapis.com/maps/api/geocode/json?key=' + keys.googleMapsApi  + '&latlng=' + coords.latitude + ',' + coords.longitude;

    fetch(geocodeUrl)
      .then(results => {
        return results.json()
      })
      .then(data => {

        let
          addressComponents = data.results[0].address_components,
          localityPieces  = addressComponents.filter(n => [ 'neighborhood', 'locality', 'administrative_area_level_1', 'country' ].includes(n.types[0]) ),
          sanitizedAddress = localityPieces.map(n => n.long_name).join(', ');

          that.setState({ city: sanitizedAddress });
      });
  }
}

export default App;
