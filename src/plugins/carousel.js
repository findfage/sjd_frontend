import $ from 'jquery';

const DEFAULTS = {
  autoStart: true,
  duration: 5000,
};

export default class Countdown {
  constructor(element, options) {
    const that = this;

    that.element = element;
    that.options = $.extend({}, DEFAULTS, options);
    that.slidable = false;
    that.init();
  }

  init() {
    const that = this;
    const options = that.options;
    const element = that.element;
    const item = element.firstElementChild;

    that.item = item;
    that.slidable = !!item;

    if (options.autoStart && element.children.length > 1) {
      that.start();
    }
  }

  slide() {
    const that = this;
    const element = that.element;
    const item = that.item;
    let next = item.nextElementSibling;

    if (!next) {
      next = element.firstElementChild;
    }

    item.className += ' out';
    next.className += ' in';

    that.item = next;

    setTimeout(() => {
      item.className = 'slide';

      if (that.slidable) {
        that.start();
      }
    }, 300);
  }

  start() {
    const that = this;

    setTimeout(() => that.slide(), that.options.duration);
  }

  stop() {
    this.slidable = false;
  }
}
