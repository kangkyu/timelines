
import 'isomorphic-fetch';

import getNextLink from './next_link';
// import { proxiedURL, reqInit } from './request';
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

const pastEventsQueryParams = {
  sign: true,
  'photo-host': 'public',
  page: 200,
  status: 'past',
  omit: 'description,how_to_find_us'
};

const eventsURL = (groupName, apiKey) => {
  const url = new URL('https://api.meetup.com');
  url.pathname = `${groupName}/events`;

  const query = { key: apiKey, ...pastEventsQueryParams };

  Object.keys(query).forEach(
    key => url.searchParams.append(key, query[key])
  );

  return url;
};

// const buildURL = (fullURL, apiKey) => {
//   // const proxify = proxiedURL(fullURL);
//   // if (!apiKey) return proxify;

//   const urlWithAccessToken =
// `${proxify}/events?key=${apiKey}&photo-host=public&sign=true&page=200&status=past&omit=description,how_to_find_us`;

//   return new Request(urlWithAccessToken, reqInit);
//   // return [urlWithAccessToken, requestArgs[1]];
// };

const fetchPastEvents = ({
  link,
  nextOrPrevPageLink,
  groupName,
  groupEvents,
  apiKey
}) => {
  const session = getUserSession();

  let url;

  if (Util.isDevEnv()) {
    url = proxiedPath(link || eventsURL(groupName, apiKey).toString());
  } else if (nextOrPrevPageLink) {
    url = link;
  } else {
    url = URLFor.events(groupName, session.access_token);
  }

  // if (Util.isDevEnv()) {
  //   url = proxiedPath(signedURLForPastEventsDesc);
  // } else {
  //   url = eventsURL(groupName, session.access_token);
  // }

  return fetch(url)
    .then(response => (ok(response) ? response : Promise.reject('...')))
    .then((response) => {
      const headers = response.headers;

      return response.json().then((json) => {
        const data = getData(json);

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

export default (urlArg = null, apiKey = null, isDevEnv = null, allGroupDataFromJSON = null) => {
  let urls;
  if (urlArg) {
    if (isDevEnv) Util.assertNotBlank('apiKey', apiKey);
    urls = [{ link: null, groupName: urlArg }];
  } else {
    // urls = signedURLs.map(({ pastEvents }) => pastEvents);

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

// import 'isomorphic-fetch';

// import getNextLink from './next_link';
// // import { proxiedURL, reqInit } from './request';
// import signedURLs from './signed_urls.json';

// import { getUserSession } from '../../containers/meetup';
// import * as Util from '../../util/index';

// const getData = (json) => {
//   const upcomingEventFound = json.find(ev => ev.status === 'upcoming');

//   let data;
//   if (upcomingEventFound) {
//     data = json.filter(ev => ev.status === 'past');
//   } else {
//     data = json;
//   }

//   return {
//     payload: data,
//     upcomingEventFound
//   };
// };

// const ok = (response) => {
//   if (!response.ok) {
//     const { status, statusText, url } = response;
//     console.error(
//       'Response not OK\n',
//       `Status: ${status}, text: '${statusText}', URL: ...\n`,
//       url
//     );
//     return false;
//   }
//   return response;
// };

// const buildURL = (fullURL, apiKey) => {
//   const proxify = proxiedURL(fullURL);
//   // if (!apiKey) return proxify;

//   const urlWithAccessToken = `${proxify}/events?key=${apiKey}&photo-host=public&sign=true&page=200&status=past&omit=description,how_to_find_us`;

//   return new Request(urlWithAccessToken, reqInit);
//   // return [urlWithAccessToken, requestArgs[1]];
// };

// const fetchPastEvents = (fullURL, groupEvents, apiKey) => {
//   const request = buildURL(fullURL, apiKey);

//   return fetch(request)
//     .then(response => (ok(response) ? response : Promise.reject('...')))
//     .then((response) => {
//       const headers = response.headers;

//       return response.json().then((json) => {
//         const data = getData(json);

//         groupEvents.push(...data.payload);

//         const returnObj = {
//           pastEvents: groupEvents
//         };

//         if (data.upcomingEventFound) return returnObj;

//         const nextLink = getNextLink(headers);
//         if (!nextLink) return returnObj;

//         return fetchPastEvents(nextLink, groupEvents);
//       });
//     })
//     .catch(err => console.error('fetch operation problem...', err));
// };

// export default (urlArg = null, apiKey = null, allGroupDataFromJSON = null) => {
//   let urls;
//   if (urlArg) {
//     Util.assertNotBlank('apiKey', apiKey);
//     urls = [urlArg];
//   } else {
//     // urls = signedURLs.map(({ pastEvents }) => pastEvents);

//     if (!allGroupDataFromJSON) throw Error('terrible');

//     urls = signedURLs
//       .map((signedURLFor) => {
//         const id = signedURLFor.groupID;
//         const groupDataFromJSON = allGroupDataFromJSON.find(
//           group => group.main.body.id === id
//         );

//         if (!groupDataFromJSON) throw Error('we\'re boned');

//         return {
//           signedURLForPastEventsDesc: signedURLFor.pastEventsDesc,
//           groupName: groupDataFromJSON.main.body.urlname
//         };
//       });
//   }

//   return urls.map((url) => {
//     const groupEvents = [];

//     return fetchPastEvents(url, groupEvents, apiKey);
//   });
// };
