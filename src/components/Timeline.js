
import React, { PropTypes } from 'react';
import Highcharts from 'highcharts';

const containerID = 'chart';

export default class Timeline extends React.Component {
  componentDidMount() {
    this.chart = new Highcharts.Chart(containerID, this.props.options);
  }

  componentDidUpdate() {
    const { doNotUpdate, incrementalUpdate, options } = this.props;

    if (!doNotUpdate) {
      if (incrementalUpdate) {
        this.chart.series.forEach((ser, ix) => {
          // http://api.highcharts.com/highcharts/Series.setData
          ser.setData(this.props.options.series[ix].data);
        });
      } else {
        this.chart.destroy();
        this.chart = new Highcharts.Chart(containerID, options);
      }
    }
  }

  componentWillUnmount() {
    this.chart.destroy();
  }

  render() {
    return (
      <div id={containerID} />
    );
  }
}

Timeline.propTypes = {
  options: PropTypes.shape().isRequired,
  doNotUpdate: PropTypes.bool.isRequired,
  incrementalUpdate: PropTypes.bool.isRequired
};
