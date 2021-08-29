import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import Satellite from './satellite/Satellite';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

function App() {



  return <Router>
    <Route exact path="/:port" component={Satellite} />
  </Router>
}

export default App;
