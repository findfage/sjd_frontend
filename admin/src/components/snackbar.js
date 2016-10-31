export default {
  template: '#snackbar',

  ready() {
    const that = this;

    that.$root.$on('show.snackbar', (data) => {
      that.$el.MaterialSnackbar.showSnackbar(data);
    });
  },
};
