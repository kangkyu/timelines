
const isRelNext = (input, lookForPrev) => {
  const relParts = input.split(/\s*=\s*/);
  const shouldBeRel = relParts[0];

  if (shouldBeRel !== 'rel') return false;

  const relVal = JSON.parse(relParts[1]);
  const direction = lookForPrev ? 'prev' : 'next';

  // return relVal === 'next';
  return relVal === direction;
};

const sanitizeLink = input => input.replace(/^</, '').replace(/>$/, '');

export default (headers, lookForPrev = false) => {
  const linkHeader = headers.get('link');

  if (!linkHeader) return null;

  const nextLinkVal = linkHeader.split(/\s*,\s*/).map((xml) => {
    const parts = xml.split(/\s*;\s*/);
    const link = sanitizeLink(parts[0]);

    return { link, isNext: isRelNext(parts[1], lookForPrev) };
  }).find(rel => rel.isNext);

  if (!nextLinkVal) return null;

  return nextLinkVal.link;
};
