import React from 'react';
import Moment from 'react-moment';

import './Forecast.scss';

class Forecast extends React.Component {

  // React lifecycle methods

  /* Render */
  render() {

    // TODO: Break this down into more components, such as <ForecastBlock> for each individual day block!
    let currentlyData = this.props.weather != null ?
      <div className="col-11 col-md-12 currently day">
        <div className="row today">
          <div className={'p-3 inner-wrapper col-12 col-md-6 ' + this.getDiscomfortLevel(this.props.weather.currently.dewPoint).dpClass}>

            <div className="currently-data">
              <p className="heading">Right Now</p>

              <div>
                <div className="weather-icon"><img className="small-icon" src="/image/sun-cloud.svg" alt="Sun behind cloud" /></div>
                <div className="weather-desc">{this.props.weather.currently.summary}</div>
              </div>

              <div>
                <div className="weather-icon"><img className="small-icon" src="/image/thermometer.svg" alt="Thermometer" /></div>
                <div className="weather-desc">Temperature: {Math.round(this.props.weather.currently.temperature)}&deg;</div>
              </div>

              <div>
                <div className="weather-icon"><img className="small-icon" src="/image/humidity.svg" alt="Humidity scale" /></div>
                <div className="weather-desc">Humidity: {Math.round(this.props.weather.currently.humidity * 100)}%</div>
              </div>

              <div className="dewpoint">
                <div><img className="dewdrop-icon" src="/image/drop-silhouette.svg" alt="Dew drop" /> {this.getValueByUnits(this.props.weather.currently.dewPoint)}&deg;</div>
                <div className="discomfort-text">{this.getDiscomfortLevel(this.props.weather.currently.dewPoint).text}</div>
              </div>
            </div>
          </div>

          <div className={'p-3 inner-wrapper col-12 col-md-6 ' + this.getDiscomfortLevel(this.props.weather.daily.data[0].dewPoint).dpClass}>
            <p className="heading">Today's forecast</p>

            <div>
              <div className="weather-icon"><img className="small-icon" src="/image/sun-cloud.svg" alt="Sun behind cloud" /></div>
              <div className="weather-desc">{this.props.weather.daily.data[0].summary}</div>
            </div>

            <div>
              <div className="weather-icon"><img className="small-icon" src="/image/thermometer.svg" alt="Thermometer" /></div>
              <div className="weather-desc">Temperature: {Math.round(this.props.weather.daily.data[0].temperatureHigh)}&deg;</div>
            </div>

            <div>
              <div className="weather-icon"><img className="small-icon" src="/image/humidity.svg" alt="Humidity scale" /></div>
              <div className="weather-desc">Humidity: {Math.round(this.props.weather.daily.data[0].humidity * 100)}%</div>
            </div>

            <div className="dewpoint">
              <div><img className="dewdrop-icon" src="/image/drop-silhouette.svg" alt="Dew drop" /> {this.getValueByUnits(this.props.weather.daily.data[0].dewPoint)}&deg;</div>
              <div className="discomfort-text">{this.getDiscomfortLevel(this.props.weather.daily.data[0].dewPoint).text}</div>
            </div>
          </div>
        </div>
      </div>
      : null;

    let dailyData = this.props.weather != null ? this.props.weather.daily.data.slice(1).map(day =>
      <div className="col-11 col-sm-4 col-md-3 day" key={day.time}>
        <div className={ 'd-flex align-items-center p-3 inner-wrapper ' + this.getDiscomfortLevel(day.dewPoint).dpClass}>
          <div className="day-contents">

            <div className="temperature">
              <div className="date">
                <Moment format="dddd, MMMM, Do">
                  {this.offsetTime(day.time, this.props.weather.offset)}
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
        <div className="row loading-icons">
          <div className="col-12 text-center">
            { this.props.isFindingLocation ? <img src="/image/target.svg" id="getting-location" alt="Finding location" /> : null }
            { this.props.isLoadingWeather ? <img src="/image/sun-cloud.svg" id="getting-weather" alt="Loading weather" /> : null }
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="row justify-content-center forecast-holder">
              <div className="col-12">

                <div className="row">
                  <div className="col-12">
                    <h5 className="city-name">{this.props.city}</h5>
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
          </div>
        </div>
      </div>

      </div>
    );
  }

  // Custom methods

  /* Return the point on the discomfort scale for the provided dewpoint */
  getDiscomfortLevel(dewpoint) {

    let
      that = this,
      roundedDewpoint = Math.round(dewpoint),
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
        if ((that.props.units !== null && that.props.units === 'si' && roundedDewpoint < value['c'])
           || (((that.props.units !== null && that.props.units === 'us') || that.props.units === null) && roundedDewpoint < value['f'])) {
          levelIsFound = true
          thisLevel = value;
        }
      }
    });

    return {
      text: thisLevel['text'],
      dpClass: thisLevel['class']
    };
  }

  /* Return a number (usually the dew point value)  with either one decimal place or zero depending on the user's selected units */
  getValueByUnits(value) {
    return value.toFixed(this.props.units === 'si' ? '1' : '0');
  }

  /* Return a formatted date based on a timestamp and UTC offset */
  offsetTime(timestamp, offset) {
    let
      date = new Date(),
      providedDate = new Date((timestamp * 1000) + (offset * 3600000) + (date.getTimezoneOffset() * 60000));

    return providedDate;
  }
}

export default Forecast;
