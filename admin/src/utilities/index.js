import { Base64 } from 'js-base64';

export function encode(data) {
  return Base64.encode(JSON.stringify(data));
}

export function decode(data) {
  return typeof data === 'string' ? JSON.parse(Base64.decode(data)) : data;
}

const location = window.location;
const localStorage = window.localStorage;

export const LocalStorage = {
  prefixKey(name) {
    return `${location.pathname}${name}`;
  },
  setItem(name, data) {
    if (localStorage && localStorage.setItem) {
      localStorage.setItem(this.prefixKey(name), encode(data));
    }
  },
  getItem(name) {
    if (localStorage && localStorage.getItem) {
      return decode(localStorage.getItem(this.prefixKey(name)));
    }

    return null;
  },
  removeItem(name) {
    if (localStorage && localStorage.removeItem) {
      localStorage.removeItem(this.prefixKey(name));
    }
  },
};

const REGEXP_DIGITS = /"(\w+)":"(\d+)"/g;
const ignoredKeys = [
  'out_refund_no',
  'out_trade_no',
];

export function jsonFilter(data) {
  return data ? data.replace(REGEXP_DIGITS, (replacement, key, value) => {
    if (ignoredKeys.indexOf(key) === -1) {
      return `"${key}":${value}`;
    }

    return replacement;
  }) : data;
}

export function translateType(type, text) {
  if (text) {
    return ['', '超级加油', '全民摘星星', '疯狂砍价', '全民拼团', '全民唤满月', '欢度国庆'][type];
  }

  return ['', 'vote', 'star', 'bargain', 'group', 'moon', 'nation'][type];
}
