
const pointFormat = () => (
  '{point.name}<br>' +
  'Venue: {point.venueName}<br>' +
  // '{point.link}<br>' +
  '{point.x:%b %e}: {point.y} {point.who}'
);

export default {
  chart: {
    zoomType: 'x',
  },

  title: { text: 'Meetup Events Timelines' },
  // subtitle: { text: 'Los Angeles and surrounding areas' },

  xAxis: {
    type: 'datetime',
    dateTimeLabelFormats: {
      month: '%b \'%y',
      year: '%Y'
    },
    title: {
      text: 'Date (zoom by dragging your pointer across 2 points along the X-axis)'
    }
  },

  yAxis: {
    title: {
      text: 'Yes RSVP Count'
    },
    min: 0
  },

  tooltip: {
    headerFormat: '<b>{series.name}</b><br>',
    pointFormat: pointFormat()
  },

  legend: {
    layout: 'vertical',
    align: 'center',
    verticalAlign: 'bottom',
    borderWidth: 0
  },

  series: []
};
