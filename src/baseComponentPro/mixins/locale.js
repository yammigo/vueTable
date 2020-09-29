import locale from '../locale';


export default {
  computed: {
    t() {
      const lang = this.$bytedLang;
      return (path, options) => {
        return locale.getMessage.call(this, lang, path, options);
      };
    },
  },
  beforeCreate() {
    locale.install(this.$root.constructor);
  },
};



// WEBPACK FOOTER //
// ./mixins/locale.js