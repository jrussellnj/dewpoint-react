import React from 'react';
import CurrentlyBlock from './CurrentlyBlock.js';
import DailyBlock from './DailyBlock.js';

import './Forecast.scss';

class Forecast extends React.Component {

  // React lifecycle methods

  /* Render */
  render() {

    let currentlyData = this.props.weather == null ? null :
      <div className="col-11 col-md-12 currently day">
        <div className="row today">
          <CurrentlyBlock
            weather={this.props.weather.currently}
            heading="Right Now"
            key={this.props.weather.currently.time}
            getDiscomfortLevel={this.getDiscomfortLevel}
            getValueByUnits={this.getValueByUnits}
            units={this.props.units} />

          <CurrentlyBlock
            weather={this.props.weather.daily.data[0]}
            heading="Today's Forecast"
            key={this.props.weather.daily.data[0].time}
            getDiscomfortLevel={this.getDiscomfortLevel}
            getValueByUnits={this.getValueByUnits}
            units={this.props.units} />
        </div>
      </div>;

    let dailyData = (this.props.weather == null ? null :
      this.props.weather.daily.data.slice(1).map(day =>
        <DailyBlock
          day={day}
          key={day.time}
          getDiscomfortLevel={this.getDiscomfortLevel}
          getValueByUnits={this.getValueByUnits}
          offset={this.props.weather.offset}
          units={this.props.units} />
      )
    );

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
  getDiscomfortLevel(dewpoint, units) {

    let
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
        if ((units !== null && units === 'si' && roundedDewpoint < value['c'])
           || (((units !== null && units === 'us') || units === null) && roundedDewpoint < value['f'])) {
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
  getValueByUnits(value, units) {
    return value.toFixed(units === 'si' ? '1' : '0');
  }
}

export default Forecast;
