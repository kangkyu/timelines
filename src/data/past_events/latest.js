
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
  signedURLForPastEventsDesc,
  groupName,
  eventsByIDOfGroup,
  groupEvents
}) => {
  const session = getUserSession();

  let url;

  if (Util.isDevEnv()) {
    url = proxiedPath(signedURLForPastEventsDesc);
  } else {
    url = URLFor.events(groupName, session.access_token);
  }

  // const nodeEnv = process && process.env && process.env.NODE_ENV;

  // if (nodeEnv && nodeEnv === 'development') {
  //   request = buildRequest(group.pastEventsDesc);
  // } else {
  //   if (!session) return null;

  //   request = `https://api.meetup.com/${group.groupName}/events?&access_token=${session.access_token}&sign=true&photo-host=public&page=200&desc=true&status=past&omit=description,how_to_find_us`;
  //   // const headers = new Headers({
  //   //   Authorization: `Bearer ${session.access_token}`
  //   // });

  //   // const url = `https://api.meetup.com/${group.groupName}/events?&sign=true&photo-host=public&page=200&desc=true&status=past&omit=description,how_to_find_us`;
  //   // request = new Request(url, {
  //   //   headers,
  //   //   method: 'GET',
  //   //   mode: 'cors',
  //   //   cache: 'default'
  //   // });
  // }

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

        return fetchPastEvents(nextLink, eventsByIDOfGroup, groupEvents);
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

      const groupName = groupDataFromJSON.main.body.urlname;
      const eventsByIDOfGroup = eventsByID({
        pastEvents: groupDataFromJSON.pastEvents,
        groupID: id,
        groupName
      });

      const groupEvents = [];

      return fetchPastEvents({
        signedURLForPastEventsDesc: signedURLFor.pastEventsDesc,
        groupName,
        eventsByIDOfGroup,
        groupEvents
      });
    })
);
