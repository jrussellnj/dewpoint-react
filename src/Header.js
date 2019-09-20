import React from 'react';
import keys from './env.js'

import './Header.scss';

/* global google */

class Header extends React.Component {

  // React lifecycle methods

  /* Component did mount */
  componentDidMount() {

    // Connect the initLookup function within this class to the global window context, so Google Maps can invoke it
    window.initLookup = this.initLookup.bind(this);

    // Asynchronously load the Google Maps script, passing in the callback reference
    this.loadJS('https://maps.googleapis.com/maps/api/js?key=' + keys.googleMapsApi + '&libraries=places&callback=initLookup');
  }

  /* Render! */
  render() {
    return (
      <header className="row align-items-center">
        <div className="col-12 col-md-6">
          <h1> <img className="dewdrop" src="/image/drop.svg" alt="Dew drop" /> Dew Point Forecast </h1>
        </div>

        <div className="col-12 col-md-6">
          <div>
            <input id="location-search" type="text" placeholder="Find dew point in another location..." onClick={(e) => this.clearContents(e)} />
            <button className="locate-me" onClick={this.props.locateMe}><img src="/image/target.svg" alt="Locating icon" /> Use my location</button>
          </div>

          <div className="mb-2">
            <button className="switch-units" onClick={this.props.changeUnits}>Change units to <span id="opposite-units"> {this.props.units === 'us' ? 'Celsius' : 'Fahrenheit'} </span></button>
          </div>
        </div>
      </header>
    );
  }

  // Custom methods

  /* Used for loading external Javascript */
  loadJS(src, callback) {
    var
      ref = window.document.getElementsByTagName("script")[0],
      script = window.document.createElement("script");

    script.src = src;
    script.async = true;
    script.onload = callback;

    ref.parentNode.insertBefore(script, ref);
  }

  /* Initialize the location search bar */
  initLookup() {
    let
      that = this,
      input = document.getElementById('location-search'),
      autocomplete = new google.maps.places.Autocomplete(input, { fields: ['place_id', 'name', 'types'] }),
      geocoder = new google.maps.Geocoder();

    autocomplete.addListener('place_changed', function() {
      let place = autocomplete.getPlace();

      if (place.place_id) {

        // Get the latitude and longitude for the new location and then find its weather
        geocoder.geocode({ 'placeId': place.place_id }, function(results, status) {
          if (status !== 'OK') {
            window.alert('Geocoder failed due to: ' + status);
            return;
          }

          // Get weather for the requested location
          that.props.getWeather({ latitude: results[0].geometry.location.lat(), longitude: results[0].geometry.location.lng() }, that.props.units);
        });
      }
    });

    // Hitting enter selects the first location in thelocations dropdown
    let _addEventListener = (input.addEventListener) ? input.addEventListener : input.attachEvent;

    // Simulate a 'down arrow' keypress on hitting 'return' when no pac suggestion is selected and then trigger the original listener.
    function addEventListenerWrapper(type, listener) {

      if (type === 'keydown') {
        var originalListener = listener;

        listener = function (event) {

          if (event.which === 13 || event.keyCode === 13) {
            let suggestionSelected = document.getElementsByClassName('pac-item.pac-item-selected').length > 0;

            if (!suggestionSelected) {
              let simulatedDownArrow = new KeyboardEvent('keydown', { 'keyCode': 40, 'which': 40 });
              originalListener.apply(input, [ simulatedDownArrow ]);
            }
          }

          originalListener.apply(input, [ event ]);
        };
      }

      // Add the modified listener
      _addEventListener.apply(input, [ type, listener ]);
    }

    if (input.addEventListener) {
      input.addEventListener = addEventListenerWrapper;
    }
    else if (input.attachEvent) {
      input.attachEvent = addEventListenerWrapper;
    }
  }

  /* Clear the contents of the clicked-in input field */
  clearContents(e) {
    e.target.value = '';
  }
}

export default Header;
