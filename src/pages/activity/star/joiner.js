import $ from 'jquery';
import api from '../../../common/api';
import messages from '../../../common/messages';
import mixin from './mixin';

const $body = $(document.body);

export default {
  mixins: [mixin],
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
    basin() {
      const that = this;
      const activity = that.activity;
      const percentage = activity ? that.participant.vote_count / activity.prizes.limit : 1;
      const index = isNaN(percentage) ? 1 : Math.floor(percentage * 5);

      return `basin-${index}`;
    },
    required() {
      const that = this;
      const activity = that.activity;

      return activity ? activity.prizes.limit - that.participant.vote_count : 0;
    },
    completed() {
      // 是否已摘满星星
      const that = this;
      const activity = that.activity;

      return activity ? activity.prizes.limit === that.participant.vote_count : false;
    },
  },
  methods: {
    alert() {
      const that = this;

      if (that.completed) {
        that.showDialog({
          title: '提示',
          content: that.my.self ? '你已完成摘星星任务，记得及时领奖' : 'TA已完成摘星星任务',
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
          name: 'star-joiner',
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
            content: '您已经帮TA摘过星了！',
            confirm: true,
          });
          return;
        }
      }

      that.showLoading();

      $.ajax(api.activityVote, {
        method: 'POST',
        data: {
          joiner_id: joinerId,
          open_id: that.visitor ? that.visitor.openId : '',
        },

        success(response) {
          if (response.code) {
            $body.tooltip(messages[response.code], 'danger');
            return;
          }

          that.voteIn({
            joiner: {
              id: joinerId,
              expires: that.activity.end_time * 1000, // Unix timestamp to JavaScript time
            },
          });

          const $smile = $(that.$els.smile);

          $smile.addClass('picked');

          setTimeout(() => {
            that.participant.vote_count++;
            $smile.removeClass('active picked');

            that.showDialog({
              title: '提示',
              content: '你已成功帮TA摘取一颗星星！',
              confirm: true,
            });

            setTimeout(() => {
              $smile.addClass('active');
            }, 2000);
          }, 1000);
        },
        complete() {
          that.hideLoading();
        },
      });
    },
  },
};
