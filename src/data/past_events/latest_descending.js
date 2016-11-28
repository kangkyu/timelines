
import signedURLs from './signed_urls.json';
import {
  ok, removeUpcomingEvents, proxiedPath, buildPastEventsURL
} from './util';

import { getUserSession } from '../../containers/meetup';
import { isDevEnv } from '../../util/index';
import getNextLink from './next_link';

const buildEventsByGroupIDHash = ({ pastEvents, groupID, groupName }) => ({
  groupID,
  groupName,
  byID: pastEvents.reduce((acc, curr) => {
    const newAcc = acc;
    newAcc[curr.id] = curr;
    return newAcc;
  }, {})
});

const fetchPastEvents = ({
  link,
  nextOrPrevPageLink,
  groupName,
  eventsByGroupID,
  groupEvents
}) => {
  const session = getUserSession();

  let url;

  if (isDevEnv()) {
    url = proxiedPath(link);
  } else if (nextOrPrevPageLink) {
    url = link;
  } else {
    url = buildPastEventsURL({
      groupName,
      prependQueryParams: {
        access_token: session.access_token, desc: true
      }
    });
  }

  return fetch(url)
    .then(response => (ok(response) ? response : Promise.reject(response)))
    .then((response) => {
      const headers = response.headers;

      return response.json().then((json) => {
        const data = removeUpcomingEvents(json);

        const payload = data.payload;

        let ix;
        for (ix = 0; ix < payload.length; ix += 1) {
          const ev = payload[ix];

          if (eventsByGroupID.byID[ev.id]) {
            return { pastEvents: groupEvents };
          }

          groupEvents.push(ev);
        }

        const returnObj = { pastEvents: groupEvents };

        if (data.upcomingEventFound) return returnObj;

        const nextLink = getNextLink(headers);
        if (!nextLink) return returnObj;

        return fetchPastEvents({
          link: nextLink,
          nextOrPrevPageLink: true,
          groupName,
          eventsByGroupID,
          groupEvents
        });
      });
    })
    .catch(err => console.error('fetch operation problem...', err));
};

export default allGroupDataFromJSON => (
  signedURLs
    .map((signedURLFor) => {
      const id = signedURLFor.groupID;
      const groupDataFromJSON = allGroupDataFromJSON.find(
        group => group.main.body.id === id
      );

      if (!groupDataFromJSON) throw Error('we\'re boned');

      const groupName = groupDataFromJSON.main.body.urlname;
      const eventsByGroupID = buildEventsByGroupIDHash({
        pastEvents: groupDataFromJSON.pastEvents,
        groupID: id,
        groupName
      });

      const groupEvents = [];

      return fetchPastEvents({
        link: signedURLFor.pastEventsDesc,
        nextOrPrevPageLink: false,
        groupName,
        eventsByGroupID,
        groupEvents
      });
    })
);
