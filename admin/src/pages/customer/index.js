import api from '../../common/api';
import messages from '../../common/messages';
import material from '../../mixins/material';
import Pagination from '../../components/pagination';
import { showLoading, hideLoading, pageIn } from '../../store/actions';

export default {
  template: '#customers',
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

      that.$http.get(api.customer.list, {
        params: {
          listrows,
          page,
          token: that.user.token,
        },
      }).then((response) => {
        const data = response.json();

        that.hideLoading();

        if (data.data) {
          transition.next({
            customers: data.data.list,
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
      customers: [],
      listrows: 10,
      page: 1,
      total: 0,
    };
  },
  ready() {
    this.pageIn({
      title: '商家',
    });
  },
  methods: {
    toggle(customer) {
      const that = this;
      const status = Number(customer.status);
      const action = status === 1 ? '禁用' : '解禁';

      if (!window.confirm(`确认${action}？`)) {
        return;
      }

      that.showLoading();

      that.$http.put(status === 1 ? api.customer.disable : api.customer.enable, {
        token: that.user.token,
        id: customer.id,
      }).then((response) => {
        const data = response.json();

        that.hideLoading();

        if (data.code) {
          that.$root.$emit('show.snackbar', {
            message: messages[data.code],
          });
          return;
        }

        customer.status = status ? 0 : 1;
        that.$root.$emit('show.snackbar', {
          message: `${action}成功`,
        });
      }, () => {
        that.hideLoading();
        that.$root.$emit('show.snackbar', {
          message: `${action}失败`,
        });
      });
    },
  },
};
