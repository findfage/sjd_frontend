import $ from 'jquery';
import { Base64 } from 'js-base64';
import md5 from 'blueimp-md5';

export function encode(data) {
  return Base64.encode(JSON.stringify(data));
}

export function decode(data) {
  return typeof data === 'string' ? JSON.parse(Base64.decode(data)) : data;
}

export function pathify(path) {
  return typeof path === 'string' ? path.replace(/\/(sjd|activity)_\w+/, '/') : path;
}

const location = window.location;
const localStorage = window.localStorage;

export const LocalStorage = {
  pathname: pathify(location.pathname),
  prefixKey(name) {
    return `${this.pathname}${name}`;
  },
  setItem(name, data) {
    if (localStorage && localStorage.setItem) {
      localStorage.setItem(this.prefixKey(name), encode(data));
    }
  },
  getItem(name) {
    if (localStorage && localStorage.getItem) {
      let data = decode(localStorage.getItem(this.prefixKey(name)));

      // XXX: Remove next lines later
      if (!data) {
        data = decode(localStorage.getItem(encode(name)));
      }

      return data;
    }

    return null;
  },
  removeItem(name) {
    if (localStorage && localStorage.removeItem) {
      localStorage.removeItem(this.prefixKey(name));

      // XXX: Remove next line later
      localStorage.removeItem(encode(name));
    }
  },
};

// const encodeURIComponent = window.encodeURIComponent;
const decodeURIComponent = window.decodeURIComponent;

export const Location = {
  query() {
    const query = location.search.replace(/^\?+/, '').split(/&+/);
    const params = {};

    query.forEach((q) => {
      const parts = q.split('=');

      if (parts[0]) {
        params[parts[0]] = parts[1] || '';
      }
    });

    return params;
  },
  encodeSearch(data, detached) {
    let search = location.search;

    if (data) {
      const params = this.decodeSearch(search);

      Object.keys(data).forEach((name) => {
        const value = data[name];
        const originalValue = params[name];

        if (originalValue) {
          if (Array.isArray(originalValue)) {
            const i = originalValue.indexOf(value);

            if (i === -1) {
              originalValue.push(value);
            } else if (detached) {
              originalValue.splice(i, 1);
            }
          } else if (detached) {
            delete params[name];
          } else {
            params[name] = value;
          }
        } else if (!detached) {
          params[name] = value;
        }
      });

      const pairs = [];

      Object.keys(params).forEach((name) => {
        const value = params[name];

        if (value) {
          if (Array.isArray(value)) {
            value.forEach((val) => {
              pairs.push(val ? `${name}=${val}` : name);
            });
          } else {
            pairs.push(`${name}=${value}`);
          }
        } else {
          pairs.push(name);
        }
      });

      search = `?${pairs.join('&')}`;
    }

    return search;
  },
  decodeSearch(search = location.search) {
    const data = {};

    if (search) {
      const pairs = search.replace('?', '').split('&');

      pairs.forEach((pair) => {
        const parts = pair.split('=');
        const name = parts[0];

        if (name) {
          let value = parts[1] || '';

          if (value) {
            value = decodeURIComponent(value);
          }

          const originalValue = data[name];

          if (originalValue) {
            if (Array.isArray(originalValue)) {
              originalValue.push(value);
            } else {
              data[name] = [originalValue, value];
            }
          } else {
            data[name] = value;
          }
        }
      });
    }

    return data;
  },
};

export function getRandomFilename(filename) {
  const file = filename.match(/^(.*)(\.[A-z]+)$/);

  return md5(String(Date.now() + Math.random()) + file[1]) + file[2];
}

const REGEXP_DIGITS = /:"(\d+\.?\d*)"/g;

export function jsonFilter(data) {
  return typeof data === 'string' ? data.replace(REGEXP_DIGITS, ':$1') : data;
}

export function translateType(type) {
  return ['', 'vote', 'star', 'bargain', 'group', 'moon', 'nation'][type];
}

const REGEXP_NUMBER = /^\d+\.?\d*$/;
const REGEXP_PRICE = /price/i;

/*
 * 转化对象或数组中的价格
 *
 * @param data {Object|Array|Number}
 * @param options {Object}
 * @return data {Object|Array|Number}
 */
export function priceFilter(data, options = {}) {
  const reversed = options.reversed;
  const pattern = options.pattern || REGEXP_PRICE;
  const translate = (n) => {
    return reversed ? Math.round(n * 100) : n / 100;
  };

  if ($.isPlainObject(data) || Array.isArray(data)) {
    $.each(data, (name, value) => {
      if (REGEXP_NUMBER.test(value)) {
        if (pattern.test(name)) {
          data[name] = translate(value);
        }
      } else if ($.isPlainObject(value) || Array.isArray(value)) {
        data[name] = priceFilter(value, options);
      }
    });
  } else if (REGEXP_NUMBER.test(data)) {
    data = translate(data);
  }

  return data;
}
