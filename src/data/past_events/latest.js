
import 'isomorphic-fetch';

import getNextLink from './next_link';
import signedURLs from './signed_urls.json';

import { getUserSession } from '../../containers/meetup';
import * as Util from '../../util/index';
import { URLFor, proxiedPath } from '../url_util';

const getData = (json) => {
  const upcomingEventFound = json.find(ev => ev.status === 'upcoming');

  let data;
  if (upcomingEventFound) {
    data = json.filter(ev => ev.status === 'past');
  } else {
    data = json;
  }

  return {
    payload: data,
    upcomingEventFound
  };
};

const ok = (response) => {
  if (!response.ok) {
    const { status, statusText, url } = response;
    console.error(
      'Response not OK\n',
      `Status: ${status}, text: '${statusText}', URL: ...\n`,
      url
    );
    return false;
  }
  return response;
};

const fetchPastEvents = ({
  link,
  nextOrPrevPageLink,
  groupName,
  eventsByIDOfGroup,
  groupEvents
}) => {
  const session = getUserSession();

  let url;

  if (Util.isDevEnv()) {
    url = proxiedPath(link);
  } else if (nextOrPrevPageLink) {
    url = link;
  } else {
    url = URLFor.events(groupName, session.access_token);
  }

  return fetch(url)
    .then(response => (ok(response) ? response : Promise.reject(response)))
    .then((response) => {
      const headers = response.headers;

      return response.json().then((json) => {
        const data = getData(json);

        const payload = data.payload;

        let ix;
        for (ix = 0; ix < payload.length; ix += 1) {
          const ev = payload[ix];

          if (eventsByIDOfGroup.byID[ev.id]) {
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
          eventsByIDOfGroup,
          groupEvents
        });
      });
    })
    .catch(err => console.error('fetch operation problem...', err));
};

const eventsByID = ({ pastEvents, groupID, groupName }) => ({
  groupID,
  groupName,
  byID: pastEvents.reduce((acc, curr) => {
    const newAcc = acc;
    newAcc[curr.id] = curr;
    return newAcc;
  }, {})
});

export default allGroupDataFromJSON => (
  signedURLs
    .map((signedURLFor) => {
      const id = signedURLFor.groupID;
      const groupDataFromJSON = allGroupDataFromJSON.find(
        group => group.main.body.id === id
      );

      if (!groupDataFromJSON) throw Error('we\'re boned');

      const groupName = groupDataFromJSON.main.body.urlname;
      const eventsByIDOfGroup = eventsByID({
        pastEvents: groupDataFromJSON.pastEvents,
        groupID: id,
        groupName
      });

      const groupEvents = [];

      return fetchPastEvents({
        link: signedURLFor.pastEventsDesc,
        nextOrPrevPageLink: false,
        groupName,
        eventsByIDOfGroup,
        groupEvents
      });
    })
);
