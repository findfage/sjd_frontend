export default {
  template: '#pagination',
  props: {
    listrows: {
      type: Number,
      default: 5,
    },
    page: {
      type: Number,
      default: 1,
    },
    total: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    links() {
      const that = this;
      const page = that.page;
      const min = 1;
      const max = Math.max(Math.ceil(that.total / that.listrows), min);
      const end = Math.max(Math.min(page + 2, max), Math.min(min + 4, max));
      const start = Math.min(Math.max(page - 2, min), Math.max(max - 4, 1));
      const links = [];
      let i;
      let n;

      // Previous
      links.push({
        disabled: page === min,
        icon: true,
        link: page === min ? null : {
          query: {
            listrows: that.listrows,
            page: page - 1,
          },
        },
        text: 'navigate_before',
      });

      if (start >= min + 1) {
        for (i = min, n = Math.min(start - 1, start === (min + 4) ? 4 : 3); i <= n; i++) {
          links.push({
            link: {
              query: {
                listrows: that.listrows,
                page: i,
              },
            },
            text: i,
          });
        }

        if (start > min + 4) {
          links.push({
            disabled: true,
            text: '...',
          });
        }
      }

      // Main pages
      for (i = start; i <= end; i++) {
        links.push({
          active: i === page,
          link: {
            query: {
              listrows: that.listrows,
              page: i,
            },
          },
          text: i,
        });
      }

      if (end <= max - 1) {
        if (end < max - 4) {
          links.push({
            disabled: true,
            text: '...',
          });
        }

        for (i = Math.max(end + 1, max - (end === (max - 4) ? 3 : 2)), n = max; i <= n; i++) {
          links.push({
            link: {
              query: {
                listrows: that.listrows,
                page: i,
              },
            },
            text: i,
          });
        }
      }

      // Next
      links.push({
        disabled: page === max,
        icon: true,
        link: page === max ? null : {
          query: {
            listrows: that.listrows,
            page: page + 1,
          },
        },
        text: 'navigate_next',
      });

      return links;
    },
  },
  ready() {
  },
};
