
const baseURL = 'https://api.meetup.com';

export const proxiedPath = inputURL => inputURL.replace(baseURL, '');

export const pastEventsQueryParams = {
  sign: true,
  'photo-host': 'public',
  page: 200,
  status: 'past',
  omit: 'description,how_to_find_us'
};

export const buildPastEventsURL = ({ groupName, prependQueryParams }) => {
  const url = new URL(baseURL);
  url.pathname = `${groupName}/events`;

  const queryParams = { ...prependQueryParams, ...pastEventsQueryParams };

  Object.keys(queryParams).forEach(
    key => url.searchParams.append(key, queryParams[key])
  );

  return url.toString();
};

export const ok = (response) => {
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

export const removeUpcomingEvents = (json) => {
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
