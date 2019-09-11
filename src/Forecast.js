import React from 'react';
import { withCookies, Cookies } from 'react-cookie';
import Moment from 'react-moment';
import keys from './env.js'

import './Forecast.scss';

class Forecast extends React.Component {

  // React lifecycle methods

  /* Constructor */
  constructor(props) {
    super(props);

    const { cookies } = props;

    // Set the empty default state
    this.state = {
      city: null,
      weather: null
    };
  }

  /* What to do after component mounts */
  componentDidMount() {

    /* Kick off the process of asking for the user's location */
    this.getUserLocation();
  }

  /* Render */
  render() {

    let currentlyData = this.state.weather != null ?
      <div className="col-11 col-md-12 currently day">
        <div className="row today">
          <div className={'p-3 inner-wrapper col-12 col-md-6 ' + this.getDiscomfortLevel(this.state.weather.currently.dewPoint).dpClass}>

            <div className="currently-data">
              <p className="heading">Right Now</p>

              <div>
                <div className="weather-icon"><img className="small-icon" src="/image/sun-cloud.svg" alt="Sun behind cloud" /></div>
                <div className="weather-desc">{this.state.weather.currently.summary}</div>
              </div>

              <div>
                <div className="weather-icon"><img className="small-icon" src="/image/thermometer.svg" alt="Thermometer" /></div>
                <div className="weather-desc">Temperature: {Math.round(this.state.weather.currently.temperature)}&deg;</div>
              </div>

              <div>
                <div className="weather-icon"><img className="small-icon" src="/image/humidity.svg" alt="Humidity scale" /></div>
                <div className="weather-desc">Humidity: {Math.round(this.state.weather.currently.humidity * 100)}%</div>
              </div>

              <div className="dewpoint">
                <div><img className="dewdrop-icon" src="/image/drop-silhouette.svg" alt="Dew drop" /> {this.getValueByUnits(this.state.weather.currently.dewPoint)}&deg;</div>
                <div className="discomfort-text">{this.getDiscomfortLevel(this.state.weather.currently.dewPoint).text}</div>
              </div>
            </div>
          </div>

          <div className={'p-3 inner-wrapper col-12 col-md-6 ' + this.getDiscomfortLevel(this.state.weather.daily.data[0].dewPoint).dpClass}>
            <p className="heading">Today's forecast</p>

            <div>
              <div className="weather-icon"><img className="small-icon" src="/image/sun-cloud.svg" alt="Sun behind cloud" /></div>
              <div className="weather-desc">{this.state.weather.daily.data[0].summary}</div>
            </div>

            <div>
              <div className="weather-icon"><img className="small-icon" src="/image/thermometer.svg" alt="Thermometer" /></div>
              <div className="weather-desc">Temperature: {Math.round(this.state.weather.daily.data[0].temperatureHigh)}&deg;</div>
            </div>

            <div>
              <div className="weather-icon"><img className="small-icon" src="/image/humidity.svg" alt="Humidity scale" /></div>
              <div className="weather-desc">Humidity: {Math.round(this.state.weather.daily.data[0].humidity * 100)}%</div>
            </div>

            <div className="dewpoint">
              <div><img className="dewdrop-icon" src="/image/drop-silhouette.svg" alt="Dew drop" /> {this.getValueByUnits(this.state.weather.daily.data[0].dewPoint)}&deg;</div>
              <div className="discomfort-text">{this.getDiscomfortLevel(this.state.weather.daily.data[0].dewPoint).text}</div>
            </div>
          </div>
        </div>
      </div>
      : null;

    let dailyData = this.state.weather != null ? this.state.weather.daily.data.slice(1).map(day =>
      <div className="col-11 col-sm-4 col-md-3 day" key={day.time}>
        <div className={ 'd-flex align-items-center p-3 inner-wrapper ' + this.getDiscomfortLevel(day.dewPoint).dpClass}>
          <div className="day-contents">

            <div className="temperature">
              <div className="date">
                <Moment format="dddd, MMMM, Do">
                  {this.offsetTime(day.time, this.state.weather.offset)}
                </Moment>
              </div>
              <img className="dewdrop-icon" src="/image/drop-silhouette.svg" alt="Dew drop" /> {this.getValueByUnits(day.dewPoint)}&deg;
              <div className="discomfort-text">{this.getDiscomfortLevel(day.dewPoint).text}</div>
            </div>

            <div className="summary">
              <div>{day.summary} High: {Math.round(day.temperatureHigh)}&deg;. Humidity: {Math.round(day.humidity * 100)}%.</div>
            </div>
          </div>
        </div>
      </div>
    ) : null;

    return (
      <div>
        <div className="row">
          <div className="col-12">
            <h5 className="city-name">{this.state.city}</h5>
          </div>
        </div>

        <div className="row justify-content-center justify-content-md-start" id="forecast-blocks">
          {currentlyData}
          {dailyData}
        </div>

        <div className="row text-center" id="denied-geolocation">
          <div className="col-12">
            <h3>Geolocation failed</h3>
            <p>But that's alright! You can use the site without geolocation by entering a location above.</p>
          </div>
        </div>
      </div>
    );
  }

  // Custom methods

  /* Retrieve the user's location */
  getUserLocation() {
    let that = this;
        //$gettingLocation = jQuery('#getting-location'),
        // $userDeniedGeolocation = jQuery('#denied-geolocation');

    // $gettingLocation.addClass('showing');

    // Get the user's latitude and longitude
    if ("geolocation" in navigator) {

      navigator.geolocation.getCurrentPosition(

        // If we get permission to the user's location, use it to kick off the API call
        function(userCoords) {

          // Get the weather
          that.getWeather(userCoords.coords);
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

  /* Ask the server side to make an API call to Dark Sky to get the weather */
  getWeather(coords) {
    let that = this,
        //$gettingWeather = $('#getting-weather'),
        //$forecastHolder = $('#forecast-blocks'),
        //$locationSearch = $('#location-search'),
        //$userDeniedGeolocation = $('.denied-geolocation'),
        //parsedCoords = JSON.parse(localStorage.getItem('cachedCoords')),
        cityName = '';

    //$gettingWeather.addClass('showing');

    fetch('http://localhost:3001/get-weather?longitude=' + coords.longitude + '&latitude=' + coords.latitude)
      .then(results => {
        return results.json()
      })
      .then(data => {

      //  $gettingWeather.removeClass('showing');
      //  $userDeniedGeolocation.removeClass('showing');

          // Fade the forecast blocks out, if they're out, then fade the new weather in
          //$forecastHolder.fadeOut(function() {

            // Get the city name for the user's location if one isn't cached in cachedCoords
            //if (parsedCoords && (parsedCoords['placeName'] !== undefined) && ($locationSearch.val() == '')) {
              //cityName = parsedCoords['placeName'];

              // Update the state with the retrieveved weather data and the city name
              that.setState({
                weather: data,
                city: cityName
              });

              that.getCityName(coords);

            /*}
            else {
              that.getCityName(coords);

              // Update the state with the retrieveved weather data
              that.setState({
                weather: data
              });
            }*/
          // }).fadeIn();
      });
  }

  /* Use Google Maps' geocode API to retrieve the name of the user's city */
  getCityName(coords) {
    let
      that = this,
      geocodeUrl = 'https://maps.googleapis.com/maps/api/geocode/json?key=' + keys.googleMapsApi  + '&latlng=' + coords.latitude + ',' + coords.longitude;
      // $locationSearch = $('#location-search');

    fetch(geocodeUrl)
      .then(results => {
        return results.json()
      })
      .then(data => {

        let
          addressComponents = data.results[0].address_components,
          localityPieces  = addressComponents.filter(n => [ 'neighborhood', 'locality', 'administrative_area_level_1', 'country' ].includes(n.types[0]) ),
          sanitizedAddress = localityPieces.map(n => n.long_name).join(', ');

        console.log(addressComponents, localityPieces, sanitizedAddress);

          that.setState({
            city: sanitizedAddress
          });
      });
  }

  /* Return the point on the discomfort scale for the provided dewpoint */
  getDiscomfortLevel(dewpoint) {
    const { cookies } = this.props;

    let
      roundedDewpoint = Math.round(dewpoint),
      levelText = '',
      dpClass = '',
      levelIsFound = false,
      thisLevel = null,
      scale = [
        {'f': 50, 'c': 10, 'text': 'Pleasant', 'class': 'dp-level-1' },
        {'f': 55, 'c': 12.8, 'text': 'Comfortable', 'class': 'dp-level-1' },
        {'f': 60, 'c': 15.6, 'text': 'Noticible', 'class': 'dp-level-2' },
        {'f': 65, 'c': 18.3, 'text': 'Sticky', 'class': 'dp-level-3' },
        {'f': 70, 'c': 21.1, 'text': 'Uncomfortable', 'class': 'dp-level-4' },
        {'f': 75, 'c': 23.9, 'text': 'Oppressive', 'class': 'dp-level-5' },
        {'f': 100, 'c': 37.8, 'text': 'Severe Discomfort', 'class': 'dp-level-6' },
      ];

    scale.forEach(function (value, i) {
      if (!levelIsFound) {
        if ((cookies.get('units') != null && cookies.get('units') == 'si' && roundedDewpoint < value['c'])
           || (((cookies.get('units') != null && cookies.get('units') == 'us') || cookies.get('units') == null) && roundedDewpoint < value['f'])) {
          levelIsFound = true
          thisLevel = value;
        }
      }
    });

    return { text: thisLevel['text'], dpClass: thisLevel['class'] };
  }

  /* Return a number (usually the dew point value)  with either one decimal place or zero depending on the user's selected units */
  getValueByUnits(value) {
    const { cookies } = this.props;
    return value.toFixed(cookies.get('units') == 'si' ? '1' : '0');
  }

  /* Return a formatted date based on a timestamp and UTC offset */
  offsetTime(timestamp, offset) {
    let
      date = new Date(),
      providedDate = new Date((timestamp * 1000) + (offset * 3600000) + (date.getTimezoneOffset() * 60000));

    // outputtedFormat = providedDate.format('l, F jS');

    return providedDate;
  }
}

export default withCookies(Forecast);
