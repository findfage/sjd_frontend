import $ from 'jquery';
import md5 from 'blueimp-md5';
import 'countdown';
import api from '../../../common/api';
import constants from '../../../common/constants';
import messages from '../../../common/messages';
import Message from '../../../components/message';
import Sharer from '../../../components/sharer';
import WaterfallFlowLoader from '../../../components/waterfall-flow-loader';
import { jsonFilter, LocalStorage } from '../../../utilities';
import {
  showDialog,
  showLoading,
  hideLoading,
  joinIn,
  joinOut,
  pageIn,
  toggleReminder,
  toggleSharable,
  voteIn,
} from '../../../store/actions';

const $body = $(document.body);

export default {
  template: '#group',
  components: {
    Message,
    Sharer,
    WaterfallFlowLoader,
  },
  vuex: {
    getters: {
      user: state => state.user,
      joiner: state => state.joiner,
      reminded: state => state.reminded,
      sharable: state => state.sharable,
      voter: state => state.voter,
      visitor: state => state.visitor,
    },
    actions: {
      showDialog,
      showLoading,
      hideLoading,
      joinIn,
      joinOut,
      pageIn,
      toggleReminder,
      toggleSharable,
      voteIn,
    },
  },
  route: {
    data(transition) {
      const that = this;
      const $route = transition.to;
      const activityId = Number($route.params.id) || 0;
      const joinerId = Number($route.params.joinerId) || 0;
      const url = joinerId ? api.groupMy : `${api.group}/${activityId}`;
      const data = {
        activity_id: activityId,
        group_id: joinerId,
      };

      that.activity = null;
      that.loader = null;
      that.sharer = null;
      that.showLoading();

      $.ajax(url, {
        data,

        success(response) {
          if (response.code) {
            if (response.code === 1217) {
              that.hasActivity = false;
              return;
            }

            $body.tooltip(messages[response.code], 'danger');

            // 如果团已删除，则删除缓存
            if (response.code === 1504) {
              that.joinOut(joinerId);
              transition.abort();
            }

            return;
          }

          if (response.data) {
            const activity = response.data.activity || response.data;
            const myGroup = response.data.my_group;
            const statistics = response.data.statistics;
            const sharable = that.sharable;

            if (activity.type !== 4) {
              that.hasActivity = false;
              return;
            }

            if (sharable) {
              that.toggleSharable();
            }

            that.pageIn({
              title: activity.title,
              description: activity.rules,
            });

            let prizes = {};

            try {
              prizes = JSON.parse(jsonFilter(activity.prizes));
            } catch (e) {
              console.log(e.message);
            }

            if (myGroup) {
              try {
                myGroup.joiners = JSON.parse(myGroup.joiners);
              } catch (e) {
                myGroup.joiners = [];
              }
            }

            that.$nextTick(() => {
              that.startCountdown();
            });

            transition.next({
              activity: $.extend({}, activity, {
                host_img: String(activity.host_img).split(','),
                prizes,
              }),
              activityId,
              groups: response.data.groups,
              joinerId,
              joiners: [],
              loader: {
                url: `${api.activityRanking}?activity_id=${activityId}`,
                params: {
                  activity_id: activityId,
                },
              },
              myGroup,
              sharer: {
                autoShare: !sharable,
                autoShow: sharable,
                data: $.extend({
                  joinerId,
                }, activity),
                desc: activity.share_content,
                imgUrl: activity.share_img,
                link: window.location.href,
                title: activity.share_title,
              },
              statistics,
            });
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
    return {
      activity: null,
      activityId: 0,
      completedJoiners: {
        total: 0,
        list: [],
      },
      groups: [],
      hasActivity: true,
      joinerId: 0,
      joiners: [],
      joining: false,
      loader: null,
      myGroup: null,
      newJoiner: {
        name: '',
        mobile: '',
      },
      opening: true,
      sharer: null,
      statistics: null,
      visible: false,
    };
  },
  computed: {
    my() {
      const that = this;
      const joinerId = that.joinerId;
      const activityId = that.activityId;
      let myJoinerId = 0;
      let myself = false;

      if (that.joiner) {
        that.joiner.activities.forEach((activity) => {
          if (activity.joinerId === joinerId) {
            myself = true;
            myJoinerId = joinerId;
          } else if (activity.id === activityId) {
            myJoinerId = activity.joinerId;
          }
        });
      }

      return {
        joinerId: myJoinerId,
        self: myself,
      };
    },
    button() {
      const that = this;
      const activity = that.activity;
      const now = Math.round(Date.now() / 1000);
      let disabled = false;
      let text = '';

      if (activity) {
        if (activity.start_time > now) {
          text = '活动未开始';
          disabled = true;
        } else if (activity.end_time < now) {
          text = '活动已结束';
          disabled = true;
        } else if (that.my.self) {
          text = '发送给朋友';
        } else if (that.my.joinerId) {
          text = '返回我的';
        } else if (that.personal) {
          text = '单独开团';
        } else {
          text = '我要开团';
        }
      }

      return {
        disabled,
        text,
      };
    },
    footerButton() {
      const that = this;
      const activity = that.activity;
      const now = Math.round(Date.now() / 1000);
      let disabled = false;
      let text = '';


      if (activity) {
        if (activity.start_time > now) {
          text = '活动未开始';
          disabled = true;
        } else if (activity.end_time < now) {
          text = '活动已结束';
          disabled = true;
        } else if (that.my.self) {
          text = '发送给朋友';
        } else if (that.my.joinerId) {
          text = '返回我的';
        } else if (that.completed) {
          text = '我要开团';
        } else {
          text = '参加此团';
        }
      }

      return {
        disabled,
        open,
        text,
      };
    },
    countdown() {
      const that = this;
      const activity = that.activity;
      const now = Date.now();
      const start = activity.start_time * 1000;
      const end = activity.end_time * 1000;
      const started = start <= now;

      return {
        time: started ? end : start,
        text: started ? '结束' : '开始',
      };
    },
  },
  ready() {
    this.checkOrder(true); // 初始化后立即检测订单更新状态
  },
  beforeDestroy() {
    this.stopCountdown();
  },
  methods: {
    load(data) {
      const that = this;

      if (Array.isArray(data)) {
        data.forEach(joiner => that.joiners.push(joiner));
      }
    },
    join(e) {
      const that = this;
      const { name, mobile } = that.newJoiner;

      e.preventDefault();

      that.showLoading();

      $.ajax(api.groupOrder, {
        method: 'POST',

        data: {
          amount: that.activity.prizes.prepaid,
          id: that.activityId,
          group_id: that.personal && !that.completed && !that.opening ? that.joinerId : 0,
          mobile,
          name,
          open_id: that.visitor ? that.visitor.openId : '',
        },

        success(response) {
          const joinerId = response.data ? Number(response.data.group_id) : 0;

          if (response.code) {
            if (joinerId) {
              // Already joined
              that.joined(joinerId);
            }

            $body.tooltip(messages[response.code], 'danger');
            return;
          }

          if (response.data) {
            that.pay(response.data);
          }
        },
        error() {
          $body.tooltip('报名失败', 'danger');
        },
        complete() {
          that.hideLoading();
        },
      });
    },
    joined(joinerId) {
      const that = this;
      const { name, mobile } = that.newJoiner;

      if (!joinerId) {
        return;
      }

      that.joining = false;

      setTimeout(() => {
        that.visible = false;
      }, 500);

      that.joinIn({
        activity: {
          id: that.activityId,
          joinerId,

          // Unix timestamp to JavaScript time
          expires: that.activity.end_time * 1000,
        },
        mobile,
        name,
      });
    },
    pay(params) {
      const that = this;
      const jWeixin = window.jWeixin;

      if (jWeixin) {
        const apiParameters = JSON.parse(params.api_parameters);
        const { name, mobile } = that.newJoiner;
        const data = {
          count: 0, // 当前同步次数
          limit: 1, // 最大同步次数
          duration: 1000, // 延迟同步时间（单位：毫秒）
          id: params.order_id,
          message: '',
          mobile,
          name,
          status: 0, // 支付状态（0:未支付,1:已支付）
        };

        jWeixin.chooseWXPay({
          // 注意此处的timestamp须全部为小写
          timestamp: apiParameters.timeStamp,
          nonceStr: apiParameters.nonceStr,
          package: apiParameters.package,
          signType: apiParameters.signType,
          paySign: apiParameters.paySign,
          success(response) {
            if (response.errMsg === 'chooseWXPay:ok') {
              data.limit = 10; // 增加同步次数，保证数据入库
              data.status = 1;
            }

            data.message = response.errMsg;
            that.updateOrder(data);
          },
          cancel(response) {
            data.message = response.errMsg;
            that.updateOrder(data);
          },
          fail(response) {
            data.message = response.errMsg;
            that.updateOrder(data);
            that.showDialog({
              title: '提示',
              content: '网络通信出现问题，无法弹出微信支付界面，请换个网络或稍微再试。',
              confirm: true,
            });
          },
        });
      }

      // const WeixinJSBridge = window.WeixinJSBridge;

      // function ready() {
      //   const apiParameters = JSON.parse(params.api_parameters);

      //   WeixinJSBridge.invoke('getBrandWCPayRequest', apiParameters, (response) => {
      //     if (response.err_msg === 'get_brand_wcpay_request:ok') {
      //       that.paid(params);
      //     }
      //   });
      // }

      // if (typeof WeixinJSBridge === 'undefined') {
      //   if (document.addEventListener) {
      //     document.addEventListener('WeixinJSBridgeReady', ready, false);
      //   } else if (document.attachEvent) {
      //     document.attachEvent('WeixinJSBridgeReady', ready);
      //     document.attachEvent('onWeixinJSBridgeReady', ready);
      //   }
      // } else {
      //   ready();
      // }
    },
    updateOrder(order) {
      const that = this;

      if (!order) {
        return;
      }

      // if (that.joining) {
      //   that.close('joining');
      // }

      order.count++;
      LocalStorage.setItem('order', order);

      $.post(api.groupPay, {
        message: order.message,
        status: order.status,
        order_id: order.id,
        token: md5(`${order.mobile}${constants.token}`),
      }).then((response) => {
        if (response.code) {
          // $body.tooltip(messages[response.code], 'danger');
          that.checkOrder();
          return;
        }

        LocalStorage.removeItem('order');

        if (response.data) {
          const joinerId = Number(response.data.group_id);

          // 只有获取到joinerId才能确认报名成功
          if (joinerId) {
            that.joined(joinerId);
            that.showDialog({
              title: '预付成功',
              content: '点击“确定”进入你自己的拼团页面',
              confirm() {
                if (joinerId === that.joinerId) {
                  // 参团成功，重新加载以更新数据
                  window.location.reload();
                } else {
                  that.$router.go({
                    name: 'group-joiner',
                    params: {
                      id: that.activityId,
                      joinerId,
                    },
                  });
                }
              },
            });
          }
        }
      }, () => {
        that.checkOrder();
      });
    },
    checkOrder(immediate) {
      const that = this;
      const order = LocalStorage.getItem('order');

      if ($.isPlainObject(order)) {
        if (order.count < order.limit) {
          if (immediate) {
            that.updateOrder(order);
            return;
          }

          setTimeout(() => {
            that.updateOrder(order);
          }, order.count * order.duration);
        } else {
          LocalStorage.removeItem('order');
        }
      }
    },
    close(dialog) {
      const that = this;

      that[dialog] = false;

      setTimeout(() => {
        that.visible = false;
      }, 500);
    },
    startCountdown() {
      const that = this;

      that.stopCountdown();
      that.$countdown = $(that.$els.countdown).countdown();
    },
    stopCountdown() {
      const that = this;

      if (that.$countdown) {
        that.$countdown.countdown('destroy');
        that.$countdown = null;
      }
    },
    showSharer() {
      this.$refs.sharer.show();
    },
  },
};
