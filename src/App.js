
import React from 'react';

import logo from './logo.svg';
import './App.css';

import Timeline from './components/Timeline';

export default () => (
  <div className="App">
    <div className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <h2>Meetup Events Timelines</h2>
    </div>

    <Timeline />
  </div>
);
