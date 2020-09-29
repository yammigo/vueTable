import {
  getScrollBarWidth,
} from 'utils/dom.js';

export function setScrollBar() {
  const bodyIsOverflowing = document.body.clientWidth < window.innerWidth;
  let scrollBarWidth = 0;
  if (bodyIsOverflowing) {
    scrollBarWidth = getScrollBarWidth();
    if (bodyIsOverflowing && scrollBarWidth !== 0) {
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    }
  }
}
export function resetScrollBar() {
  document.body.style.paddingRight = '';
}



// WEBPACK FOOTER //
// ./mixins/popup/setScrollEffect.js