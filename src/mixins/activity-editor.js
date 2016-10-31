import $ from 'jquery';
import Picker from 'pickerjs';
import api from '../common/api';
import messages from '../common/messages';
import Uploader from '../components/uploader';
import { jsonFilter } from '../utilities';
import {
  showDialog,
  showLoading,
  hideLoading,
  pageIn,
  toggleSharable,
} from '../store/actions';

export default {
  components: {
    Uploader,
  },
  vuex: {
    getters: {
      user: state => state.user,
    },
    actions: {
      showDialog,
      showLoading,
      hideLoading,
      pageIn,
      toggleSharable,
    },
  },
  route: {
    data(transition) {
      const that = this;
      const $route = that.$route;
      const activityId = Number($route.params.id) || 0;

      function activate(activity) {
        let title = that.name;
        let action = '制作';

        if (activity) {
          title = activity.title;
          action = that.$route.query.action === 'clone' ? '复制' : '编辑';
        }

        that.pageIn({
          title: `【${action}】${title}`,
        });

        that.$nextTick(() => {
          that.initPicker();
        });

        transition.next({
          activated: true,
        });
      }

      if (!activityId) {
        activate();
        return;
      }

      that.showLoading();

      $.get(`${api.activity}/${activityId}`, {
        token: that.user.token,
      }).then((response) => {
        that.hideLoading();

        if (response.code) {
          that.$root.$emit('show.snackbar', {
            color: 'accent',
            message: messages[response.code],
          });
          return;
        }

        if (response.data) {
          const activity = response.data.activity;

          if (activity.user_id !== that.user.id) {
            transition.abort();
          }

          if ($route.query.action === 'clone') {
            activity.id = '';
          }

          const images = activity.host_img.split(',');
          let prizes = {};

          try {
            prizes = JSON.parse(jsonFilter(activity.prizes));
          } catch (e) {
            console.log(e.message);
          }

          if (prizes.image) {
            that.prize.uploader.images.push({
              suffix: '640w_2o',
              url: prizes.image,
            });
          }

          images.forEach((image) => {
            if (image) {
              that.intro.uploader.images.push({
                suffix: '640w_2o',
                url: image,
              });
            }
          });

          activity.prizes = prizes;
          activity.host_img = images;
          that.activity = activity;
          that.statistics = response.data.statistics;
          activate(activity);
        }
      });
    },
  },
  data() {
    const that = this;

    return {
      activated: false,
      editable: true,
      intro: {
        uploaded: false,
        uploader: {
          error() {
            that.submitting = false;
            $('body').tooltip('机构介绍图片上传失败', 'danger');
          },
          images: [],
          success(images) {
            that.activity.host_img = images;
            that.intro.uploaded = true;
            that.publish();
          },
        },
      },
      prize: {
        uploaded: false,
        uploader: {
          error() {
            that.submitting = false;
            $('body').tooltip('奖品图片上传失败', 'danger');
          },
          images: [],
          success(images) {
            that.activity.prizes.image = images[0] || '';
            that.prize.uploaded = true;
            that.publish();
          },
        },
      },
      statistics: null,
      submitting: false,
    };
  },
  computed: {
    locked() {
      const that = this;
      const statistics = that.statistics;

      return that.activity.id > 0 && statistics && statistics.join_count;
    },
  },
  ready() {
    const that = this;

    if (that.$route.query.action === 'clone') {
      that.showDialog({
        title: '提示',
        content: '此活动为复制的活动，请适当编辑，然后发布。',
        confirm: true,
      });
    }
  },
  beforeDestroy() {
    const that = this;

    if (that.startDatePicker) {
      that.startDatePicker.destroy();
    }

    if (that.endDatePicker) {
      that.endDatePicker.destroy();
    }
  },
  methods: {
    initPicker() {
      const that = this;
      const $form = $(that.$el);
      const $startDate = $form.find('.start-date');
      const $endDate = $form.find('.end-date');
      const options = {
        format: 'YYYY-MM-DD HH:mm',
        increment: {
          minute: 10,
        },
        text: {
          // title: '请选择日期/时间',
          cancel: '取消',
          confirm: '确认',
        },
        translate(type, text) {
          const suffixes = {
            year: '年',
            month: '月',
            day: '日',
            hour: '点',
            minute: '分',
          };

          return Number(text) + suffixes[type];
        },
      };
      const startDateOptions = $.extend(true, {}, options, {
        text: {
          title: '请选择活动开始时间',
        },
      });
      const endDateOptions = $.extend(true, {}, options, {
        text: {
          title: '请选择活动结束时间',
        },
      });
      const startDatePicker = new Picker($startDate[0], startDateOptions);
      const endDatePicker = new Picker($endDate[0], endDateOptions);

      that.startDatePicker = startDatePicker;
      that.endDatePicker = endDatePicker;

      $startDate.on('change', () => {
        const date = startDatePicker.getDate();

        that.activity.start_time = Math.round(date.getTime() / 1000);

        if (that.activity.end_time <= that.activity.start_time) {
          date.setDate(date.getDate() + 1);
          that.activity.end_time = Math.round(date.getTime() / 1000);
          that.$nextTick(() => endDatePicker.update());
        }
      });

      $endDate.on('change', (e) => {
        const endTime = Math.round(endDatePicker.getDate().getTime() / 1000);

        if (endTime <= that.activity.start_time) {
          e.preventDefault();
          return;
        }

        that.activity.end_time = endTime;
      });
    },
    toggle() {
      const that = this;

      that.editable = !that.editable;
      document.body.scrollTop = 0;
    },
    submit(e) {
      const that = this;

      e.preventDefault();

      if (!that.isValid() || that.submitting) {
        return;
      }

      that.submitting = true;

      $.get(api.uploadSignature, {
        token: that.user.token,
        type: 2, // 1: 用户相关, 2: 活动相关
      }, (response) => {
        if (response.data) {
          that.$root.$emit('upload.uploader', response.data);
        }
      });
    },
    publish() {
      const that = this;

      if (!that.prize.uploaded || !that.intro.uploaded || that.publishing) {
        return;
      }

      that.publishing = true;
      that.showLoading();

      const activity = $.extend(true, {}, that.activity);

      $.ajax(api.activity, {
        method: activity.id ? 'put' : 'post',
        data: $.extend(activity, {
          host_img: activity.host_img.join(),
          prizes: JSON.stringify(activity.prizes),
          token: that.user.token,
        }),

        success(response) {
          if (response.code) {
            that.showDialog({
              title: '提示',
              content: messages[response.code],
              confirm: true,
            });
            return;
          }

          that.$root.$emit('show.snackbar', {
            message: '活动发布成功',
          });
          that.toggleSharable();
          that.$router.go({
            name: that.category,
            params: {
              id: activity.id || response.data.id,
            },
          });
        },

        error() {
          that.$root.$emit('show.snackbar', {
            color: 'accent',
            message: '活动发布失败',
          });
        },
        complete() {
          that.submitting = false;
          that.publishing = false;
          that.hideLoading();
        },
      });
    },
  },
};
