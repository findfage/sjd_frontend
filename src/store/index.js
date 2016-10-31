import Vuex from 'vuex';
import mutations from './mutations';
import constants from '../common/constants';
import { LocalStorage } from '../utilities';

const state = {
  dialog: null,
  joiner: LocalStorage.getItem('joiner'),
  loading: '',
  page: {},
  reminded: true,
  sharable: false,
  site: {
    title: constants.title,
    description: constants.description,
  },
  user: LocalStorage.getItem('user'),
  voter: LocalStorage.getItem('voter'),
  visitor: LocalStorage.getItem('visitor'),
};

export default new Vuex.Store({
  strict: window.location.hostname === 'localhost',
  state,
  mutations,
});
