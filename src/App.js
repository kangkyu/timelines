
import React from 'react';

import logo from './logo.svg';
import './App.css';

import dataFromJSON, { buildSeriesData, buildSeries } from './data/index';
import latestPastEvents from './data/past_events/latest';
import pastEvents from './data/past_events/index';

import Timeline from './components/Timeline';
import Login from './containers/Login';
import { getUserSession } from './containers/meetup';

import Input, { API_KEY_LOCAL_STORE_KEY } from './components/Input';

import * as Util from './util/index';

const httpRegexp = new RegExp('https://www.meetup.com/');

const getGroupSpecifier = (inputText) => {
  Util.assertNotBlank('groupSpecifier', inputText);

  if (httpRegexp.test(inputText)) {
    return inputText.replace(httpRegexp, '')
                    .replace(/^([^\/]+)\/?.*$/, '$1');
  }

  return inputText;
};

const getApiKey = (inputText) => {
  if (Util.isBlank(inputText)) {
    const apiKeyFromLocalStore = localStorage.getItem(API_KEY_LOCAL_STORE_KEY);
    Util.assertNotBlank('API key', apiKeyFromLocalStore);
    return apiKeyFromLocalStore;
  }

  return inputText;
};

export default class App extends React.Component {
  constructor(props) {
    super(props);

    if (dataFromJSON.input) throw Error('dataFromJSON should not have input key');

    this.state = {
      isDevEnv: Util.isDevEnv(),
      userSession: getUserSession(),

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
    const { isDevEnv, userSession } = this.state;

    if (!isDevEnv && !userSession) return null;

    return Promise.all(
      latestPastEvents(this.state.meetupDataFromJSON)
    ).then((results) => {
      const sortEventsByTimeAscending = results.map(
        result => result.pastEvents.reverse()
      );

      const newSeries = [];
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
    const { groupSpecifier, apiKey } = this.state.input;
    const actualGroupSpecifier = getGroupSpecifier(groupSpecifier);
    const actualApiKey = getApiKey(apiKey);

    localStorage.setItem(API_KEY_LOCAL_STORE_KEY, apiKey);

    Promise.all(pastEvents(actualGroupSpecifier, actualApiKey)).then((results) => {
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

    const { options, doNotUpdate, incrementalUpdate, isDevEnv, userSession } = this.state;

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
          isDevEnv={isDevEnv}
          handleChangeGroupSpecifier={handleChangeGroupSpecifier}
          handleChangeApiKey={handleChangeApiKey}
          handleClick={handleClick}
          userSession={userSession}
        />

        <Login isDevEnv={isDevEnv} />
      </div>
    );
  }
}
