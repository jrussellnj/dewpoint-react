import React from 'react';
import './Header.scss';

class Header extends React.Component {
  render() {
    return (
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
    );
  }
}

export default Header;
