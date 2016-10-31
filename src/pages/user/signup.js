import $ from 'jquery';
import 'distpicker/dist/distpicker.data';
import 'distpicker';
import api from '../../common/api';
import messages from '../../common/messages';
import Countdown from '../../plugins/countdown';
import { encode } from '../../utilities';
import { showLoading, hideLoading, pageIn } from '../../store/actions';

const $body = $(document.body);

export default {
  template: '#signup',
  vuex: {
    getters: {
      visitor: state => state.visitor,
    },
    actions: {
      showLoading,
      hideLoading,
      pageIn,
    },
  },
  created() {
    const that = this;

    if (that.$route.query.access !== 'public') {
      that.$router.go('/');
    }
  },
  data() {
    return {
      city: '',
      industry: '',
      mobile: '',
      organization: '',
      password: '',
      province: '',
      verify_code: '',
    };
  },
  ready() {
    const that = this;

    that.pageIn({
      title: '注册',
    });

    that.$distpicker = $(that.$els.location).distpicker({
      autoSelect: false,
    });
  },
  beforeDestroy() {
    const that = this;

    if (that.countdown) {
      that.countdown.destroy();
    }

    that.$distpicker.distpicker('destroy');
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
          type: 1,
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

      $.ajax(api.signUp, {
        method: 'POST',
        data: $.extend({
          open_id: that.visitor ? that.visitor.openId : '',
        }, that.$data),

        success(response) {
          if (response.code) {
            $body.tooltip(messages[response.code], 'danger');
            return;
          }

          $body
            .one('hidden.tooltip', () => {
              that.$router.go({
                name: 'signin',
                query: {
                  user: encode({
                    mobile: that.mobile,
                    password: that.password,
                  }),
                  from: 'signup',
                },
              });
            })
            .tooltip('show', {
              content: '注册成功',
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
