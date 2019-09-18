import React from 'react';

class CurrentlyBlock extends React.Component {

  // Lifecycle methods

  render() {
    const currentWeather = this.props.weather,
          discomfortLevel = this.props.getDiscomfortLevel(currentWeather.dewPoint, this.props.units);

    const blockBody = (currentWeather === undefined ? null :
      <div className={'p-3 inner-wrapper col-12 col-md-6 ' + discomfortLevel.dpClass}>

        <div className="currently-data">
          <p className="heading">{this.props.heading}</p>

          <div>
            <div className="weather-icon"><img className="small-icon" src="/image/sun-cloud.svg" alt="Sun behind cloud" /></div>
            <div className="weather-desc">{currentWeather.summary}</div>
          </div>

          <div>
            <div className="weather-icon"><img className="small-icon" src="/image/thermometer.svg" alt="Thermometer" /></div>
            <div className="weather-desc">Temperature: {Math.round(currentWeather.temperature !== undefined ? currentWeather.temperature : currentWeather.temperatureHigh )}&deg;</div>
          </div>

          <div>
            <div className="weather-icon"><img className="small-icon" src="/image/humidity.svg" alt="Humidity scale" /></div>
            <div className="weather-desc">Humidity: {Math.round(currentWeather.humidity * 100)}%</div>
          </div>

          <div className="dewpoint">
            <div><img className="dewdrop-icon" src="/image/drop-silhouette.svg" alt="Dew drop" /> {this.props.getValueByUnits(currentWeather.dewPoint, this.props.units)}&deg;</div>
            <div className="discomfort-text">{discomfortLevel.text}</div>
          </div>
        </div>
      </div>
    );

    return blockBody;
  }
}

export default CurrentlyBlock;
