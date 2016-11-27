
export const proxiedURL = (inputURL) => {
  const nodeEnv = process && process.env && process.env.NODE_ENV;
  if (nodeEnv && nodeEnv === 'development') {
    return inputURL.replace('https://api.meetup.com', '');
  }

  return inputURL;
};

export const reqInit = {
  method: 'GET',
  headers: new Headers({
    'Content-Type': 'application/json'
  }),
  // mode: 'cors',
  cache: 'default',
  // credentials: 'include'
};

export default (inputURL) => {
  // const init = { method: 'GET',
  //                headers: new Headers(),
  //                mode: 'no-cors',
  //                cache: 'default' };

  // const mode = { mode: 'no-cors' };

  // const nodeEnv = process && process.env && process.env.NODE_ENV;
  // if (nodeEnv && nodeEnv === 'development') {
  //   return [
  //     inputURL.replace('https://api.meetup.com', ''),
  //     mode
  //   ];
  // }

  // const finalURL = inputURL;
  const finalURL = proxiedURL(inputURL);

  return new Request(finalURL, reqInit);
};

// export default (inputURL) => {
//   const mode = { mode: 'no-cors' };

//   // const nodeEnv = process && process.env && process.env.NODE_ENV;
//   // if (nodeEnv && nodeEnv === 'development') {
//   //   return [
//   //     inputURL.replace('https://api.meetup.com', ''),
//   //     mode
//   //   ];
//   // }

//   return [inputURL, mode];
// };
