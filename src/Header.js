import React from 'react';
import './Header.scss';

class Header extends React.Component {
  render() {
    return (
      <header className="row align-items-center">
        <div className="col-12 col-md-6">
          <h1> <img className="dewdrop" src="/image/drop.svg" alt="Dew drop" /> Dew Point Forecast </h1>
        </div>

        <div className="col-12 col-md-6">
          <div>
            <input id="location-search" type="text" placeholder="Find dew point in another location..." />
            <button className="locate-me" onClick={this.props.locateMe}><img src="/image/target.svg" alt="Locating icon" /> Use my location</button>
          </div>

          <div className="mb-2">
            <button className="switch-units" onClick={this.props.changeUnits}>Change units to <span id="opposite-units"> {this.props.units === 'us' ? 'Celsius' : 'Fahrenheit'} </span></button>
          </div>
        </div>
      </header>
    );
  }
}

export default Header;
