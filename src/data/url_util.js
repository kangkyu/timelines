
const baseURL = 'https://api.meetup.com';

export const proxiedPath = inputURL => inputURL.replace(baseURL, '');

const pastEventsDescQueryParams = {
  sign: true,
  'photo-host': 'public',
  page: 200,
  desc: true,
  status: 'past',
  omit: 'description,how_to_find_us'
};

const events = (groupName, accessToken) => {
  const url = new URL(baseURL);
  url.pathname = `${groupName}/events`;

  const query = { access_token: accessToken, ...pastEventsDescQueryParams };

  Object.keys(query).forEach(
    key => url.searchParams.append(key, query[key])
  );

  return url;
};

const group = () => {};

export const URLFor = {
  events, group
};
