import { signOut } from '../../store/actions';

export default {
  vuex: {
    actions: {
      signOut,
    },
  },
  ready() {
    const that = this;

    that.signOut();
    that.$router.go({
      name: 'signin',
    });
  },
};
