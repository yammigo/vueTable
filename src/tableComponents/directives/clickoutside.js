export default {
  bind(el, binding, vnode) {
    function documentHandler(e) {
      if (el && el.contains && el.contains(e.target)) {
        return false;
      }
      if (binding.value || binding.expression) {
        binding.value(e);
      }
    }
    el.__vueClickOutside__ = documentHandler;
    document.addEventListener('click', documentHandler);
  },
  update() {

  },
  unbind(el, binding) {
    document.removeEventListener('click', el.__vueClickOutside__);
    delete el.__vueClickOutside__;
  },
};



// WEBPACK FOOTER //
// ./directives/clickoutside.js