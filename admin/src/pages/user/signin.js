import api from '../../common/api';
import messages from '../../common/messages';
import material from '../../mixins/material';
import { decode } from '../../utilities';
import { showLoading, hideLoading, pageIn, signIn } from '../../store/actions';

export default {
  template: '#signin',
  mixins: [material],
  vuex: {
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
      let user = query.user;

      if (user) {
        user = decode(user);
        that.mobile = user.mobile;
        that.password = user.password;
        that.submit();
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

      that.$http.post(api.signIn, that.$data).then((response) => {
        const data = response.json();

        that.hideLoading();

        if (data.code) {
          that.$root.$emit('show.snackbar', {
            message: messages[data.code],
          });
          return;
        }

        that.$root.$emit('show.snackbar', {
          message: '登录成功',
        });

        if (data.data) {
          that.signIn(data.data);
        }

        let next = $route.query.next;

        if (next) {
          next = window.decodeURIComponent(next);
        }

        that.$router.go(next || '/');
      }, () => {
        that.hideLoading();
        that.$root.$emit('show.snackbar', {
          message: '登录失败',
        });
      });
    },
  },
};
