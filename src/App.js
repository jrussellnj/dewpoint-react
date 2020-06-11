import React from 'react';
import Forecast from './Forecast';
import Header from './Header';
import Footer from './Footer';
import keys from './env.js'
import ReactGA from 'react-ga';
import './App.css';

ReactGA.initialize('UA-124178989-1');
ReactGA.pageview(window.location.pathname + window.location.search);

class App extends React.Component {

  // Lifecycle methods

  constructor(props) {
    super(props);

    this.state = {
      city: null,
      coords: null,
      units: 'us', // TODO: Set this based on a cookie
      weather: null,
      isFindingLocation: false,
      isLoadingWeather: false,
      locationFailed: false
    }

    this.changeUnits = this.changeUnits.bind(this);
    this.updateCoords = this.updateCoords.bind(this);
    this.getUserLocation = this.getUserLocation.bind(this);
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
          updateCoords={this.updateCoords}
          units={this.state.units}
          changeUnits={this.changeUnits} />

        <Forecast
          city={this.state.city}
          isFindingLocation={this.state.isFindingLocation}
          isLoadingWeather={this.state.isLoadingWeather}
          locationFailed={this.state.locationFailed}
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
    this.setState({ 'isFindingLocation': true, 'weather': null, 'city': null, 'coords': null });

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
          // If the user's browser doesn't have a geolocation API at all, display an error
          that.setState({ 'isFindingLocation': false, 'locationFailed': true });
        },

        // Options
        {
          timeout: 10000
        });
    }
    else {

      // If the user's browser doesn't have a geolocation API at all, display an error
      that.setState({ 'isFindingLocation': false, 'locationFailed': true });
    }
  }

  /* Ask the server side to make an API call to Dark Sky to get the weather */
  getWeather(coords, units) {
    let that = this,
        url = '/get-weather?longitude=' + coords.longitude + '&latitude=' + coords.latitude + '&units=' + units;

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
          isLoadingWeather: false,
          locationFailed: false
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

          ReactGA.event({
            action: 'Got city name',
            value: sanitizedAddress
          });

          that.setState({ city: sanitizedAddress });
      });
  }

  /* Switch the units between imperial and metric */
  changeUnits() {
    if (this.state.coords) {
      this.getWeather(this.state.coords, (this.state.units === 'si' ? 'us' : 'si'));
    }
  }

  /* Used for getting weather from other locations than the one used on site load */
  updateCoords(coords) {

    // Update the state with the new coordinates
    this.setState({ coords: coords });

    // Make a call to getWeather so we actually display the weather of these new coordinates' location
    this.getWeather(this.state.coords, this.state.units);
  }
}

export default App;
