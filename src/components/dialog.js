import { hideDialog } from '../store/actions';

// eslint-disable-next-line no-unused-vars
const schema = {
  title: String,
  content: String,
  confirm: Boolean || Function,
  cancel: Boolean || Function,
};

export default {
  template: '#dialog',
  vuex: {
    getters: {
      dialog: state => state.dialog,
    },
    actions: {
      hideDialog,
    },
  },
  methods: {
    confirm() {
      this.hideDialog('confirm');
    },
    cancel() {
      this.hideDialog('cancel');
    },
  },
};
