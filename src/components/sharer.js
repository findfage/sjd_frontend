import $ from 'jquery';
import '@fengyuanchen/uploader';
import api from '../common/api';
import constants from '../common/constants';
import { match } from '../common/blacklist';
import { showDialog, showLoading, hideLoading } from '../store/actions';
import { pathify, getRandomFilename, translateType } from '../utilities';
import { imagify } from '../filters';

const location = window.location;
const jWeixin = window.jWeixin;
const origin = `${location.protocol}//${location.host}`;
const REGEXP_IMAGE = /^image\/\w+/;

export default {
  template: '#sharer',
  vuex: {
    getters: {
      user: state => state.user,
    },
    actions: {
      showDialog,
      showLoading,
      hideLoading,
    },
  },
  props: {
    autoShare: {
      type: Boolean,
      default: false,
    },
    autoShow: {
      type: Boolean,
      default: true,
    },
    data: {
      type: Object,
      default() {
        return {};
      },
    },
    desc: {
      type: String,
      default: '',
    },
    imgUrl: {
      type: String,
      default: '',
    },
    link: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      guiding: false,
      sharing: false,
      visible: false,
    };
  },
  computed: {
    shareData() {
      const that = this;
      const data = that.data;
      const pathname = pathify(location.pathname);
      const params = [
        `activity=${data.id}`,
        `joiner=${data.joinerId}`,
        `origin=${origin}`,
        `type=${data.type}`,
      ];

      return {
        desc: that.desc || that.getDesc(),
        imgUrl: imagify(that.imgUrl, '160w_160h_4e_2o') || that.getImgUrl(),
        link: `${location.protocol}//${constants.share}${pathname}?${params.join('&')}`,
        title: that.title || that.getTitle(),
      };
    },
  },
  ready() {
    const that = this;

    if (that.autoShow) {
      that.show();
    }

    if (that.autoShare) {
      that.share();
    }

    that.setWX();
  },
  beforeDestroy() {
    this.resetWX();
  },
  methods: {
    getTitle() {
      const data = this.data;
      const suffix = [
        '',
        '快来帮我加油！',
        '快来帮我摘星星！',
        '快来帮我砍价！',
        '快来一起拼团！',
        '快来一起集月牙！',
        '快来帮我点亮“欢度国庆”！',
      ][data.type];

      return suffix ? `${data.title}，${suffix}` : data.title;
    },
    getDesc() {
      const desc = [
        '',
        '每人仅可加油一次，点开页面即加油成功。',
        '每人仅限摘星一次。',
        '每人仅限砍价一次。',
        '每人仅限拼团一次。',
        '每人仅限集月牙一次。',
        '每人仅限点亮一次。',
      ][this.data.type];

      return desc;
    },
    getImgUrl() {
      const category = translateType(this.data.type);
      const index = `images/${category}/index.jpg`;

      return `${origin}${location.pathname}${index}`;
    },
    show() {
      const that = this;

      that.$emit('show');
      that.visible = true;

      setTimeout(() => {
        that.sharing = true;

        setTimeout(() => {
          that.$emit('shown');
        }, 300);
      }, 0);
    },
    hide() {
      const that = this;

      that.$emit('hide');
      that.sharing = false;

      setTimeout(() => {
        that.visible = false;
        that.$emit('hidden');
      }, 300);
    },
    change(e) {
      const that = this;
      const target = e.target;

      that[target.name] = target.value;
      that.update();
    },
    update() {
      const that = this;
      const data = {
        activity_id: that.data.id,
        share_content: that.desc,
        share_img: that.imgUrl,
        share_title: that.title,
        token: that.user.token,
      };
      const blacklist = match(JSON.stringify(data));

      if (blacklist.length) {
        that.showDialog({
          title: '提示',
          content: `发现违规词：${blacklist.join('、')}，请修改！`,
          confirm: true,
        });
        return;
      }

      $.ajax(api.activityShare, {
        method: 'PUT',
        data,

        success() {
          that.setWX();
        },
      });
    },
    upload(e) {
      const that = this;
      const input = e.target;
      const file = input.files ? input.files[0] : null;

      if (file && REGEXP_IMAGE.test(file.type)) {
        if (that.uploading) {
          return;
        }

        that.uploading = true;
        that.showLoading('图片上传中');

        $.get(api.uploadSignature, {
          token: that.user.token,
          type: 2, // 1: 用户相关, 2: 活动相关
        }, (response) => {
          if (response.data) {
            that.initUploader({
              input,
              signature: response.data,
            }, () => {
              that.hideLoading();
              that.uploading = false;
              that.update();
            });
          }
        });
      }
    },
    initUploader({ input, signature }, callback) {
      const that = this;
      const filename = `${signature.dir}${getRandomFilename(input.files[0].name)}`;

      $(input).uploader({
        // The name should be "file" for uploading to OSS
        name: 'file',
        url: signature.host,
        data: {
          key: filename,
          policy: signature.policy,
          OSSAccessKeyId: signature.accessid,
          signature: signature.signature,
        },

        done() {
          that.imgUrl = filename;
          that.data.share_img = filename;
          callback();
        },
      }).uploader('upload');
    },
    close(e) {
      if (e.target.dataset.action === 'close') {
        this.hide();
      }
    },
    share() {
      this.guiding = true;
    },
    updateShareCount() {
      $.post(api.statistic.activity, {
        activity_id: this.data.id,
        type: 2, // 1:参加人数, 2:分享次数, 3:浏览次数
      });
    },
    setWX() {
      const that = this;

      if (jWeixin) {
        const shareData = that.shareData;
        const cancel = () => that.hide();
        const success = () => {
          that.updateShareCount();
          that.hide();
        };

        // 分享到朋友圈
        jWeixin.onMenuShareTimeline({
          cancel,
          imgUrl: shareData.imgUrl,
          link: shareData.link,
          success,
          title: shareData.title,
        });

        // 分享给朋友
        jWeixin.onMenuShareAppMessage({
          cancel,
          desc: shareData.desc,
          imgUrl: shareData.imgUrl,
          link: shareData.link,
          success,
          title: shareData.title,
        });
      }
    },
    resetWX() {
      if (jWeixin) {
        // 分享到朋友圈
        jWeixin.onMenuShareTimeline({});

        // 分享给朋友
        jWeixin.onMenuShareAppMessage({});
      }
    },
  },
};
