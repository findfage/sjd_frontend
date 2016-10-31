import api from '../../common/api';
import material from '../../mixins/material';
import Pagination from '../../components/pagination';
import { showLoading, hideLoading, pageIn } from '../../store/actions';

export default {
  template: '#orders',
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

      that.$http.get(api.order.list, {
        params: {
          listrows,
          page,
          token: that.user.token,
        },
      }).then((response) => {
        const data = response.json();

        that.hideLoading();

        if (data.data) {
          const orders = data.data.list;
          const WXPayMessages = {
            'chooseWXPay:ok': '支付成功',
            'chooseWXPay:cancel': '支付取消',
            'chooseWXPay:fail': '支付失败',
          };

          orders.forEach((order) => {
            order.out_trade_no = String(order.out_trade_no);
            order.message = WXPayMessages[order.message] || order.message;

            switch (order.status) {
              case 0:
                order.status = '未付款';
                break;

              case 1:
                order.status = '已付款';
                break;

              case 2:
                order.status = '已退款';
                break;

              case 3:
                order.status = '已提现';
                break;

              default:
                order.status = '-';
            }

            switch (order.payment) {
              case 0:
                order.payment = '无';
                break;

              case 1:
                order.payment = '微信支付';
                break;

              case 2:
                order.payment = '支付宝';
                break;

              default:
                order.payment = '-';
            }
          });

          transition.next({
            orders,
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
      orders: [],
      listrows: 10,
      page: 1,
      total: 0,
    };
  },
  ready() {
    this.pageIn({
      title: '订单',
    });
  },
};
