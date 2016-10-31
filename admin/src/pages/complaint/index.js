import api from '../../common/api';
import messages from '../../common/messages';
import material from '../../mixins/material';
import Pagination from '../../components/pagination';
import { showLoading, hideLoading, pageIn } from '../../store/actions';

export default {
  template: '#complaints',
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

      that.$http.get(api.complaint.list, {
        params: {
          listrows,
          page,
          token: that.user.token,
        },
      }).then((response) => {
        const data = response.json();

        that.hideLoading();

        if (data.data) {
          const complaints = data.data.list;

          transition.next({
            complaints,
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
      complaints: [],
      listrows: 10,
      page: 1,
      total: 0,
    };
  },
  ready() {
    this.pageIn({
      title: '投诉',
    });
  },
  methods: {
    handle(i) {
      const that = this;

      if (!window.confirm('确认将此投诉标记为已处理？（注意：该操作无法撤销！）')) {
        return;
      }

      const complaint = that.complaints[i];

      that.showLoading();

      that.$http.put(api.complaint.handle, {
        id: complaint.id,
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

        complaint.status = 1;
        complaint.update_time = Date.now() / 1000;

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
