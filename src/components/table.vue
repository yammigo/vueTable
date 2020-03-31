<template>
<div class="f-table" style="width:800px;position:relative;border:1px solid #eee" ref="Ftable">
    <!-- 表头（可粘性固定） -->
    <div ref="sticky" class="f-table-header f-sticky" style="width:100%;overflow:hidden;
    top: 0;zindex:10" :style="{position:(height=='auto'?'sticky':'none')}">
        <table cellspacing="0" cellpadding="0" style="width:100%">
            <colgroup>
                <col width="40" />
                <col v-for="(item,index) in columns" :key="index" :width="item.width" />
                <col width="15" />
            </colgroup>
            <thead style="display: table-header-group;">
                <tr>
                    <th>
                        <input type="checkbox" :checked="checkedStatus" ref="checkedAll" @change="checkedAll" />
                    </th>
                    <th v-for="(item,index) in columns" :key="index" :align="item.align">
                        <div class="ivu-table-cell">{{item.title}}</div>
                    </th>
                    <!-- th占位处理滚动条宽度 -->
                    <th rowspan="1"></th>
                </tr>
            </thead>
        </table>
        <!-- 锁定列的表头 -->
        <div class="fixed-header-right" style="width:120px;overflow:hidden;position:absolute;top:0px;right:0px;height:50px;" ref="fixedRH">
          <table cellspacing="0" cellpadding="0" style="width:100%;">
            <colgroup>
                <col width="40" />
                <col v-for="(item,index) in columns" :key="index" :width="item.width" />
                <col width="15" />
            </colgroup>
            <thead style="display: table-header-group;">
                <tr>
                    <th>
                        <input type="checkbox" :checked="checkedStatus" ref="checkedAll" @change="checkedAll" />
                    </th>
                     <th v-for="(item,index) in columns" :key="index" :align="item.align" >
                        <div class="ivu-table-cell">{{item.title}}</div>
                    </th>
                  
                    <th rowspan="1"></th>
                </tr>
            </thead>
        </table>
        </div>
    </div>
    <!-- 数据体 -->
    <tableBody ref="scrollBody" v-on:scroll.native="orderScroll($event)" :bodyData="data" :cols="columns" :selectItems.sync="selectItems" style="overflow:auto;" :style="{height:height>0?(height+'px'):'auto'}" />
    <!-- 固定列逻辑实验
    1.渲染固定列所需要的参数
    2.检测是否存在左侧固定列fixedLeft or fixedRight 若存在且开启的批量操作则需要把checkoBox固定渲染到左侧中
    3.固定列采用定位的方式渲染到左侧中，并且主体中hide固定中的内容，采用padding占位
    4.a.计算出固定列的宽度or直接克隆原来表格的内容
    5.固定列中的事件处理:  1重新绑定 或者 2直接克隆节点来转移事件
    -->
    
    <div class="fixed-right-body" style="width:120px;position:absolute;right:0px;background:#fff;top:52px;" :style="{height:height>0?(height-15+'px'):'100%'}">
        <tableBody ref="scrollBody" :bodyData="data" :cols="columns" :selectItems.sync="selectItems" style="overflow:auto;" :style="{height:height>0?(height+'px'):'auto'}" />
    </div>
   {{selectItems}}
</div>
</template>

<script>
import Stickyfill from "stickyfilljs";
import tableBody from "./tableBody";
import fixedTable from "./fixedTable";
import {getPosition,throttle} from "../utils/utils"
export default {
    props: {
        columns: {
            type: Array,
            default () {
                return [];
            }
        },
        data: {
            type: Array,
            default () {
                return [];
            }
        },
        height: {
            type: String,
            default: "auto"
        }
    },
    data() {
        return {
            selectItems: [],
            fixedLeft: [],
            fixedRight: [],
            fixedFlag:false,
            
        };
    },
    methods: {
        orderScroll(e) {
            this.$refs.sticky.scrollLeft = e.target.scrollLeft;
        },
        checkedAll(e) {
            this.selectItems = e.target.checked ? this.data : [];
        },
        findFixed() {
            this.columns.forEach(item => {
                if (item.hasOwnProperty("fixed")) {
                    switch (item.fixed) {
                        case "left":
                            this.fixedLeft.push(item);
                            break;
                        case "right":
                            this.fixedRight.push(item);
                    }
                }
            });
        }
    },
    mounted() {
        this.$nextTick(() => {
            //粘性表头兼容方案//当单页数据量过大时采用粘性表头方案代替原生属性
            let fixedRH=this.$refs.fixedRH;
           
            if (this.height== "auto") {
                Stickyfill.add(this.$refs.sticky);
                // Stickyfill.add(this.$refs.sticky2);
            }
            // console.log(this.$refs.Ftable.getBoundingClientRect())
            window.onscroll=throttle(()=>{
                console.log(this.fixedFlag);
                var p=getPosition(this.$refs.Ftable);
                if(p.top<=0 && !this.fixedFlag){
                    this.fixedFlag=true;
                    fixedRH.style.position="fixed";
                   
                }else{
                     this.fixedFlag=false;
                     fixedRH.style.position="absolute";
                }
            },100)
        
        });
    },
    computed: {
        checkedStatus() {
            if (this.selectItems.length !== this.data.length) {
                if (this.selectItems.length !== 0) {
                    this.$refs.checkedAll && (this.$refs.checkedAll.indeterminate = true);
                } else {
                    this.$refs.checkedAll &&
                        (this.$refs.checkedAll.indeterminate = false);
                }
                return false;
            } else {
                this.$refs.checkedAll && (this.$refs.checkedAll.indeterminate = false);
                return true;
            }
        }
    },
    watch: {
        columns() {
            this.findFixed();
        }
    },
    components: {
        tableBody,
        fixedTable
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style lang="less">
.f-table-header {
    font-size: 16px;
    box-shadow: 0px 6px 10px -5px #a5a5a5;

    table,
    table tr th,
    table tr td {
        border: 1px solid #eee;
        border-bottom: 0px solid #eee;
        padding: 5px 10px;
        background: #eee;
        cursor: pointer;
    }

    table tr th:active {
        color: green;
    }

    table {
        border-collapse: collapse;
        padding: 2px;
        table-layout: fixed;
    }

    .f-sticky {
        box-shadow: 0px 0px 10px black;
        position: sticky;
        top: 0;
    }
}
</style>
