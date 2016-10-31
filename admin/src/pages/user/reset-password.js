import api from '../../common/api';
import regexps from '../../common/regexps';
import messages from '../../common/messages';
import material from '../../mixins/material';
import Countdown from '../../plugins/countdown';
import { showLoading, hideLoading, pageIn } from '../../store/actions';

export default {
  template: '#reset-password',
  mixins: [material],
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

      const mobile = that.$els.mobile;

      if (!regexps.mobile.test(that.mobile)) {
        that.$root.$emit('show.snackbar', {
          message: mobile.title,
        });
        mobile.focus();
        return;
      }

      that.requesting = true;

      that.$http.get(api.verifyCode, {
        params: {
          mobile: that.mobile,
          type: 2,
        },
      }).then((response) => {
        const data = response.json();

        that.hideLoading();

        if (data.code) {
          that.$root.$emit('show.snackbar', {
            message: messages[data.code],
          });
          return;
        }

        that.$root.$emit('show.snackbar', {
          message: '短信验证码发送成功',
        });

        that.countdown = new Countdown(target, {
          template: '%d秒后重新获取',
          seconds: 60,
        });
      }, () => {
        that.hideLoading();
        that.$root.$emit('show.snackbar', {
          message: '短信验证码发送失败',
        });
      });
    },
    submit(e) {
      const that = this;

      e.preventDefault();

      that.showLoading();

      that.$http.put(api.resetPassword, that.$data).then((response) => {
        const data = response.json();

        that.hideLoading();

        if (data.code) {
          that.$root.$emit('show.snackbar', {
            message: messages[data.code],
          });
          return;
        }

        that.$root.$emit('show.snackbar', {
          message: '密码重置成功',
        });

        that.$router.go('/signin');
      }, () => {
        that.hideLoading();
        that.$root.$emit('show.snackbar', {
          message: '密码重置失败',
        });
      });
    },
  },
};
