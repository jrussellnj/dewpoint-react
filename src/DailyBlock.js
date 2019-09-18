import React from 'react';
import Moment from 'react-moment';

class DailyBlock extends React.Component {

  // Lifecycle methods

  render() {
    const discomfortLevel = this.props.getDiscomfortLevel(this.props.day.dewPoint, this.props.units);

    const blockBody = (this.props.day === undefined ? null :
      <div className="col-11 col-sm-4 col-md-3 day">
        <div className={ 'd-flex align-items-center p-3 inner-wrapper ' + discomfortLevel.dpClass}>
          <div className="day-contents">

            <div className="temperature">
              <div className="date">
                <Moment format="dddd, MMMM, Do">
                  {this.offsetTime(this.props.day.time, this.props.offset)}
                </Moment>
              </div>
              <img className="dewdrop-icon" src="/image/drop-silhouette.svg" alt="Dew drop" /> {this.props.getValueByUnits(this.props.day.dewPoint, this.props.units)}&deg;
              <div className="discomfort-text">{discomfortLevel.text}</div>
            </div>

            <div className="summary">
              <div>{this.props.day.summary} High: {Math.round(this.props.day.temperatureHigh)}&deg;. Humidity: {Math.round(this.props.day.humidity * 100)}%.</div>
            </div>
          </div>
        </div>
      </div>
    );

    return(
      blockBody
    )
  }

  // Custom methods

  /* Return a formatted date based on a timestamp and UTC offset */
  offsetTime(timestamp, offset) {
    let
      date = new Date(),
      providedDate = new Date((timestamp * 1000) + (offset * 3600000) + (date.getTimezoneOffset() * 60000));

    return providedDate;
  }
}

export default DailyBlock;
