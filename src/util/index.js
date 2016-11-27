
export const isBlank = value => (!value || (value.trim === ''));

export const assertNotBlank = (name, value) => {
  if (isBlank(value)) throw Error(`'${name}' should not be blank`);
};

export const isDevEnv = () => (
  process && process.env && process.env.NODE_ENV && process.env.NODE_ENV === 'development'
);
