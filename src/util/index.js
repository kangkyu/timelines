
export const isBlank = (value) => {
  return !value || (value.trim === '');
};

export const assertNotBlank = (name, value) => {
  if (isBlank(value)) throw Error(`'${name}' should not be blank`);
};
