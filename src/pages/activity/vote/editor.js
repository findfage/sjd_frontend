import $ from 'jquery';
import Picker from 'pickerjs';
import api from '../../../common/api';
import messages from '../../../common/messages';
import Uploader from '../../../components/uploader';
import { match } from '../../../common/blacklist';
import { jsonFilter } from '../../../utilities';
import {
  showDialog,
  showLoading,
  hideLoading,
  pageIn,
  toggleSharable,
} from '../../../store/actions';

const $body = $(document.body);

export default {
  template: '#vote-editor',
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
        let title = '超级加油';
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

      $.ajax(`${api.activity}/${activityId}`, {
        data: {
          token: that.user.token,
        },

        success(response) {
          if (response.code) {
            $body.tooltip(messages[response.code], 'danger');
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

            let prizes = {};

            try {
              prizes = JSON.parse(jsonFilter(activity.prizes));

              if (Array.isArray(prizes)) {
                const images = [];
                let text = '根据所得票数排名，可获得以下奖品';

                prizes.forEach((prize) => {
                  text += `\n\n${prize.name}（${prize.count}名）\n${prize.desc}`;

                  if (prize.image) {
                    images.push(prize.image);
                  }
                });

                prizes = {
                  text,
                  images,
                };
              }
            } catch (e) {
              console.log(e.message);
            }

            prizes.images.forEach((image) => {
              if (image) {
                that.prizes.uploader.images.push({
                  suffix: '640w_2o',
                  url: image,
                });
              }
            });
            const aboutImages = activity.host_img.split(',');

            aboutImages.forEach((image) => {
              if (image) {
                that.intro.uploader.images.push({
                  suffix: '640w_2o',
                  url: image,
                });
              }
            });

            activity.prizes = prizes;
            activity.host_img = aboutImages;
            that.activity = activity;
            activate(activity);
          }
        },
        error() {
          $body.tooltip('活动加载失败', 'danger');
        },
        complete() {
          that.hideLoading();
        },
      });
    },
  },
  data() {
    const that = this;
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const startDate = new Date(year, month, day);
    const endDate = new Date(year, month, day + 3);

    return {
      activated: false,
      activity: {
        id: '',
        type: 1,
        title: '快来帮我加油赢取珊瑚岛英语6节课程',
        start_time: startDate.valueOf() / 1000,
        end_time: endDate.valueOf() / 1000,
        rules: (
          '1、点击上方按钮“我要参加”进行报名。\n\n' +
          '2、报名成功后，发送给好友，好友点开一次即可增加一票。'
        ),
        prizes: {
          text: '根据所得票数排名，可获得以下奖品\n\n一等奖（1名）\n奖励XXX奖品\n\n二等奖（10名）\n奖励XXX奖品\n\n三等奖（100名）\n奖励XXX奖品',
          images: [],
        },
        receive_info: `领奖时间：\n领奖地址：\n领奖电话：${that.user.mobile}`,
        host_info: '',
        host_img: [],
      },
      intro: {
        uploaded: false,
        uploader: {
          error() {
            that.submitting = false;
            $body.tooltip('机构介绍图片上传失败', 'danger');
          },
          images: [],
          success(images) {
            that.activity.host_img = images;
            that.intro.uploaded = true;
            that.publish();
          },
        },
      },
      editable: true,
      prizes: {
        uploaded: false,
        uploader: {
          error() {
            that.submitting = false;
            $body.tooltip('奖品图片上传失败', 'danger');
          },
          images: [],
          success(images) {
            that.activity.prizes.images = images;
            that.prizes.uploaded = true;
            that.publish();
          },
        },
      },
      submitting: false,
    };
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
      const activity = that.activity;

      e.preventDefault();

      if (!activity.title) {
        that.showDialog({
          title: '提示',
          content: '请设置活动标题',
          confirm: true,
        });
        return;
      }

      if (!activity.prizes.text) {
        that.showDialog({
          title: '提示',
          content: '请设置奖项信息',
          confirm: true,
        });
        return;
      }

      if (!activity.receive_info) {
        that.showDialog({
          title: '提示',
          content: '请设置领奖信息',
          confirm: true,
        });
        return;
      }

      const blacklist = match(JSON.stringify(activity));

      if (blacklist.length) {
        that.showDialog({
          title: '提示',
          content: `发现违规词：${blacklist.join('、')}，请修改后再发布！`,
          confirm: true,
        });
        return;
      }

      if (that.submitting) {
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

      if (!that.prizes.uploaded || !that.intro.uploaded || that.publishing) {
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

          $body.one('hidden.tooltip', () => {
            that.toggleSharable();
            that.$router.go({
              name: 'vote',
              params: {
                id: activity.id || response.data.id,
              },
            });
          }).tooltip('show', {
            content: '活动发布成功',
            style: 'success',
            duration: 1000,
          });
        },

        error() {
          $body.tooltip('活动发布失败', 'danger');
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
