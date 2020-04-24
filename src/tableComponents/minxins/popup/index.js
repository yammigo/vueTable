import PopupManager from './popup-manager.js';
import {
  addClass,
  removeClass,
  setStyle,
  removeDom,
} from 'utils/dom.js';
import {
  setScrollBar,
  resetScrollBar,
} from './setScrollEffect.js';
import emitter from 'mixins/emitter';
import {CSS_PREFIX} from 'components/base.js';

const className = 'byted-modal-open';

// 遮罩设置style
function setBackdropStyle(backdrop, maskStyle) {
  Object.keys(maskStyle).forEach((key) => {
    setStyle(backdrop, key, maskStyle[key]);
  });
}

export default {
  mixins: [emitter],
  props: {
    // 点击遮罩是否可关闭
    maskClosable: {
      type: Boolean,
      default: true,
    },
    // 是否显示遮罩
    maskable: {
      type: Boolean,
      default: true,
    },
    // 遮罩样式
    maskStyle: {
      type: Object,
      default: () => {
        return null;
      },
    },
  },
  beforeMount() {
    PopupManager.register(this._uid, this);
  },
  beforeDestroy() {
    PopupManager.destroy(this._uid);
  },
  destroyed() {
    if (this.value) {
      this.close();
    }
  },
  watch: {
    value(newVal) {
      if (newVal) {
        this.open();
        this.broadcast(`${CSS_PREFIX}table`, 'on-visible-change', true);
      } else {
        this.close();
      }
    },
  },
  methods: {
    open() {
      // 当前展开的弹出
      const openInstances = PopupManager.stack;
      const isMulti = openInstances.length > 0;
      const zIndex = PopupManager.nextZIndex();
      // 遮罩
      const backdrop = PopupManager.backdrop;
      const refNode = this.$el;
      // 节点 backdrop 和节点 $el 位置对比
      const nodeOrder = refNode.compareDocumentPosition(backdrop);
      backdrop.removeAttribute('style');
      // 显示遮罩
      if (this.maskable) {
        // 首次出遮罩或者当前body内没有遮罩
        // 判断 $el 和 backdrop 的顺序，若backdrop在$el之后要重新插入
        if (!isMulti || !document.body.contains(backdrop)) {
          document.body.insertBefore(backdrop, refNode);
        } else if (nodeOrder && nodeOrder === Node.DOCUMENT_POSITION_FOLLOWING) {
          removeDom(backdrop);
          document.body.insertBefore(backdrop, refNode);
        }
        backdrop.style.zIndex = zIndex;
        setScrollBar();
        addClass(document.body, className);
      }
      this.$el.style.zIndex = zIndex;
      PopupManager.stackPush({id: this._uid, zIndex: zIndex, $el: this.$el, instance: this});
      setTimeout(() => {
        addClass(backdrop, 'in');
        // 遮罩层样式添加
        if (this.maskStyle) {
          setBackdropStyle(backdrop, this.maskStyle);
        };
      }, 0);
    },
    close() {
      PopupManager.stackPop(this._uid);
      // const openInstances = PopupManager.stack;
      // const isMulti = openInstances.length > 0;
      const backdrop = PopupManager.backdrop;
      // 遮罩层样式去除
      backdrop.removeAttribute('style');
      // 删除遮罩的情况：没有展开的弹出框或者展开的弹出框内不需要显示遮罩
      if (PopupManager.isRemoveBackup()) {
        removeClass(backdrop, 'in');

        setTimeout(() => {
          // 当前没有显示的stack body滚动条初始为正常状态
          if (!PopupManager.stack.length) {
            resetScrollBar();
            removeClass(document.body, className);
          }
          if (PopupManager.isRemoveBackup()) {
            // 遮罩移除
            removeDom(backdrop);
          }
        }, 250);// 与 backdrop 的动画时间保持一致,防止 body 上的 overflow:hidden 带来的模态框抖动问题
      } else {
        const stack = PopupManager.getFirstBackupStack();
        if (stack.instance && stack.instance.maskStyle) {
          setBackdropStyle(backdrop, stack.instance.maskStyle);
        }
        backdrop.style.zIndex = stack.zIndex;
      }
    },
  },
};



// WEBPACK FOOTER //
// ./mixins/popup/index.js