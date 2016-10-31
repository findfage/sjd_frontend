import mixin from './mixin';

export default {
  mixins: [mixin],
  data() {
    return {
      personal: false,
    };
  },
  computed: {
    completed() {
      return !this.personal;
    },
  },
  methods: {
    click() {
      const that = this;
      const myJoinerId = that.my.joinerId;

      if (myJoinerId) {
        that.$router.go({
          name: 'group-joiner',
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
