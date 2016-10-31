import $ from 'jquery';
import { match } from '../../../common/blacklist';
import activityEditor from '../../../mixins/activity-editor';
import config from './config';

export default {
  template: '#nation-editor',
  mixins: [activityEditor],
  data() {
    const that = this;
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const startDate = new Date(year, month, day);
    const endDate = new Date(year, month, day + 5);

    return $.extend({
      activity: {
        id: 0,
        type: config.code,
        title: '召集48个朋友点亮“欢度国庆”，免费赢取珊瑚岛英语一个月课程',
        start_time: startDate.valueOf() / 1000,
        end_time: endDate.valueOf() / 1000,
        rules: (
          '1、点击上方按钮“我要参加”进行报名。\n\n' +
          '2、报名成功后，发送给好友，好友点开即可帮你点亮“欢度国庆”。\n\n' +
          '3、全部点亮“欢度国庆”即可获得对应的奖品领取资格。'
        ),
        prizes: {
          count: 100,
          image: '',
          limit: 48,
          text: '免费获得珊瑚岛英语一个月课程',
        },
        receive_info: `领奖时间：\n领奖地址：\n领奖电话：${that.user.mobile}`,
        host_info: '',
        host_img: [],
      },
    }, config);
  },
  methods: {
    isValid() {
      const that = this;
      const activity = that.activity;
      const blacklist = match(JSON.stringify(activity));
      let content = '';
      let valid = false;

      if (!activity.title) {
        content = '请设置活动标题';
      } else if (!activity.prizes.limit) {
        content = '请输入月牙数量';
      } else if (!activity.prizes.text) {
        content = '请输入奖品描述';
      } else if (!activity.receive_info) {
        content = '请设置领奖信息';
      } else if (blacklist.length) {
        content = `发现违规词：${blacklist.join('、')}，请修改后再发布！`;
      } else {
        valid = true;
      }

      if (!valid) {
        that.showDialog({
          title: '提示',
          content,
          confirm: true,
        });
      }

      return valid;
    },
  },
};
