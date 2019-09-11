import React from 'react';
import Forecast from './Forecast';
import Header from './Header';
import Footer from './Footer';

import './App.css';

function App() {
  return (
    <div className="container">
      <Header />
      <Forecast />
      <Footer />
    </div>
  );
}

export default App;
