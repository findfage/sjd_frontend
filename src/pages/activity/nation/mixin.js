import $ from 'jquery';
import config from './config';

export default {
  template: '#nation',
  data() {
    return $.extend({
      personal: false,
    }, config);
  },
  computed: {
    remainder() {
      const that = this;

      return Math.max(0, that.activity.prizes.count - that.completedJoiners.total);
    },
  },
};
