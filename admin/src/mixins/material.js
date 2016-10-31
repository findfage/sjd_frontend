const componentHandler = window.componentHandler;

export default {
  ready() {
    const that = this;

    if (componentHandler) {
      const componentElements = that.$el.querySelectorAll('[class*="mdl-js-"]');

      if (componentElements.length) {
        that.componentElements = componentElements;
        componentHandler.upgradeElements(componentElements);
      }
    }
  },
  beforeDestroy() {
    if (componentHandler) {
      const componentElements = this.componentElements;

      if (componentElements.length) {
        componentHandler.downgradeElements(componentElements);
      }
    }
  },
};
