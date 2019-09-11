import React from 'react';
import './Footer.scss';

class Footer extends React.Component {
  render() {
    return (
      <footer className="row">
        <div className="col-12 justify-content-center">
          <p className="mb-2"><a target="_blank" href="https://www.weather.gov/arx/why_dewpoint_vs_humidity" className="underlined">What is the "dew point"?</a></p>
          <p><a target="_blank" href="https://darksky.net/poweredby/">Powered by Dark Sky</a> API. Icons made by <a href="https://www.flaticon.com/authors/vectors-market" title="Vectors Market">Vectors Market</a>, <a href="https://www.freepik.com/" title="Freepik">Freepik</a>, <a href="https://www.flaticon.com/authors/epiccoders" title="EpicCoders">EpicCoders</a>, and <a href="https://www.flaticon.com/authors/lucy-g" title="Lucy G">Lucy G</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a>.</p>
        </div>
      </footer>
    );
  }
}

export default Footer;
