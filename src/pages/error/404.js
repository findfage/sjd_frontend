import Message from '../../components/message';
import { pageIn } from '../../store/actions';

export default {
  template: '#page-not-found',
  components: {
    Message,
  },
  vuex: {
    actions: {
      pageIn,
    },
  },
  ready() {
    this.pageIn({
      title: '404 - 页面没找到',
    });
  },
};
