import api from '../../common/api';
import messages from '../../common/messages';
import material from '../../mixins/material';
import Pagination from '../../components/pagination';
import { showLoading, hideLoading, pageIn } from '../../store/actions';

export default {
  template: '#withdrawals',
  mixins: [material],
  components: {
    Pagination,
  },
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
  route: {
    data(transition) {
      const that = this;
      const $route = that.$route;
      const listrows = Number($route.query.listrows) || that.listrows;
      const page = Number($route.query.page) || that.page;

      that.showLoading();

      that.$http.get(api.withdrawal.list, {
        params: {
          listrows,
          page,
          token: that.user.token,
        },
      }).then((response) => {
        const data = response.json();

        that.hideLoading();

        if (data.data) {
          const withdrawals = data.data.list;

          withdrawals.forEach((withdrawal) => {
            withdrawal.final_amount = Math.round(withdrawal.amount * (1 - that.chargeRate));
          });

          transition.next({
            withdrawals,
            listrows,
            page,
            total: data.data.total,
          });
        }
      });
    },
  },
  data() {
    return {
      chargeRate: 0.01,
      listrows: 10,
      page: 1,
      total: 0,
      withdrawals: [],
    };
  },
  ready() {
    this.pageIn({
      title: '提现',
    });
  },
  methods: {
    handle(i) {
      const that = this;

      if (!window.confirm('确认将此提现申请标记为已处理？（注意：该操作无法撤销！）')) {
        return;
      }

      const withdrawal = that.withdrawals[i];

      that.showLoading();

      that.$http.put(api.withdrawal.handle, {
        id: withdrawal.id,
        token: that.user.token,
      }).then((response) => {
        const data = response.json();

        that.hideLoading();

        if (data.code) {
          that.$root.$emit('show.snackbar', {
            message: messages[data.code],
          });
          return;
        }

        withdrawal.status = 1;
        withdrawal.update_time = Date.now() / 1000;

        that.$root.$emit('show.snackbar', {
          message: '标记成功',
        });
      }, () => {
        that.hideLoading();
        that.$root.$emit('show.snackbar', {
          message: '标记失败',
        });
      });
    },
  },
};
