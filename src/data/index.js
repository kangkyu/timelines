
import highChartsDefault from './high_charts_default';
import meetupData from './from_ruby.json';

const series = (() => (
  meetupData.map(groupData => ({
    name: groupData.main.body.name,

    data: groupData.pastEvents.map(pev => ({
      x: pev.time,
      y: pev.yes_rsvp_count,
      name: pev.name,
      who: groupData.main.body.who,
      link: pev.link,
      venueName: ((pev.venue && pev.venue.name) || '')
    })),

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
))();

export default {
  meetupData,
  highChartsDefault,
  forChart: {
    ...highChartsDefault, series
  }
};
