import $ from 'jquery';
import messages from '../common/messages';

const EVENT_WHEEL = 'wheel mousewheel DOMMouseScroll';
const EVENT_MOUSE_DOWN = 'mousedown touchstart pointerdown MSPointerDown';
const EVENT_MOUSE_MOVE = 'mousemove touchmove pointermove MSPointerMove';
const EVENT_MOUSE_UP = (
  'mouseup touchend touchcancel ' +
  'pointerup pointercancel MSPointerUp MSPointerCancel'
);

export default {
  template: '#waterfall-flow-loader',
  data() {
    return {
      count: 0,
      total: 0,
      loadable: true,
      loading: false,
    };
  },
  props: {
    url: {
      type: String,
      required: true,
    },
    page: {
      type: Number,
      default: 1,
    },
    listrows: {
      type: Number,
      default: 5,
    },
    params: {
      type: Object,
      default() {
        return {};
      },
    },
    start: {
      type: Function,
      default() {},
    },
    done: {
      type: Function,
      default() {},
    },
    fail: {
      type: Function,
      default() {},
    },
    end: {
      type: Function,
      default() {},
    },
  },
  computed: {
    reset() {
      if (this.restart) {
        this.load();
        return true;
      }

      return false;
    },
  },
  ready() {
    const that = this;

    $(window).on(EVENT_WHEEL, that.wheel)
      .on(EVENT_MOUSE_DOWN, that.mousedown)
      .on(EVENT_MOUSE_MOVE, that.mousemove)
      .on(EVENT_MOUSE_UP, that.mouseup);

    this.load();
  },
  beforeDestroy() {
    const that = this;

    $(window).off(EVENT_WHEEL, that.wheel)
      .off(EVENT_MOUSE_DOWN, that.mousedown)
      .off(EVENT_MOUSE_MOVE, that.mousemove)
      .off(EVENT_MOUSE_UP, that.mouseup);
  },
  methods: {
    load() {
      const that = this;

      if (that.loading) {
        return;
      }

      that.start();
      that.loading = true;

      $.ajax(that.url, {
        data: $.extend({}, that.params, {
          page: that.page++,
          listrows: that.listrows,
        }),

        success(response) {
          if (response.code) {
            that.loadable = false;
            that.fail(messages[response.code]);
            return;
          }

          const data = response.data;

          if (data) {
            let list = null;

            if (data.list) {
              list = data.list;

              if (data.total) {
                that.total = data.total;
              }
            } else {
              list = data;
            }

            if (Array.isArray(list)) {
              if (list.length) {
                that.count += list.length;

                if (that.count === that.total || list.length < that.listrows) {
                  that.loadable = false;
                }

                that.done(list);
              } else {
                that.loadable = false;
                that.done();
              }
            } else {
              that.done();
            }
          } else {
            that.loadable = false;
            that.done();
          }
        },
        error() {
          that.fail();
        },
        complete() {
          that.loading = false;
          that.end();
        },
      });
    },
    wheel({ originalEvent }) {
      const that = this;
      const body = document.body;

      if (!that.loadable || !originalEvent) {
        return;
      }

      const deltaY = originalEvent.deltaY || -originalEvent.wheelDelta || originalEvent.detail;

      if (deltaY > 0 && window.innerHeight + body.scrollTop === body.scrollHeight) {
        that.load();
      }
    },
    mousedown({ originalEvent }) {
      const touches = originalEvent.touches;

      this.pageY = touches ? touches[0].pageY : originalEvent.pageY;
    },
    mousemove({ originalEvent }) {
      const that = this;
      const body = document.body;
      const touches = originalEvent.touches;

      if (!that.loadable || !originalEvent || !that.pageY) {
        return;
      }

      const pageY = touches ? touches[0].pageY : originalEvent.pageY;

      if (pageY < that.pageY && window.innerHeight + body.scrollTop === body.scrollHeight) {
        that.load();
      }

      that.pageY = pageY;
    },
    mouseup() {
      this.pageY = 0;
    },
  },
};
