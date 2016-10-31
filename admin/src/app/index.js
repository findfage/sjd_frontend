import store from '../store';
import constants from '../common/constants';
import material from '../mixins/material';
import Snackbar from '../components/snackbar';
import { hideLoading } from '../store/actions';

export default {
  store,
  mixins: [material],
  components: {
    Snackbar,
  },
  vuex: {
    getters: {
      loading: state => state.loading,
      page: state => state.page,
      site: state => state.site,
      user: state => state.user,
    },
    actions: {
      hideLoading,
    },
  },
  data() {
    return {
      menu: [
        {
          name: '首页',
          icon: 'home',
          link: '/',
        },
        {
          name: '商家',
          icon: 'person',
          link: '/customers',
        },
        {
          name: '活动',
          icon: 'local_activity',
          link: '/activities',
        },
        {
          name: '订单',
          icon: 'shop',
          link: '/orders',
        },
        {
          name: '提现',
          icon: 'attach_money',
          link: '/withdrawals',
        },
        {
          name: '统计',
          icon: 'trending_up',
          link: '/statistics',
        },
        {
          name: '投诉',
          icon: 'report_problem',
          link: '/complaints',
        },
      ],
      copyright: `© ${(new Date()).getFullYear()} ${constants.company}`,
    };
  },
  ready() {
    const that = this;
    const user = that.user;

    that.hideLoading();
    window.addEventListener('hashchange', that.hashchange, false);

    // The "expires" value is an Unix timestamp
    if (user && user.expires && user.expires <= Date.now() / 1000) {
      that.$router.go('/signout');
    }
  },
  beforeDestory() {
    const that = this;

    window.removeEventListener('hashchange', that.hashchange, false);
    console.log(that);
  },
  methods: {
    hashchange() {
      const obfuscator = document.querySelector('.mdl-layout__obfuscator');

      if (obfuscator && obfuscator.className.indexOf('is-visible') > -1) {
        obfuscator.click();
      }
    },
  },
};
