import { pageIn } from '../store/actions';

export default {
  template: '#home',
  vuex: {
    getters: {
      user: state => state.user,
      site: state => state.site,
    },
    actions: {
      pageIn,
    },
  },
  ready() {
    this.pageIn();
  },
};
