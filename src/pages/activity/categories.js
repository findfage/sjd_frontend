import { pageIn } from '../../store/actions';

export default {
  template: '#categories',
  vuex: {
    actions: {
      pageIn,
    },
  },
  ready() {
    this.pageIn({
      title: '活动类型',
    });
  },
};
