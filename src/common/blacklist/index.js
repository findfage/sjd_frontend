import common from './common';
import custom from './custom';

const blacklist = common.concat(custom);
// const pattern = new RegExp(`(${blacklist.join('|')})`, 'img');

export function match(text) {
  const matched = [];

  blacklist.forEach((word) => {
    if (text.indexOf(word) > -1) {
      matched.push(word);
    }
  });

  return matched;
}

export default blacklist;
