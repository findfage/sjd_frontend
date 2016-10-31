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
      cutted_price: 0,
    };
  },
  computed: {
    cutted() {
      const that = this;
      const activity = that.activity;

      return activity ? activity.prizes.original_price - that.participant.current_price : 0;
    },
    completed() {
      // 是否已砍到底价
      const that = this;
      const activity = that.activity;

      return activity ? activity.prizes.floor_price === that.participant.current_price : false;
    },
  },
  methods: {
    alert() {
      const that = this;

      if (that.completed) {
        that.showDialog({
          title: '提示',
          content: that.my.self ? '你已砍到底价' : 'TA已砍到底价',
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
          name: 'bargain-joiner',
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
            content: '您已经帮TA砍过价了！',
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

          if (response.data) {
            const cuttedPrice = response.data.cutted_price;

            that.cutted_price = cuttedPrice;
            that.participant.current_price -= cuttedPrice;
            that.activity.vote_count++;

            that.voteIn({
              joiner: {
                id: joinerId,
                expires: that.activity.end_time * 1000, // Unix timestamp to JavaScript time
              },
            });

            that.showHalo();
          }
        },
        complete() {
          that.hideLoading();
        },
      });
    },
    showHalo() {
      const that = this;

      that.visible = true;

      setTimeout(() => {
        that.haloing = true;
      }, 0);
    },
    hideHalo() {
      const that = this;

      that.haloing = false;

      setTimeout(() => {
        that.visible = false;
      }, 300);
    },
  },
};
