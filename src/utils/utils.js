/*
au：fanjiantao
name: utils
**/
var throttle = function (func, delay) {
    var timer = null;
    var startTime = Date.now();
   
    
    return function () {
        
        var curTime = Date.now();
        var remaining = delay - (curTime - startTime);
        var context = this;
        var args = arguments;
        window.clearTimeout(timer);
        if (remaining <= 0) {
            
            func.apply(context, args);
            startTime = Date.now();
        } else {
           
            
            timer = setTimeout(func, remaining);
        }
    }()
}
export { throttle }
function typeOf(obj) {
    const toString = Object.prototype.toString;
    const map = {
        '[object Boolean]': 'boolean',
        '[object Number]': 'number',
        '[object String]': 'string',
        '[object Function]': 'function',
        '[object Array]': 'array',
        '[object Date]': 'date',
        '[object RegExp]': 'regExp',
        '[object Undefined]': 'undefined',
        '[object Null]': 'null',
        '[object Object]': 'object'
    };
    return map[toString.call(obj)];
}

const trim = function (string) {
    return (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '');
};

function deepCopy(data) {
    const t = typeOf(data);
    let o;

    if (t === 'array') {
        o = [];
    } else if (t === 'object') {
        o = {};
    } else {
        return data;
    }

    if (t === 'array') {
        for (let i = 0; i < data.length; i++) {
            o.push(deepCopy(data[i]));
        }
    } else if (t === 'object') {
        for (let i in data) {
            o[i] = deepCopy(data[i]);
        }
    }
    return o;
}

export { deepCopy };

export function hasClass(el, cls) {
    if (!el || !cls) return false;
    if (cls.indexOf(' ') !== -1) throw new Error('className should not contain space.');
    if (el.classList) {
        return el.classList.contains(cls);
    } else {
        return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1;
    }
}

/* istanbul ignore next */
export function addClass(el, cls) {
    if (!el) return;
    let curClass = el.className;
    const classes = (cls || '').split(' ');

    for (let i = 0, j = classes.length; i < j; i++) {
        const clsName = classes[i];
        if (!clsName) continue;

        if (el.classList) {
            el.classList.add(clsName);
        } else {
            if (!hasClass(el, clsName)) {
                curClass += ' ' + clsName;
            }
        }
    }
    if (!el.classList) {
        el.className = curClass;
    }
}

export function removeClass(el, cls) {
    if (!el || !cls) return;
    const classes = cls.split(' ');
    let curClass = ' ' + el.className + ' ';

    for (let i = 0, j = classes.length; i < j; i++) {
        const clsName = classes[i];
        if (!clsName) continue;

        if (el.classList) {
            el.classList.remove(clsName);
        } else {
            if (hasClass(el, clsName)) {
                curClass = curClass.replace(' ' + clsName + ' ', ' ');
            }
        }
    }
    if (!el.classList) {
        el.className = trim(curClass);
    }
}

export function getStyle(element, styleName) {
    if (!element || !styleName) return null;
    styleName = camelCase(styleName);
    if (styleName === 'float') {
        styleName = 'cssFloat';
    }
    try {
        const computed = document.defaultView.getComputedStyle(element, '');
        return element.style[styleName] || computed ? computed[styleName] : null;
    } catch (e) {
        return element.style[styleName];
    }
}
//在没有key 作为标识的情况下使用字符串比较的方式确定b是否在都在a中
//this is find object item index
export function findIndex(a, b) {
    var index = -1;
    for (var i = 0, len = a.length; i < len; i++) {
        if (JSON.stringify(b) == JSON.stringify(a[i])) {
            index = i
            break
        }
    }
    return index
}

export function getPosition(element) {

    var rect = element.getBoundingClientRect();

    var top = document.documentElement.clientTop;

    var left = document.documentElement.clientLeft;
    return {

        top: rect.top - top,

        bottom: rect.bottom - top,

        left: rect.left - left,

        right: rect.right - left

    }
}
//监听dom 元素是否发生变化
function onelresize(el, handler) {
    // if(handler=="destroy"){
    //     console.log(expand,shrink)
    //     expand&&expand.addEventListener('scroll', onScroll);
    //     shrink&&shrink.addEventListener('scroll', onScroll);
    //     return
    // }
    if (!(el instanceof HTMLElement)) {
        throw new TypeError("Parameter 1 is not instance of 'HTMLElement'.");
    }
    // https://www.w3.org/TR/html/syntax.html#writing-html-documents-elements
    if (/^(area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr|script|style|textarea|title)$/i.test(el.tagName)) {
        throw new TypeError('Unsupported tag type. Change the tag or wrap it in a supported tag(e.g. div).');
    }
    if (typeof handler !== 'function') { throw new TypeError("Parameter 2 is not of type 'function'."); }

    var lastWidth = el.offsetWidth || 1;
    var lastHeight = el.offsetHeight || 1;
    var maxWidth = 10000 * lastWidth;
    var maxHeight = 10000 * lastHeight;

    var expand = document.createElement('div');
    expand.style.cssText = 'position:absolute;top:0;bottom:0;left:0;right:0;z-index=-10000;overflow:hidden;visibility:hidden;';
    var shrink = expand.cloneNode(false);

    var expandChild = document.createElement('div');
    expandChild.style.cssText = 'transition:0s;animation:none;';
    var shrinkChild = expandChild.cloneNode(false);

    expandChild.style.width = maxWidth + 'px';
    expandChild.style.height = maxHeight + 'px';
    shrinkChild.style.width = '250%';
    shrinkChild.style.height = '250%';

    expand.appendChild(expandChild);
    shrink.appendChild(shrinkChild);
    el.appendChild(expand);
    el.appendChild(shrink);

    if (expand.offsetParent !== el) {
        el.style.position = 'relative';
    }

    expand.scrollTop = shrink.scrollTop = maxHeight;
    expand.scrollLeft = shrink.scrollLeft = maxWidth;

    var newWidth = 0;
    var newHeight = 0;
    function onResize() {

        if (newWidth !== lastWidth || newHeight !== lastHeight) {
            lastWidth = newWidth;
            lastHeight = newHeight;
            handler({ width: lastWidth, height: lastHeight });
        }
    }

    function onScroll() {
        throttle(() => {
            newWidth = el.offsetWidth || 1;
            newHeight = el.offsetHeight || 1;
            if (newWidth !== lastWidth || newHeight !== lastHeight) {
                //    window.requestAnimationFrame(onResize);
                //节流函数
                //    throttle(onResize,60);
                // console.log(onResize);
                onResize();
                
            }
            expand.scrollTop = shrink.scrollTop = maxHeight;
            expand.scrollLeft = shrink.scrollLeft = maxWidth;

        },60);

    }

    expand.addEventListener('scroll', onScroll);
    shrink.addEventListener('scroll', onScroll);
    //返回一个销毁事件
    return function () {
        expand.removeEventListener('scroll', onScroll);
        shrink.removeEventListener('scroll', onScroll);
        return true;
    }
    //销毁
}

export { onelresize }