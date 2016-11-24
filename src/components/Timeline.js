
import React, { PropTypes } from 'react';
import Highcharts from 'highcharts';

const container = 'chart';

export default class Timeline extends React.Component {
  static propTypes() {
    return {
      options: PropTypes.shape().isRequired
    };
  }

  componentDidMount() {
    this.chart = new Highcharts.Chart(container, this.props.options);
  }

  componentDidUpdate() {
    const { doNotUpdate, incrementalUpdate, options } = this.props;

    if (doNotUpdate) return null;

    if (incrementalUpdate) {
      this.chart.series.forEach((ser, ix) => {
        // http://api.highcharts.com/highcharts/Series.setData
        ser.setData(this.props.options.series[ix].data);
      });
    } else {
      this.chart.destroy();
      this.chart = new Highcharts.Chart(container, options);
    }
  }

  componentWillUnmount() {
    this.chart.destroy();
  }

  render() {
    return (
      <div id={container} />
    );
  }
}
