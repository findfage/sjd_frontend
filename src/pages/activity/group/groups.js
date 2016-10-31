import $ from 'jquery';
import api from '../../../common/api';
import messages from '../../../common/messages';
import WaterfallFlowLoader from '../../../components/waterfall-flow-loader';
import { showDialog, pageIn } from '../../../store/actions';

export default {
  template: '#group-groups',
  components: {
    WaterfallFlowLoader,
  },
  vuex: {
    getters: {
      user: state => state.user,
    },
    actions: {
      showDialog,
      pageIn,
    },
  },
  route: {
    data(transition) {
      const that = this;
      const url = api.groupJoiners;
      const params = {
        id: that.$route.params.id,
        state: that.$route.query.state,
        token: that.user.token,
      };

      that.loader = null;

      $.get(url, params, (response) => {
        if (response.code) {
          $('body').tooltip(messages[response.code], 'danger');
          return;
        }

        if (response.data) {
          transition.next({
            withdrawable: response.data.withdrawable,
            total_number: response.data.total_number || 0,
            total_amount: response.data.total_amount || 0,
            groups: [],
            loader: {
              url,
              params,
            },
          });
        }
      });
    },
  },
  data() {
    return {
      withdrawable: false,
      total_number: 0,
      total_amount: 0,
      groups: [],
      loader: null,
    };
  },
  ready() {
    this.pageIn({
      title: '报名表',
    });
  },
  methods: {
    load(data) {
      const that = this;

      if (Array.isArray(data)) {
        data.forEach((group) => {
          that.groups.push(group);
        });
      }
    },
    alert() {
      const that = this;

      if (!that.withdrawable) {
        this.showDialog({
          title: '提示',
          content: '活动结束方可提现！',
          confirm: true,
        });
      }
    },
  },
};
