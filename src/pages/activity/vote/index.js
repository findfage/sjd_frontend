import mixin from './mixin';

export default {
  mixins: [mixin],
  methods: {
    click() {
      const that = this;
      const myJoinerId = that.my.joinerId;

      if (myJoinerId) {
        that.$router.go({
          name: 'vote-joiner',
          params: {
            id: that.activityId,
            joinerId: myJoinerId,
          },
        });
      } else {
        that.visible = true;

        setTimeout(() => {
          that.joining = true;
        }, 0);
      }
    },
  },
};
