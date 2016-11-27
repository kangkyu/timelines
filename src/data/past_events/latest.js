
import 'isomorphic-fetch';

import getNextLink from './next_link';
import buildRequest from './request';
import signedURLs from './signed_urls.json';

import { getMeetupSession } from '../../containers/Login';

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

// const fetchPastEvents = (fullURL, eventsByIDOfGroup, groupEvents) => {
//   const request = buildRequest(fullURL);
  // const request = fullURL;

const fetchPastEvents = (group, eventsByIDOfGroup, groupEvents) => {
  const session = getMeetupSession();

  let request;

  const nodeEnv = process && process.env && process.env.NODE_ENV;

  if (nodeEnv && nodeEnv === 'development') {
    request = buildRequest(group.pastEventsDesc);
    // request = new Request(group.pastEventsDesc);
  } else {
    if (!session) return null;

    const headers = new Headers({
      Authorization: `Bearer ${session.access_token}`
    });

    const url = `https://api.meetup.com/${group.groupName}/events?&sign=true&photo-host=public&page=200&desc=true&status=past&omit=description,how_to_find_us`;
    request = new Request(url, {
      headers,
      method: 'GET',
      mode: 'cors',
      cache: 'default'
    });
  }

  // sign: true,
  // 'photo-host' => 'public',
  // page: 200,
  // status: 'past',
  // omit: 'description,how_to_find_us'

  // const reqInit = {
  //   Authorization: `Bearer ${session.access_token}`
  // };

  // const url = `https://api.meetup.com/${groupName}/events?&sign=true&photo-host=public&page=200&status=past&omit=description,how_to_find_us`;
  // const url = `https://api.meetup.com/${groupName}/events?&sign=true&photo-host=public&page=200&desc=true&status=past&omit=description,how_to_find_us`;

  // const request = buildRequest(fullURL);

  return fetch(request)
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

export default allMeetupDataFromJSON => (
  signedURLs
    .map((signedURLFor) => {
      const id = signedURLFor.groupID;
      const meetupDataFromJSON = allMeetupDataFromJSON.find(
        group => group.main.body.id === id
      );

      const eventsByIDOfGroup = eventsByID({
        pastEvents: meetupDataFromJSON.pastEvents,
        groupID: id,
        groupName: signedURLFor.groupName
      });

      const groupEvents = [];

      return fetchPastEvents(
        signedURLFor, eventsByIDOfGroup, groupEvents
      );

      // return fetchPastEvents(
      //   signedURLFor.pastEventsDesc, eventsByIDOfGroup, groupEvents
      // );
    })
);
