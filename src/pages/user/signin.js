import $ from 'jquery';
import { decode } from '../../utilities';
import api from '../../common/api';
import messages from '../../common/messages';
import { showLoading, hideLoading, pageIn, signIn } from '../../store/actions';

const $body = $(document.body);

export default {
  template: '#signin',
  vuex: {
    getters: {
      visitor: state => state.visitor,
    },
    actions: {
      showLoading,
      hideLoading,
      pageIn,
      signIn,
    },
  },
  route: {
    activate() {
      const that = this;
      const query = that.$route.query;
      const from = query.from;
      let user = query.user;

      if (user) {
        user = decode(user);

        if (from === 'signup') {
          that.mobile = user.mobile;
          that.password = user.password;
          that.submit();
        }
      }
    },
  },
  data() {
    return {
      mobile: '',
      password: '',
    };
  },
  ready() {
    this.pageIn({
      title: '登录',
    });
  },
  methods: {
    submit(e) {
      const that = this;
      const $route = that.$route;

      if (e) {
        e.preventDefault();
      }

      that.showLoading();

      $.ajax(api.signIn, {
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
              let next = $route.query.next;

              if (next) {
                next = window.decodeURIComponent(next);

                if (/\/categories/.test(next)) {
                  next = '';
                }
              }

              that.$router.go(next || {
                name: 'activities',
              });
            })
            .tooltip('show', {
              content: '登录成功',
              style: 'success',
              duration: 1000,
            });

          if (response.data) {
            that.signIn(response.data);
          }
        },
        complete() {
          that.hideLoading();
        },
      });
    },
  },
};
