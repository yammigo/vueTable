import Vue from 'vue';
import {onelresize} from "./utils/utils"
Vue.directive('resize', {
    inserted: function (el, binding, vnode) {
        // 聚焦元素
        //  console.log(vnode)
       var dey= onelresize(el,function(){
          //  binding.value();
             binding.value();
        })
       
        vnode&&(vnode.dey=dey);
       
      },
      unbind:function(el,binding,vnode){
      
        vnode.dey&&vnode.dey();
      }
});