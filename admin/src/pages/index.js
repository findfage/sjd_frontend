import material from '../mixins/material';
import { showLoading, hideLoading, pageIn } from '../store/actions';

export default {
  template: '#home',
  mixins: [material],
  vuex: {
    getters: {
      user: state => state.user,
    },
    actions: {
      showLoading,
      hideLoading,
      pageIn,
    },
  },
  data() {
    return {
      cards: [
        {
          title: '商家',
          link: '/customers',
          desc: '用户数据列表',
        },
        {
          title: '活动',
          link: '/activities',
          desc: '活动数据列表',
        },
        {
          title: '订单',
          link: '/orders',
          desc: '订单数据列表',
        },
        {
          title: '提现',
          link: '/withdrawals',
          desc: '提现申请列表',
        },
        {
          title: '统计',
          link: '/statistics',
          desc: '统计数据列表',
        },
        {
          title: '投诉',
          link: '/complaints',
          desc: '投诉数据列表',
        },
      ],
    };
  },
  ready() {
    this.pageIn({
      title: '首页',
    });
  },
};
