import $ from 'jquery';

const DEFAULTS = {
  autoStart: true,
  template: '%d',
  seconds: 0,
};

export default class Countdown {
  constructor(element, options) {
    const that = this;

    that.element = element;
    that.options = $.extend({}, DEFAULTS, options);
    that.counting = false;
    that.init();
  }

  init() {
    const that = this;
    const options = that.options;

    that.originalText = that.element.textContent;
    that.counter = options.seconds;

    if (options.autoStart) {
      that.start();
    }
  }

  start() {
    const that = this;
    const element = that.element;
    const options = that.options;

    if (that.counting) {
      return;
    }

    that.counting = true;

    element.disabled = true;
    element.textContent = options.template.replace('%d', that.counter--);
    that.next();
  }

  next() {
    const that = this;

    setTimeout(() => {
      if (that.counter > 0) {
        that.counting = false;
        that.start();
      } else {
        that.stop();
      }
    }, 1000);
  }

  stop() {
    const that = this;
    const element = that.element;

    if (!that.counting) {
      return;
    }

    that.counting = false;

    element.textContent = that.originalText;
    element.disabled = false;
  }

  destroy() {
    this.stop();
  }
}
