import $ from 'jquery';
import '@fengyuanchen/uploader';
import { showLoading, hideLoading } from '../store/actions';
import { getRandomFilename } from '../utilities';

const URL = window.URL || window.webkitURL;
const REGEXP_BLOB_URL = /^blob:/;
const REGEXP_IMAGE = /^image\/\w+/;

export default {
  template: '#uploader',
  vuex: {
    actions: {
      showLoading,
      hideLoading,
    },
  },
  props: {
    description: {
      type: String,
      default: '',
    },
    error: {
      type: Function,
      default() {
        return () => {};
      },
    },
    images: {
      type: Array,
      default() {
        return [];
      },
    },
    mini: {
      type: Boolean,
      default: false,
    },
    maxlength: {
      type: Number,
      default: 1,
    },
    placeholder: {
      type: String,
      default: '',
    },
    preview: {
      type: Boolean,
      default: false,
    },
    reverse: {
      type: Boolean,
      default: false,
    },
    success: {
      type: Function,
      default() {
        return () => {};
      },
    },
  },
  data() {
    return {
      signature: null,
      uploading: false,
    };
  },
  ready() {
    const that = this;

    that.check();
    that.$root.$on('upload.uploader', that.upload);
  },
  beforeDestroy() {
    const that = this;

    that.$root.$off('upload.uploader', that.upload);
  },
  methods: {
    read(e) {
      const that = this;
      const input = e.target;
      const file = input.files ? input.files[0] : null;

      if (file && REGEXP_IMAGE.test(file.type)) {
        that.images[Number(input.dataset.index)].url = URL.createObjectURL(file);
        that.check();
      }
    },
    load(e) {
      const url = e.target.src;

      if (REGEXP_BLOB_URL.test(url)) {
        URL.revokeObjectURL(url);
      }
    },
    clear(i) {
      const that = this;

      that.images.splice(i, 1);
      that.check();
    },
    check() {
      const that = this;
      const images = that.images;
      let chooable = false;

      if (images.length < that.maxlength) {
        images.forEach((image) => {
          if (!image.url) {
            chooable = true;
          }
        });

        if (!chooable) {
          images.push({
            url: '',
          });
        }
      }
    },
    upload(signature) {
      const that = this;

      if (that.uploading || !signature) {
        return;
      }

      that.signature = signature;
      that.uploading = true;
      that.showLoading('图片上传中');

      that.initUploader((images) => {
        that.hideLoading();
        that.uploading = false;

        if (images) {
          that.success(images);
        } else {
          that.error();
        }
      });
    },
    initUploader(callback) {
      const that = this;
      const $files = $(':file', that.$el).filter(function filter() {
        return this.files && this.files.length;
      });
      const total = $files.length;
      const images = [];

      that.images.forEach((image, i) => {
        if (image.url && !REGEXP_BLOB_URL.test(image.url)) {
          images[i] = image.url;
        }
      });

      if (!total) {
        callback.call(that, images);
        return;
      }

      const signature = that.signature;
      let count = 0;
      let error = 0;

      $files.each((i, file) => {
        const $this = $(file);
        const filename = `${signature.dir}${getRandomFilename(file.files[0].name)}`;

        $this.uploader({
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
            images[Number(file.dataset.index)] = filename;
          },

          fail() {
            error++;
          },

          uploaded() {
            $this.uploader('destroy');

            if (++count === total) {
              if (!error) {
                callback.call(that, images);
              } else {
                callback.call(that);
              }
            }
          },
        }).uploader('upload');
      });
    },
  },
};
