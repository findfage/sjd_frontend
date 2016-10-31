import $ from 'jquery';
import apis from '../common/apis';
import messages from '../common/messages';
import Message from '../components/message';
import Sharer from '../components/sharer';
import WaterfallFlowLoader from '../components/waterfall-flow-loader';
import { jsonFilter } from '../utilities';
import {
  showDialog,
  showLoading,
  hideLoading,
  joinIn,
  pageIn,
  toggleReminder,
  toggleSharable,
  voteIn,
} from '../store/actions';

export default {
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

      that.activity = null;
      that.carousel = null;
      that.loader = null;
      that.sharer = null;
      that.showLoading();

      $.get(joinerId ? apis.activity.joiner : `${apis.activity.root}/${activityId}`, {
        activity_id: activityId,
        joiner_id: joinerId,
      }).then((response) => {
        that.hideLoading();

        if (response.code) {
          if (response.code === 1217) {
            that.hasActivity = false;
            return;
          }

          that.$root.$emit('show.snackbar', {
            color: 'accent',
            message: messages[response.code],
          });
          return;
        }

        if (response.data) {
          const activity = response.data.activity;
          const participant = response.data.joiner;
          const statistics = response.data.statistics;
          const sharable = that.sharable;

          if (activity.type !== that.code) {
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
              url: `${apis.activity.ranking}?activity_id=${activityId}`,
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
      });
    },
  },
  data() {
    return {
      activity: null,
      activityId: 0,
      hasActivity: true,
      carousel: null,
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

      $.post(apis.activity.join, {
        activity_id: that.activityId,
        mobile,
        name,
      }).then((response) => {
        const joinerId = response.data ? Number(response.data.joiner_id) : 0;

        that.hideLoading();

        if (response.code) {
          if (joinerId) {
            that.joined(joinerId);
          }

          that.$root.$emit('show.snackbar', {
            color: 'accent',
            message: messages[response.code],
          });
          return;
        }

        if (joinerId) {
          that.joined(joinerId);
          that.showDialog({
            title: '报名成功',
            content: '点击“确定”进入你自己的活动页面',
            confirm() {
              that.$router.go({
                name: `${that.category}-joiner`,
                params: {
                  id: that.activityId,
                  joinerId,
                },
              });
            },
          });
        }
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
    showSharer() {
      this.$refs.sharer.show();
    },
  },
};
