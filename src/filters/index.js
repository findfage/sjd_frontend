export function formatDate(date) {
  const time = Number(date);

  if (isNaN(time)) {
    return '';
  }

  const d = new Date(time * 1000);
  const year = d.getFullYear();
  let month = 1 + d.getMonth();
  let day = d.getDate();
  let hours = d.getHours();
  let minutes = d.getMinutes();

  if (month < 10) {
    month = `0${month}`;
  }

  if (day < 10) {
    day = `0${day}`;
  }

  if (hours < 10) {
    hours = `0${hours}`;
  }

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

export function formatText(text) {
  return text ? String(text).replace(/\n/g, '<br>') : text;
}

export function asterisk(str) {
  str = String(str);

  return `${str.substr(0, 3)}****${str.substr(-4, 4)}`;
}

const REGEXP_ASSETS = /^(activity|user)\/\w+/;

export function imagify(src, params) {
  let url = src || '';

  if (REGEXP_ASSETS.test(url)) {
    url = `http://img.shangjiadao.cn/${url}@${params}`;
  }

  return url;
}

// 将价格由分转化为元
export function pricify(price) {
  price = Number(price);

  return !isNaN(price) ? price / 100 : price;
}
