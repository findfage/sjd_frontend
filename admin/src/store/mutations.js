import $ from 'jquery';
import { LocalStorage } from '../utilities';

export default {
  SHOW_LOADING($state) {
    if (!$state.loading) {
      $state.loading = true;
    }
  },
  HIDE_LOADING($state) {
    $state.loading = false;
  },
  TOGGLE_LOADING($state) {
    $state.loading = !$state.loading;
  },
  SIGN_IN($state, data) {
    if ($.isPlainObject(data)) {
      $state.user = data;
      LocalStorage.setItem('user', data);
    }
  },
  SIGN_OUT($state) {
    LocalStorage.removeItem('user');
    $state.user = null;
  },
  PAGE_IN($state, data) {
    if ($.isPlainObject(data)) {
      $state.page = data;
    }
  },
  PAGE_OUT($state) {
    $state.page = {};
  },
};
