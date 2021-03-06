import api from '../../common/api';
import messages from '../../common/messages';
import material from '../../mixins/material';
import Pagination from '../../components/pagination';
import { translateType } from '../../utilities';
import { showLoading, hideLoading, pageIn } from '../../store/actions';

export default {
  template: '#activities',
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

      that.$http.get(api.activity.list, {
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
          const now = Date.now() / 1000;

          activities.forEach((activity) => {
            activity.category = translateType(activity.type);
            if (!activity.status) {
              activity.state = '已删除';
            } else if (activity.start_time >= now) {
              activity.state = '未开始';
            } else if (activity.end_time <= now) {
              activity.state = '已结束';
            } else {
              activity.state = '进行中';
            }
          });

          transition.next({
            activities,
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
      title: '活动',
    });
  },
  methods: {
    remove(i) {
      const that = this;

      if (!window.confirm('确认删除？（注意：删除操作无法撤销！）')) {
        return;
      }

      const activity = that.activities[i];

      that.showLoading();

      that.$http.delete(`${api.activity.list}/${activity.id}`, {
        params: {
          token: that.user.token,
        },
      }).then((response) => {
        const data = response.json();

        that.hideLoading();

        if (data.code) {
          that.$root.$emit('show.snackbar', {
            message: messages[data.code],
          });
          return;
        }

        activity.status = 0;

        that.$root.$emit('show.snackbar', {
          message: '删除成功',
        });
      }, () => {
        that.hideLoading();
        that.$root.$emit('show.snackbar', {
          message: '删除失败',
        });
      });
    },
  },
};
