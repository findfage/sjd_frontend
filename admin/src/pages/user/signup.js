import api from '../../common/api';
import regexps from '../../common/regexps';
import messages from '../../common/messages';
import material from '../../mixins/material';
import Countdown from '../../plugins/countdown';
import { encode } from '../../utilities';
import { showLoading, hideLoading, pageIn } from '../../store/actions';

export default {
  template: '#signup',
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
      title: '注册',
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

      that.showLoading();

      that.$http.get(api.verifyCode, {
        params: {
          mobile: that.mobile,
          type: 1,
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

      that.$http.post(api.signUp, {
        mobile: that.mobile,
        type: 1,
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
          message: '注册成功',
        });

        that.$router.go({
          name: 'signin',
          query: {
            user: encode({
              mobile: that.mobile,
              password: that.password,
            }),
          },
        });
      }, () => {
        that.hideLoading();
        that.$root.$emit('show.snackbar', {
          message: '注册失败',
        });
      });
    },
  },
};
