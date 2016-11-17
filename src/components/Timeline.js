import React from 'react';
import Highcharts from 'highcharts';

import 'isomorphic-fetch';

import data from '../data/index';

const container = 'chart';

export const info = (obj) => {
  console.log(obj);
};

export default class Timeline extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...data, options: data.forChart
    };
  }

  componentDidMount() {
    this.chart = new Highcharts.Chart(container, this.state.options);
  }

  componentWillUnmount() {
    this.chart.destroy();
  }

  render() {
    info({ state: this.state });
    return (
      <div id={container} />
    );
  }
}
