import $ from 'jquery';
import apis from '../../../common/apis';
import messages from '../../../common/messages';
import activityMixin from '../../../mixins/activity';
import activityCarousel from '../../../mixins/activity-carousel';
import mixin from './mixin';

export default {
  mixins: [activityMixin, activityCarousel, mixin],
  route: {
    data() {
      const that = this;

      that.$nextTick(() => {
        that.alert();
      });
    },
  },
  data() {
    return {
      personal: true,
    };
  },
  computed: {
    moon() {
      const that = this;
      const activity = that.activity;
      const percentage = activity ? that.participant.vote_count / activity.prizes.limit : 1;
      const index = Math.max(1, isNaN(percentage) ? 1 : Math.floor(percentage * 8));

      return `moon-${index}`;
    },
    required() {
      const that = this;
      const activity = that.activity;

      return activity ? Math.max(0, activity.prizes.limit - that.participant.vote_count) : 0;
    },
    completed() {
      return !this.required;
    },
  },
  methods: {
    alert() {
      const that = this;

      if (that.completed) {
        that.showDialog({
          title: '提示',
          content: that.my.self ? '你已完成集月牙任务，记得及时领奖' : 'TA已完成集月牙任务',
          confirm: true,
        });
      }
    },
    click() {
      const that = this;
      const myJoinerId = that.my.joinerId;

      if (that.my.self) {
        if (that.completed) {
          that.alert();
        } else {
          that.showSharer();
        }
      } else if (myJoinerId) {
        that.$router.go({
          name: 'moon-joiner',
          params: {
            id: that.activityId,
            joinerId: myJoinerId,
          },
        });
      } else {
        that.visible = true;

        setTimeout(() => {
          that.joining = true;
        }, 0);
      }
    },
    vote() {
      const that = this;
      const joinerId = that.joinerId;
      const others = that.my.self ? '' : '帮TA';
      let voted = false;

      if (that.completed) {
        that.alert();
        return;
      }

      if (that.voter) {
        that.voter.joiners.forEach((joiner) => {
          if (joiner.id === joinerId) {
            voted = true;
          }
        });

        if (voted) {
          that.showDialog({
            title: '提示',
            content: `你已经${others}集过月牙了！`,
            confirm: true,
          });
          return;
        }
      }

      that.showLoading();

      $.post(apis.activity.vote, {
        joiner_id: joinerId,
        open_id: that.visitor ? that.visitor.openId : `wx${Date.now()}`,
      }).then((response) => {
        that.hideLoading();

        if (response.code) {
          $('body').tooltip(messages[response.code], 'danger');
          return;
        }

        that.voteIn({
          joiner: {
            id: joinerId,
            expires: that.activity.end_time * 1000, // Unix timestamp to JavaScript time
          },
        });

        that.active = true;

        setTimeout(() => {
          that.participant.vote_count++;
          that.active = false;
          that.merged = true;

          setTimeout(() => {
            that.merged = false;
            that.showDialog({
              title: '提示',
              content: `你已成功${others}增加一个月牙！`,
              confirm: true,
            });
          }, 2000);
        }, 1000);
      });
    },
  },
};

