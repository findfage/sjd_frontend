import api from '../../../common/api';
import WaterfallFlowLoader from '../../../components/waterfall-flow-loader';

export default {
  template: '#group-joiners',
  components: {
    WaterfallFlowLoader,
  },
  route: {
    data(transition) {
      const that = this;

      transition.next({
        groups: [],
        loader: {
          url: api.groupAll,
          params: {
            id: that.$route.params.id,
          },
        },
      });
    },
  },
  data() {
    return {
      groups: [],
      loader: null,
    };
  },
  methods: {
    load(data) {
      const that = this;

      if (Array.isArray(data)) {
        data.forEach((group) => {
          that.groups.push(group);
        });
      }
    },
  },
};
