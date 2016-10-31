import $ from 'jquery';
import api from '../../common/api';
import messages from '../../common/messages';
import Countdown from '../../plugins/countdown';
import { showLoading, hideLoading, pageIn } from '../../store/actions';

const $body = $(document.body);

export default {
  template: '#reset-password',
  vuex: {
    actions: {
      showLoading,
      hideLoading,
      pageIn,
    },
  },
  data() {
    return {
      mobile: '',
      verify_code: '',
      password: '',
    };
  },
  ready() {
    this.pageIn({
      title: '找回密码',
    });
  },
  beforeDestroy() {
    const that = this;

    if (that.countdown) {
      that.countdown.destroy();
    }
  },
  methods: {
    sendCaptcha(e) {
      const that = this;
      const target = e.target;

      if (target.disabled || that.requesting) {
        return;
      }

      const $mobile = $(that.$els.mobile);
      const valid = $mobile.validator('v');

      $mobile.validator('destroy');

      if (!valid) {
        $body.tooltip($mobile.attr('title'), 'warning');
        $mobile.focus();
        return;
      }

      that.requesting = true;

      $.ajax(api.verifyCode, {
        data: {
          mobile: that.mobile,
          type: 2,
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

      $.ajax(api.resetPassword, {
        method: 'PUT',
        data: that.$data,

        success(response) {
          if (response.code) {
            $body.tooltip(messages[response.code], 'danger');
            return;
          }

          $body
            .one('hidden.tooltip', () => that.$router.go('/signin'))
            .tooltip('show', {
              content: '密码重置成功',
              style: 'success',
              duration: 1000,
            });
        },
        complete() {
          that.hideLoading();
        },
      });
    },
  },
};
