
import highChartsConfig from './high_charts_config';
import meetupDataFromJSON from './from_ruby.json';

export const buildSeriesData = pastEvent => ({
  x: pastEvent.time,
  y: pastEvent.yes_rsvp_count,
  name: pastEvent.name,
  who: pastEvent.group.who,
  link: pastEvent.link,
  venueName: ((pastEvent.venue && pastEvent.venue.name) || '')
});

export const buildSeries = allGroupData => (
  allGroupData.map(dataOfOneGroup => ({
    name: dataOfOneGroup.pastEvents[0].group.name,
    data: dataOfOneGroup.pastEvents.map(pev => buildSeriesData(pev)),
    cursor: 'pointer',
    point: {
      events: {
        click() {
          const link = this.link;
          window.open(link, '_blank');
        }
      },
    }
  }))
);

export const buildDefaultSeries = (meetupData = meetupDataFromJSON) => (
  meetupData.map((groupData, ix) => {
    const groupDataFromJSON = meetupDataFromJSON[ix];

    return {
      name: groupDataFromJSON.main.body.name,

      data: groupData.pastEvents.map(pev => buildSeriesData(
        pev, groupDataFromJSON.main.body.who
      )),

      cursor: 'pointer',
      point: {
        events: {
          click() {
            const link = this.link;
            window.open(link, '_blank');
          }
        },
      }
    };
  })
);

export default {
  meetupDataFromJSON,
  highChartsConfig,
  forChart: {
    ...highChartsConfig, series: buildDefaultSeries()
  }
};
