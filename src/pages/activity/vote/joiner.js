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

      if (!that.my.self) {
        that.$nextTick(() => {
          that.vote();
        });
      }
    },
  },
  data() {
    return {
      personal: true,
    };
  },
  methods: {
    click() {
      const that = this;
      const myJoinerId = that.my.joinerId;

      if (that.my.self) {
        that.showSharer();
      } else if (myJoinerId) {
        that.$router.go({
          name: 'vote-joiner',
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

      if (that.voter) {
        that.voter.joiners.forEach((joiner) => {
          if (joiner.id === joinerId) {
            voted = true;
          }
        });

        if (voted) {
          that.showDialog({
            title: '提示',
            content: '您已经投过票了！',
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

          that.participant.vote_count++;

          that.voteIn({
            joiner: {
              id: joinerId,
              expires: that.activity.end_time * 1000, // Unix timestamp to JavaScript time
            },
          });

          that.visible = true;

          setTimeout(() => {
            that.voting = true;
          }, 0);

          // setTimeout(() => {
          //   that.voting = false;

          //   setTimeout(() => {
          //     that.visible = false;
          //   }, 500);
          // }, 5000);
        },
        complete() {
          that.hideLoading();
        },
      });
    },
  },
};
