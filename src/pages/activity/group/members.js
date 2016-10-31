import $ from 'jquery';
import api from '../../../common/api';
import messages from '../../../common/messages';
import { showDialog } from '../../../store/actions';

const $body = $(document.body);

export default {
  template: '#group-members',
  vuex: {
    getters: {
      user: state => state.user,
    },
    actions: {
      showDialog,
    },
  },
  route: {
    data(transition) {
      const that = this;
      const groupId = Number(that.$route.query.groupId);

      $.get(api.groupOne, {
        group_id: groupId,
        token: that.user.token,
      }, (response) => {
        if (response.code) {
          $('body').tooltip(messages[response.code], 'danger');
          return;
        }

        try {
          response.data.joiners = JSON.parse(response.data.joiners);
        } catch (e) {
          response.data.joiners = [];
        }

        transition.next({
          group: response.data,
        });
      });
    },
  },
  data() {
    return {
      group: null,
    };
  },
  methods: {
    remove(e) {
      const that = this;
      const index = Number(e.target.dataset.index);
      const joiner = !isNaN(index) ? that.group.joiners[index] : null;
      let content;

      if (!that.group.removable) {
        that.showDialog({
          title: '提示',
          content: '无法移除，你已提现或该活动已结束！',
          confirm: true,
        });
        return;
      }

      if (joiner) {
        content = `该操作不可恢复，客户已付定金，移除后定金将原路返回，确定要移除 ${joiner.name} 吗？`;
      } else {
        content = `该操作不可恢复，移除团长将解散整个团，客户已付定金，移除后定金将原路返回，确定要移除 ${that.group.leader_name} 吗？`;
      }

      that.showDialog({
        title: '提示',
        content,
        cancel: true,
        confirm() {
          const params = [
            `token=${that.user.token}`,
            `group_id=${that.group.id}`,
            `mobile=${joiner ? joiner.mobile : that.group.leader_mobile}`,
          ];

          $.ajax(`${api.groupRemove}?${params.join('&')}`, {
            method: 'DELETE',

            success(response) {
              if (response.code) {
                $body.tooltip(messages[response.code], 'danger');
                return;
              }

              $body.tooltip('移除成功', 'success');

              if (joiner) {
                that.group.joiners.$remove(joiner);
              } else {
                // 移除团长需重新加载页面
                window.location.reload();
              }
            },
            error() {
              $body.tooltip('移除失败', 'danger');
            },
          });
        },
      });
    },
  },
};
