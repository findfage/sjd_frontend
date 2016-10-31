import '../plugins';
import store from '../store';
import Dialog from '../components/dialog';
import Snackbar from '../components/snackbar';
import { signOut } from '../store/actions';

export default {
  components: {
    Dialog,
    Snackbar,
  },
  store,
  vuex: {
    getters: {
      loading: state => state.loading,
      page: state => state.page,
      site: state => state.site,
      user: state => state.user,
    },
    actions: {
      signOut,
    },
  },
  ready() {
    const that = this;
    const user = that.user;

    // The "expires" value is an Unix timestamp
    if (user && user.expires && user.expires <= Date.now() / 1000) {
      that.signOut();
    }
  },
};
