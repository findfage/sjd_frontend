import $ from 'jquery';
import api from '../../../common/api';
import messages from '../../../common/messages';
import Countdown from '../../../plugins/countdown';
import { showDialog, showLoading, hideLoading, pageIn } from '../../../store/actions';

const $body = $(document.body);

export default {
  template: '#group-withdraw',
  vuex: {
    getters: {
      user: state => state.user,
      visitor: state => state.visitor,
    },
    actions: {
      showDialog,
      showLoading,
      hideLoading,
      pageIn,
    },
  },
  data() {
    return {
      code: '',
    };
  },
  ready() {
    const that = this;

    that.pageIn({
      title: '提现',
    });
  },
  beforeDestroy() {
    const that = this;

    if (that.countdown) {
      that.countdown.destroy();
    }
  },
  methods: {
    showRules() {
      this.showDialog({
        title: '提现规则',
        content: '（1）提现将产生10%的手续费。（2）此手续费为微信转账所产生的费用。（3）提现申请提交成功后3个工作日内可到账。',
        confirm: true,
      });
    },
    sendCaptcha(e) {
      const that = this;
      const target = e.target;

      if (target.disabled || that.requesting) {
        return;
      }

      that.requesting = true;

      $.ajax(api.groupWithdraw, {
        data: {
          id: that.$route.params.id,
          token: that.user.token,
        },

        success(response) {
          if (response.code) {
            $body.tooltip(messages[response.code], 'danger');
            return;
          }

          $body.tooltip('短信验证码发送成功', 'success');

          that.countdown = new Countdown(target, {
            template: '%d秒后重新获取',
            seconds: 60,
          });
        },
        complete() {
          that.requesting = false;
        },
      });
    },
    submit(e) {
      const that = this;

      e.preventDefault();

      that.showLoading();

      $.ajax(api.groupWithdraw, {
        method: 'POST',
        data: {
          amount: that.$route.query.amount,
          code: that.code,
          id: that.$route.params.id,
          open_id: that.visitor ? that.visitor.openId : '',
          token: that.user.token,
        },

        success(response) {
          if (response.code) {
            $body.tooltip(messages[response.code], 'danger');
            return;
          }

          that.showDialog({
            title: '提示',
            content: '提现申请已处理成功\n我们将在3个工作日内进行转账请注意查收！',
            confirm() {
              window.history.back();
            },
          });
        },
        complete() {
          that.hideLoading();
        },
      });
    },
  },
};
