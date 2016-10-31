import $ from 'jquery';
import apis from '../common/apis';
import Carousel from '../plugins/carousel';

export default {
  data() {
    return {
      carousel: null,
      completedJoiners: {
        total: 0,
        list: [],
      },
    };
  },
  beforeDestroy() {
    this.stopCarousel();
  },
  methods: {
    loadCompletedJoiners(activityId) {
      const that = this;

      $.ajax(apis.activity.complete, {
        data: {
          activity_id: activityId,
        },

        success(response) {
          if (response.data) {
            that.completedJoiners = response.data;

            that.$nextTick(() => {
              that.startCarousel();
            });
          }
        },
      });
    },
    startCarousel() {
      const that = this;

      that.stopCarousel();
      that.carousel = new Carousel(that.$els.carousel, {
        duration: 3000,
      });
    },
    stopCarousel() {
      const that = this;

      if (that.carousel) {
        that.carousel.stop();
        that.carousel = null;
      }
    },
  },
};
