import React from 'react';
import Forecast from './Forecast';
import './App.css';

function App() {
  return (
    <div className="container">
      <header className="row align-items-center">
        <div className="col-12 col-md-6">
          <h1> <img className="dewdrop" src="/image/drop.svg" /> Dew Point Forecast </h1>
        </div>

        <div className="col-12 col-md-6">
          <div>
            <input id="location-search" type="text" placeholder="Find dew point in another location..." />
            <a href="#" id="locate-me"><img src="/image/target.svg" /> Use my location</a>
          </div>

          <div className="mb-2">
            <a href="#" id="switch-units">Change units to <span id="opposite-units"> oppositeUnits </span></a>
          </div>
        </div>
      </header>

      <div className="row loading-icons">
        <div className="col-12 text-center">
          <img src="/image/target.svg" id="getting-location" />
          <img src="/image/sun-cloud.svg" id="getting-weather" />
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="row justify-content-center forecast-holder">
            <div className="col-12">
              <Forecast />
            </div>
          </div>
        </div>
      </div>

      <footer className="row">
        <div className="col-12 justify-content-center">
          <p className="mb-2"><a target="_blank" href="https://www.weather.gov/arx/why_dewpoint_vs_humidity" className="underlined">What is the "dew point"?</a></p>
          <p><a target="_blank" href="https://darksky.net/poweredby/">Powered by Dark Sky</a> API. Icons made by <a href="https://www.flaticon.com/authors/vectors-market" title="Vectors Market">Vectors Market</a>, <a href="https://www.freepik.com/" title="Freepik">Freepik</a>, <a href="https://www.flaticon.com/authors/epiccoders" title="EpicCoders">EpicCoders</a>, and <a href="https://www.flaticon.com/authors/lucy-g" title="Lucy G">Lucy G</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a>.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
