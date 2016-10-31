import Vuex from 'vuex';
import mutations from './mutations';
import constants from '../common/constants';
import { LocalStorage } from '../utilities';

const state = {
  loading: true,
  page: {},
  site: {
    title: constants.title,
    description: constants.description,
  },
  user: LocalStorage.getItem('user'),
};

export default new Vuex.Store({
  strict: window.location.hostname === 'localhost',
  state,
  mutations,
});
