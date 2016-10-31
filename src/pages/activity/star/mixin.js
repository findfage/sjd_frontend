import $ from 'jquery';
import api from '../../../common/api';
import messages from '../../../common/messages';
import Carousel from '../../../plugins/carousel';
import Message from '../../../components/message';
import Sharer from '../../../components/sharer';
import WaterfallFlowLoader from '../../../components/waterfall-flow-loader';
import { jsonFilter } from '../../../utilities';
import {
  showDialog,
  showLoading,
  hideLoading,
  joinIn,
  pageIn,
  toggleReminder,
  toggleSharable,
  voteIn,
} from '../../../store/actions';

const $body = $(document.body);

export default {
  template: '#star',
  components: {
    Message,
    Sharer,
    WaterfallFlowLoader,
  },
  vuex: {
    getters: {
      user: state => state.user,
      joiner: state => state.joiner,
      reminded: state => state.reminded,
      sharable: state => state.sharable,
      voter: state => state.voter,
      visitor: state => state.visitor,
    },
    actions: {
      showDialog,
      showLoading,
      hideLoading,
      joinIn,
      pageIn,
      toggleReminder,
      toggleSharable,
      voteIn,
    },
  },
  route: {
    data(transition) {
      const that = this;
      const $route = transition.to;
      const activityId = Number($route.params.id) || 0;
      const joinerId = Number($route.params.joinerId) || 0;
      const url = joinerId ? api.activityJoiner : `${api.activity}/${activityId}`;
      const data = {
        activity_id: activityId,
        joiner_id: joinerId,
      };

      that.activity = null;
      that.carousel = null;
      that.loader = null;
      that.sharer = null;
      that.showLoading();

      $.ajax(url, {
        data,

        success(response) {
          if (response.code) {
            if (response.code === 1217) {
              that.hasActivity = false;
              return;
            }

            $body.tooltip(messages[response.code], 'danger');
            return;
          }

          if (response.data) {
            const activity = response.data.activity;
            const participant = response.data.joiner;
            const statistics = response.data.statistics;
            const sharable = that.sharable;

            if (activity.type !== 2) {
              that.hasActivity = false;
              return;
            }

            if (sharable) {
              that.toggleSharable();
            }

            that.pageIn({
              title: activity.title,
              description: activity.rules,
            });

            that.loadCompletedJoiners(activityId);

            let prizes = {};

            try {
              prizes = JSON.parse(jsonFilter(activity.prizes));
            } catch (e) {
              console.log(e.message);
            }

            transition.next({
              activity: $.extend({}, activity, {
                host_img: String(activity.host_img).split(','),
                prizes,
              }),
              activityId,
              joinerId,
              joiners: [],
              loader: {
                url: `${api.activityRanking}?activity_id=${activityId}`,
                params: {
                  activity_id: activityId,
                },
              },
              participant,
              sharer: {
                autoShare: !sharable,
                autoShow: sharable,
                data: $.extend({
                  joinerId,
                }, activity),
                desc: activity.share_content,
                imgUrl: activity.share_img,
                link: window.location.href,
                title: activity.share_title,
              },
              statistics,
            });
          }
        },
        error() {
          $body.tooltip('活动加载失败', 'danger');
        },
        complete() {
          that.hideLoading();
        },
      });
    },
  },
  data() {
    return {
      activity: null,
      activityId: 0,
      hasActivity: true,
      carousel: null,
      completedJoiners: {
        total: 0,
        list: [],
      },
      joinerId: 0,
      joiners: [],
      joining: false,
      loader: null,
      newJoiner: {
        name: '',
        mobile: '',
      },
      participant: null,
      sharer: null,
      statistics: null,
      visible: false,
    };
  },
  computed: {
    my() {
      const that = this;
      const joinerId = that.joinerId;
      const activityId = that.activityId;
      let myJoinerId = 0;
      let myself = false;

      if (that.joiner) {
        that.joiner.activities.forEach((activity) => {
          if (activity.joinerId === joinerId) {
            myself = true;
          } else if (activity.id === activityId) {
            myJoinerId = activity.joinerId;
          }
        });
      }

      return {
        joinerId: myJoinerId,
        self: myself,
      };
    },
    button() {
      const that = this;
      const activity = that.activity;
      const now = Math.round(Date.now() / 1000);
      let text = '';
      let disabled = false;

      if (activity) {
        if (activity.start_time > now) {
          text = '活动未开始';
          disabled = true;
        } else if (activity.end_time < now) {
          text = '活动已结束';
          disabled = true;
        } else if (that.my.self) {
          text = '发送给朋友';
        } else {
          text = that.my.joinerId ? '返回我的' : '我要参加';
        }
      }

      return {
        text,
        disabled,
      };
    },
    remainder() {
      const that = this;

      return Math.max(0, that.activity.prizes.count - that.completedJoiners.total);
    },
  },
  beforeDestroy() {
    this.stopCarousel();
  },
  methods: {
    load(data) {
      const that = this;

      if (Array.isArray(data)) {
        data.forEach(joiner => that.joiners.push(joiner));
      }
    },
    join(e) {
      const that = this;
      const { name, mobile } = that.newJoiner;

      e.preventDefault();

      that.showLoading();

      $.ajax(api.activityJoin, {
        method: 'post',

        data: {
          activity_id: that.activityId,
          mobile,
          name,
        },

        success(response) {
          const joinerId = response.data ? Number(response.data.joiner_id) : 0;

          if (response.code) {
            if (joinerId) {
              // Already joined
              that.joined(joinerId);
            }

            $body.tooltip(messages[response.code], 'danger');
            return;
          }

          if (response.data) {
            if (joinerId) {
              that.joined(joinerId);
              that.showDialog({
                title: '报名成功',
                content: '点击“确定”进入你自己的活动页面',
                confirm() {
                  that.$router.go({
                    name: 'star-joiner',
                    params: {
                      id: that.activityId,
                      joinerId,
                    },
                  });
                },
              });
            }
          }
        },
        error() {
          $body.tooltip('报名失败', 'danger');
        },
        complete() {
          that.hideLoading();
        },
      });
    },
    joined(joinerId) {
      const that = this;
      const { name, mobile } = that.newJoiner;

      that.joining = false;

      setTimeout(() => {
        that.visible = false;
      }, 500);

      that.joinIn({
        activity: {
          id: that.activityId,
          joinerId,

          // Unix timestamp to JavaScript time
          expires: that.activity.end_time * 1000,
        },
        mobile,
        name,
      });
    },
    close(dialog) {
      const that = this;

      that[dialog] = false;

      setTimeout(() => {
        that.visible = false;
      }, 500);
    },
    loadCompletedJoiners(activityId) {
      const that = this;

      $.ajax(api.activityComplete, {
        data: {
          activity_id: activityId,
        },

        success(response) {
          if (response.data) {
            that.completedJoiners = response.data;

            that.$nextTick(() => {
              that.startCarousel();
            });
          }
        },
      });
    },
    startCarousel() {
      const that = this;

      that.stopCarousel();
      that.carousel = new Carousel(that.$els.carousel, {
        duration: 3000,
      });
    },
    stopCarousel() {
      const that = this;

      if (that.carousel) {
        that.carousel.stop();
        that.carousel = null;
      }
    },
    showSharer() {
      this.$refs.sharer.show();
    },
  },
};
