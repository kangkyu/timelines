
import React from 'react';

import logo from './logo.svg';
import './App.css';

// ...
import dataFromJSON, { buildSeriesData, buildSeries } from './data/index';
import latestPastEvents from './data/past_events/latest';
import pastEvents from './data/past_events/index';

import Timeline from './components/Timeline';
import Input from './components/Input';

import * as Util from './util/index';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    if (dataFromJSON.input) throw Error('dataFromJSON should not have input key');

    this.state = {
      doNotUpdate: true,
      incrementalUpdate: true,
      input: {},
      ...dataFromJSON,
      options: dataFromJSON.forChart
    };

    this.handleChangeGroupSpecifier = this.handleChangeGroupSpecifier.bind(this);
    this.handleChangeApiKey = this.handleChangeApiKey.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  // componentWillMount() {
  //   Promise.all(pastEvents()).then((results) => {

  //     this.setState({
  //       ...this.state, options: {
  //         ...dataFromJSON.forChart, series: buildSeries(results)
  //       }
  //     });
  //   });
  // }

  componentWillMount() {
    Promise.all(
      latestPastEvents(this.state.meetupDataFromJSON)
    ).then((results) => {
      const sortEventsByTimeAscending = results.map(
        ({ pastEvents }) => pastEvents.reverse()
      );

      const newSeries = []
      const currentSeries = this.state.options.series;

      let ix = 0;
      for (; ix < currentSeries.length; ix += 1) {
        const groupSeries = currentSeries[ix];

        const latest = sortEventsByTimeAscending[ix].map(pev => (
          buildSeriesData(pev, groupSeries.who)
        ));

        if (latest.length === 0) {
          newSeries[ix] = groupSeries;
        } else {
          newSeries[ix] = {
            ...groupSeries, data: groupSeries.data.concat(latest)
          };
        }
      }

      this.setState({
        ...this.state,

        doNotUpdate: false,
        incrementalUpdate: true,

        options: {
          ...dataFromJSON.forChart, series: newSeries
        }
      });
    });
  }

  handleChangeGroupSpecifier(e) {
    this.setState({ input: {
      ...this.state.input, groupSpecifier: e.target.value
    } });
  }

  handleChangeApiKey(e) {
    this.setState({ input: {
      ...this.state.input, apiKey: e.target.value
    } });
  }

  handleClick() {
    const groupSpecifier = this.state.input.groupSpecifier;
    let apiKey = this.state.input.apiKey;

    Util.assertNotBlank('groupSpecifier', groupSpecifier);

    const API_KEY_STORE_KEY = 'API_KEY';
    if (Util.isBlank(apiKey)) {
      apiKey = localStorage.getItem(API_KEY_STORE_KEY);
      Util.assertNotBlank('apiKey', apiKey);
    }

    localStorage.setItem(API_KEY_STORE_KEY, apiKey);

    Promise.all(pastEvents(groupSpecifier, apiKey)).then((results) => {
      this.setState({
        ...this.state,

        doNotUpdate: false,
        incrementalUpdate: false,
        options: {
          ...dataFromJSON.forChart, series: buildSeries(results)
        }
      });

      this.setState({ doNotUpdate: true });
    });
  }

  render() {
    const {
      handleChangeGroupSpecifier,
      handleChangeApiKey,
      handleClick
    } = this;

    const { options, doNotUpdate, incrementalUpdate } = this.state;

    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Meetup Events Timelines</h2>
        </div>

        <Timeline
          options={options}
          doNotUpdate={doNotUpdate}
          incrementalUpdate={incrementalUpdate}
        />

        <Input
          handleChangeGroupSpecifier={handleChangeGroupSpecifier}
          handleChangeApiKey={handleChangeApiKey}
          handleClick={handleClick}
        />
      </div>
    );
  }
}
