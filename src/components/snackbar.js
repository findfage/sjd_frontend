import $ from 'jquery';

const DURATION = 300;
const DEFAULTS = {
  // Type: Function
  actionHandler: null,

  // Type: String
  actionText: '',

  // Type: String
  // Options: 'default', 'primary' and 'accent'
  color: 'default',

  // Type: String
  message: '',

  // Type: Number
  timeout: 3000,
};

export default {
  template: '#snackbar',
  data() {
    return $.extend({
      timeoutId: 0,
    }, DEFAULTS);
  },
  ready() {
    const that = this;

    that.$root.$on('show.snackbar', that.show);
  },
  methods: {
    show(data) {
      const that = this;

      $.extend(that.$data, data);

      that.timeoutId = setTimeout(() => {
        that.timeoutId = 0;
        that.hide();
      }, DURATION + that.timeout);
    },
    hide() {
      const that = this;

      if (!that.message) {
        return;
      }

      that.message = '';

      setTimeout(() => {
        that.$data = $.extend({}, DEFAULTS);
      }, DURATION);
    },
    click(e) {
      const that = this;

      e.preventDefault();

      if (that.timeoutId) {
        clearTimeout(that.timeoutId);
        that.timeoutId = 0;
      }

      if (that.actionHandler) {
        that.actionHandler();
      }

      that.hide();
    },
  },
};
