import api from '../../common/api';
import material from '../../mixins/material';
import Pagination from '../../components/pagination';
import { translateType } from '../../utilities';
import { showLoading, hideLoading, pageIn } from '../../store/actions';

export default {
  template: '#statistics',
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

      that.$http.get(api.statistic.activity, {
        params: {
          listrows,
          page,
          token: that.user.token,
        },
      }).then((response) => {
        const data = response.json();

        that.hideLoading();

        if (data.data) {
          const activities = data.data.list;

          activities.forEach((activity) => {
            activity.category = translateType(activity.type, true);
            activity.type = translateType(activity.type);
          });

          transition.next({
            activities,
            stats: data.data.stats,
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
      activities: [],
      listrows: 10,
      page: 1,
      total: 0,
    };
  },
  ready() {
    this.pageIn({
      title: '统计',
    });
  },
};
