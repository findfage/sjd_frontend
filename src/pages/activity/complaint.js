import $ from 'jquery';
import api from '../../common/api';
import messages from '../../common/messages';
import Message from '../../components/message';
import { showLoading, hideLoading, pageIn } from '../../store/actions';

const $body = $(document.body);

export default {
  template: '#complaint',
  components: {
    Message,
  },
  vuex: {
    actions: {
      showLoading,
      hideLoading,
      pageIn,
    },
  },
  route: {
    data(transition) {
      const that = this;
      const activityId = Number(that.$route.params.id);

      that.showLoading();

      $.ajax(api.complaintType, {
        success(response) {
          if (response.code) {
            $body.tooltip(messages[response.code], 'danger');
            return;
          }

          if (response.data) {
            transition.next({
              activityId,
              types: response.data,
            });
          }
        },
        error() {
          $body.tooltip('加载数据失败', 'danger');
        },
        complete() {
          that.hideLoading();
        },
      });
    },
  },
  data() {
    return {
      activityId: 0,
      content: ' ',
      count: 0,
      message: null,
      step: 0,
      types: null,
      type: '',
    };
  },
  ready() {
    this.pageIn({
      title: '投诉',
    });
  },
  methods: {
    prev() {
      this.step--;
    },
    next() {
      this.step++;
    },
    input(e) {
      this.count = e.target.value.length;
    },
    complaint(e) {
      const that = this;

      e.preventDefault();

      that.showLoading();

      $.ajax(api.complaint, {
        method: 'POST',
        data: {
          activity_id: that.activityId,
          content: that.content,
          type: that.type,
        },

        success(response) {
          const next = window.decodeURIComponent(that.$route.query.next);

          that.next();

          if (response.code) {
            that.message = {
              type: 'warn',
              title: '投诉失败',
              content: messages[response.code],
              primary: {
                link: next,
                text: '返回',
              },
            };
            return;
          }

          that.message = {
            type: 'success',
            title: '投诉成功',
            content: '感谢您的参与，我们坚决反对色情、暴力、欺诈等违规信息，我们会认真处理您的投诉，维护绿色、健康的网络环境。',
            primary: {
              link: next,
            },
          };
        },
        error() {
          $body.tooltip('数据提交失败', 'danger');
        },
        complete() {
          that.hideLoading();
        },
      });
    },
  },
};
