import React from 'react';
import Forecast from './Forecast';
import Header from './Header';
import Footer from './Footer';

import './App.css';

function App() {
  return (
    <div className="container">
      <Header />

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

      <Footer />
    </div>
  );
}

export default App;
