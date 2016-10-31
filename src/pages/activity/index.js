import $ from 'jquery';
import api from '../../common/api';
import messages from '../../common/messages';
import Message from '../../components/message';
import Sharer from '../../components/sharer';
import WaterfallFlowLoader from '../../components/waterfall-flow-loader';
import { showDialog, pageIn } from '../../store/actions';
import { translateType } from '../../utilities';

const $body = $(document.body);

export default {
  template: '#activities',
  components: {
    Message,
    Sharer,
    WaterfallFlowLoader,
  },
  vuex: {
    getters: {
      user: state => state.user,
    },
    actions: {
      showDialog,
      pageIn,
    },
  },
  data() {
    return {
      activities: [],
      hasActivities: true,
      sharer: null,
    };
  },
  computed: {
    loader() {
      const that = this;
      const user = that.user;

      return {
        url: api.activity,
        params: {
          token: user ? user.token : '',
        },
      };
    },
  },
  ready() {
    this.pageIn({
      title: '个人中心',
    });
  },
  methods: {
    load(data) {
      const that = this;

      if (Array.isArray(data)) {
        data.forEach((activity) => {
          activity.category = translateType(activity.type);
          that.activities.push(activity);
        });
      } else if (that.hasActivities) {
        that.hasActivities = false;
      }
    },
    fail(message) {
      if (message === messages[1102]) {
        this.$router.go({
          name: 'signout',
        });
      }
    },
    showActionsheet(e) {
      const $actionsheet = $(e.target.getAttribute('href'));
      const $mask = $actionsheet.find('.weui_mask_transition');

      e.preventDefault();

      $mask.show().addClass('weui_fade_toggle');
      $actionsheet.find('.weui_actionsheet')
        .addClass('weui_actionsheet_toggle');
    },
    hideActionsheet(e, callback) {
      const $actionsheet = $(e.target).closest('.weui_actionsheet_container');
      const $mask = $actionsheet.find('.weui_mask_transition');

      $actionsheet.find('.weui_actionsheet').removeClass('weui_actionsheet_toggle');
      $mask.removeClass('weui_fade_toggle');

      // Waiting for transition end
      setTimeout(() => {
        $mask.hide();

        if (callback) {
          callback();
        }
      }, 300);
    },
    removeActivity(e) {
      const that = this;
      const target = e.target;
      const index = Number(target.dataset.index);
      const activity = that.activities[index];

      e.preventDefault();

      that.showDialog({
        title: '确认删除？',
        content: '注意：活动删除后不可恢复！',
        cancel: true,
        confirm() {
          $.ajax(`${api.activity}/${activity.id}?token=${that.user.token}`, {
            method: 'DELETE',

            success(response) {
              if (response.code) {
                $body.tooltip(messages[response.code], 'danger');
                return;
              }

              $body.tooltip('活动删除成功', 'success');

              that.hideActionsheet({
                target,
              }, () => {
                that.activities.splice(index, 1);
              });
            },
            error() {
              $body.tooltip('活动删除失败', 'danger');
            },
          });
        },
      });
    },
    showSharer(e) {
      const that = this;
      const target = e.target;
      const activity = that.activities[target.dataset.index];

      e.preventDefault();

      that.sharer = {
        data: $.extend({
          joinerId: 0,
        }, activity),
        desc: activity.share_content,
        imgUrl: activity.share_img,
        link: target.href,
        title: activity.share_title,
      };
    },
    hideSharer() {
      this.sharer = null;
    },
  },
};
