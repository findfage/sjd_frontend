// eslint-disable-next-line no-unused-vars
const schema = {
  results: Array,
};

export default {
  template: '#searchbar',
  props: {
    placeholder: {
      type: String,
      default: '请输入搜索关键字',
    },
    search: {
      type: Function,
      default() {},
    },
  },
  data() {
    return {
      focused: false,
    };
  },
  methods: {
    focus(e) {
      this.input = e.target;
      this.focused = true;
    },
    blur() {
      if (!this.input.value) {
        this.focused = false;
      }
    },
    clear() {
      const that = this;

      that.input.value = '';
      that.input = null;
      that.focused = false;
      that.search('');
    },
    submit(e) {
      const that = this;

      e.preventDefault();

      that.search(that.input.value);
    },
  },
};
