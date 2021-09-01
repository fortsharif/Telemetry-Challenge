import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import SatelliteOne from './satellite/SatelliteOne'
import SatelliteTwo from './satellite/SatelliteTwo'


import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Bar from './bar/Bar'

function App() {



  return <Router>
    <Route component={Bar} />
    <Switch>
      <Route exact path="/" component={SatelliteOne} />
      <Route exact path="/satellite2" component={SatelliteTwo} />

    </Switch>
  </Router>
}

export default App;
