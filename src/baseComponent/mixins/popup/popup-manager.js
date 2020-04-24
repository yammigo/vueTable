import {
  addClass,
  // removeClass,
  // insertAfter,
} from 'utils/dom.js';
// 激活态初始zIndex
const zIndex = 2000;
// 遮罩层
const backdrop = document.createElement('div');
addClass(backdrop, 'byted-modal-backdrop fade');

const PopupManager = {
  zIndex: zIndex,
  // 弹出层实例
  instances: {},
  // 存储当前显示的弹出层的栈，顺序为点击显示的顺序
  stack: [],
  backdrop: backdrop,
  // zindex 增加
  nextZIndex() {
    return PopupManager.zIndex++;
  },
  // 弹出层示例注册
  register(id, instance) {
    PopupManager.instances[id] = instance;
  },
  // 弹出层示例销毁
  destroy(id) {
    PopupManager.instances[id] = null;
    delete PopupManager.instances[id];
  },
  // getOpenInstances(currentId) {
  //   return Object.keys(PopupManager.instances).filter((key) => {
  //     return PopupManager.instances[key].value && +key !== currentId;
  //   }).map((key) => PopupManager.instances[key]);
  // },
  stackPush({id, zIndex, $el, instance}) {
    this.stack.push({
      id: id,
      zIndex: zIndex,
      $el: $el,
      instance,
    });
  },
  stackPop(id) {
    if (this.stack.length && this.stack[this.stack.length - 1].id === id) {
      this.stack.pop();
    } else {
      const idIndex = this.stack.findIndex((item) => item.id === id);
      if (idIndex !== -1) {
        this.stack.splice(idIndex, 1);
      }
    }
  },
  // 删除遮罩的情况：没有展开的弹出框或者展开的弹出框内不需要显示遮罩
  isRemoveBackup() {
    return !this.stack.length || this.stack.every((item) => {
      return !this.instances[item.id].maskable;
    });
  },
  // 获取堆栈中需首个需要显示遮罩
  getFirstBackupStack() {
    let index = this.stack.length - 1;
    while (index >= 0) {
      const id = this.stack[index].id;
      if (this.instances[id].maskable) {
        return this.stack[index];
      }
      index--;
    }
    return null;
  },
};
export default PopupManager;



// WEBPACK FOOTER //
// ./mixins/popup/popup-manager.js