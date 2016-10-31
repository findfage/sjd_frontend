import $ from 'jquery';
import api from '../../common/api';
import messages from '../../common/messages';
import Searchbar from '../../components/searchbar';
import WaterfallFlowLoader from '../../components/waterfall-flow-loader';
import { translateType } from '../../utilities';
import { showDialog, showLoading, hideLoading, pageIn } from '../../store/actions';

export default {
  template: '#joiners',
  components: {
    Searchbar,
    WaterfallFlowLoader,
  },
  vuex: {
    getters: {
      user: state => state.user,
    },
    actions: {
      showDialog,
      showLoading,
      hideLoading,
      pageIn,
    },
  },
  route: {
    data(transition) {
      const that = this;
      const $route = that.$route;

      transition.next({
        category: translateType(Number($route.query.type) || 0),
      });
    },
  },
  data() {
    return {
      joiners: [],
      keyword: '',
      // sharing: false,
      category: '',
    };
  },
  computed: {
    loader() {
      const that = this;
      const $route = that.$route;
      const params = {
        activity_id: $route.params.id,
        token: that.user.token,
      };
      let url = api.activityJoiners;

      that.joiners = [];

      if (that.keyword) {
        params.keyword = that.keyword;
        url = api.activitySearch;
      }

      return {
        params,
        url,
      };
    },
    categoryText() {
      switch (this.category) {
        case 'star':
          return '星星数';

        case 'bargain':
          return '当前价格';

        case 'moon':
          return '月牙数';

        case 'nation':
          return '召集数';

        default:
          return '票数';
      }
    },
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
        data.forEach(joiner => that.joiners.push(joiner));
      }
    },
    search(keyword) {
      this.keyword = keyword;
    },
    exchange(e) {
      const that = this;
      const joiner = that.joiners[Number(e.target.dataset.index)];
      const exchanged = joiner.is_exchanged;

      this.showDialog({
        title: exchanged ? '确认撤销？' : '确认兑奖？',
        cancel: true,
        confirm() {
          that.showLoading();

          $.ajax(api.activityExchange, {
            method: 'POST',

            data: {
              joiner_id: joiner.id,
              token: that.user.token,
            },

            success(response) {
              if (response.code) {
                that.$root.$emit('show.snackbar', {
                  color: 'accent',
                  message: messages[response.code],
                });
                return;
              }

              that.$root.$emit('show.snackbar', {
                message: exchanged ? '撤销成功' : '兑奖成功',
              });

              joiner.is_exchanged = !exchanged;
            },
            complete() {
              that.hideLoading();
            },
          });
        },
      });
    },
  },
};
