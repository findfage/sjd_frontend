import $ from 'jquery';
import '@fengyuanchen/tooltip';
import '@fengyuanchen/validator';
import '@fengyuanchen/validator/i18n/validator.zh-CN';
import { jsonFilter } from '../utilities';

// jQuery AJAX setup
$.ajaxSetup({
  dataType: 'json',

  dataFilter(data, type) {
    if (type === 'json') {
      return jsonFilter(data);
    }

    return data;
  },

  error() {
    $(document.body).tooltip('请求失败，请检查您的网络连接或稍后再试', 'danger');
  },
});
