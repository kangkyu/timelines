
// import 'isomorphic-fetch';

// import getNextLink from './next_link';
// import { proxiedURL, reqInit } from './request';
// import signedURLs from './signed_urls.json';

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

// export default (urlArg = null, apiKey = null) => {
//   let urls;
//   if (urlArg) {
//     Util.assertNotBlank('apiKey', apiKey);
//     urls = [urlArg];
//   } else {
//     urls = signedURLs.map(({ pastEvents }) => pastEvents);
//   }

//   return urls.map((url) => {
//     const groupEvents = [];

//     return fetchPastEvents(url, groupEvents, apiKey);
//   });
// };
