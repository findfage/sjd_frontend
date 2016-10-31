import activity from '../../../mixins/activity';
import activityCarousel from '../../../mixins/activity-carousel';
import mixin from './mixin';

export default {
  mixins: [activity, activityCarousel, mixin],
  methods: {
    click() {
      const that = this;
      const myJoinerId = that.my.joinerId;

      if (myJoinerId) {
        that.$router.go({
          name: 'nation-joiner',
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
