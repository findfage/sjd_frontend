import $ from 'jquery';
import api from '../../common/api';
import messages from '../../common/messages';
import { translateType } from '../../utilities';
import { showLoading, hideLoading, pageIn } from '../../store/actions';

const $body = $(document.body);

export default {
  template: '#statistics',
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
      const $route = transition.to;

      that.showLoading();

      $.ajax(api.activityStatistics, {
        data: {
          activity_id: $route.params.id,
          token: that.user.token,
        },

        success(response) {
          if (response.code) {
            $body.tooltip(messages[response.code], 'danger');
            return;
          }

          if (response.data) {
            const data = response.data;

            transition.next({
              category: translateType(Number($route.query.type) || 0),
              total: {
                joiners: data.total_count.sign_up_count,
                voters: data.total_count.partake_count,
              },
              list: data.list,
            });
          }
        },
        error() {
          $body.tooltip('数据加载失败', 'danger');
        },
        complete() {
          that.hideLoading();
        },
      });
    },
  },
  data() {
    return {
      category: '',
      total: {
        joiners: 0,
        voters: 0,
      },
      list: [],
    };
  },
  ready() {
    this.pageIn({
      title: '数据统计',
    });
  },
};
