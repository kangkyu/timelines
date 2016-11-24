
export default (inputURL) => {
  const nodeEnv = process && process.env && process.env.NODE_ENV;
  if (nodeEnv && nodeEnv === 'development') {
    return inputURL.replace('https://api.meetup.com', '');
  }

  return inputURL;
};
