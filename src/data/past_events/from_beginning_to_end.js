
import signedURLs from './signed_urls.json';
import {
  ok,
  removeUpcomingEvents,
  proxiedPath,
  buildPastEventsURL
} from './util';

import { getUserSession } from '../../containers/meetup';
import { isDevEnv } from '../../util/index';
import getNextLink from './next_link';

const fetchPastEvents = ({
  link,
  nextOrPrevPageLink,
  groupName,
  groupEvents,
  apiKey
}) => {
  const session = getUserSession();

  let url;

  if (isDevEnv()) {
    url = proxiedPath(link || buildPastEventsURL({
      groupName,
      prependQueryParams: { key: apiKey }
    }));
  } else if (nextOrPrevPageLink) {
    url = link;
  } else {
    url = buildPastEventsURL({
      groupName,
      prependQueryParams: { access_token: session.access_token }
    });
  }

  return fetch(url)
    .then(response => (ok(response) ? response : Promise.reject('...')))
    .then((response) => {
      const headers = response.headers;

      return response.json().then((json) => {
        const data = removeUpcomingEvents(json);

        groupEvents.push(...data.payload);

        const returnObj = {
          pastEvents: groupEvents
        };

        if (data.upcomingEventFound) return returnObj;

        const nextLink = getNextLink(headers);
        if (!nextLink) return returnObj;

        return fetchPastEvents({
          link: nextLink,
          groupName,
          nextOrPrevPageLink: true,
          groupEvents,
          apiKey
        });
      });
    })
    .catch(err => console.error('fetch operation problem...', err));
};

export default (urlArg = null, apiKey = null, allGroupDataFromJSON = null) => {
  let urls;
  if (urlArg) {
    urls = [{ link: null, groupName: urlArg }];
  } else {
    if (!allGroupDataFromJSON) throw Error('terrible');

    urls = signedURLs
      .map((signedURLFor) => {
        const id = signedURLFor.groupID;
        const groupDataFromJSON = allGroupDataFromJSON.find(
          group => group.main.body.id === id
        );

        if (!groupDataFromJSON) throw Error('we\'re boned');

        return {
          link: signedURLFor.pastEvents,
          groupName: groupDataFromJSON.main.body.urlname
        };
      });
  }

  return urls.map((url) => {
    const groupEvents = [];

    return fetchPastEvents({
      ...url,
      nextOrPrevPageLink: false,
      groupEvents,
      apiKey
    });
  });
};
