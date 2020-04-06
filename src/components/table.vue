<template>
<div class="f-table" style="position:relative;border:1px solid #eee;width:80%;margin:auto" ref="Ftable" v-resize="updateRsize">
    <!-- 表头（可粘性固定） -->
    <div ref="sticky" class="f-table-header f-sticky" style="width:100%;overflow:hidden;
    top: 0;z-index:10" :style="{position:(height=='auto'?'sticky':'none')}">
        <table cellspacing="0" cellpadding="0" style="width:100%">
            <colgroup>
                <col width="40" />
                <col v-for="(item,index) in columns" :key="index" :width="item.width" />
                <!-- <col width="15" /> -->
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
                    <!-- <th rowspan="1"></th> -->
                </tr>
            </thead>
        </table>
    </div>
    <!-- 可滚动的数据体 -->
    <div :style="{height:scrollHeight?(scrollHeight+'px;'):'auto',overflow:'hidden'}">
        <tableBody ref="scrollBody" v-on:scroll.native="orderScroll($event)" :bodyData="data" :cols="columns" :selectItems.sync="selectItems" style="overflow:auto;" :style="{height:height>0?(height+'px'):'auto'}" />
    </div>
    <!-- 锁定列的表头 左侧 -->
    <div class="fixed-header-left"  style="width:120px;overflow:hidden;position:absolute;top:0px;left:0px;z-index:999;" :style="{width:fixedLeftWidth+'px',position:'sticky'}" ref="fixedRH">
        <table cellspacing="0" cellpadding="0" style="width:100%;">
            <colgroup>
                <col width="40" />
                <col v-for="(item,index) in fixedLeft" :key="index" :width="columns[item.idx].width" />
                <!-- 左侧不需要滚动条宽度 -->
                <!-- <col width="15" /> -->
            </colgroup>
            <thead style="display: table-header-group;">
                <tr>
                    <th>
                        <input type="checkbox" :checked="checkedStatus" ref="checkedAll" @change="checkedAll" />
                    </th>
                    <th v-for="(item,index) in fixedLeft" :key="index" :align="columns[item.idx].align">
                        <div class="ivu-table-cell">{{columns[item.idx].title}}</div>
                    </th>
                    <!-- <th rowspan="1"></th> -->
                </tr>
            </thead>
        </table>
    </div>
    <!-- 锁定的表体 -->
    <div :style="{height:scrollHeight+'px',top:fixedHtop+'px',width:fixedLeftWidth+'px'}" class="fixed-left-body" style="width:120px;position:absolute;left:0px;background:#fff;top:0px;overflow:hidden;">
        <tableBody :bodyData="data" :fixedLeft="fixedLeft" :cols="columns" :selectItems.sync="selectItems" style="overflow:hidden;"  :style="{width:scrollWidth+'px'}" />
    </div>
    {{selectItems}}
</div>
</template>

<script>
import Stickyfill from "stickyfilljs";
import tableBody from "./tableBody";
import fixedTable from "./fixedTable";
import {
    getPosition,
    throttle
} from "../utils/utils";
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
            scrollHeight:0,
            scrollWidth:0,
            selectItems: [],
            fixedLeftWidth: 0,
            fixedRightWidth: 0,
            fixedLeft: [],
            fixedRight: [],
            fixedFlag: false,
            fixedHtop: "0"
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
            //初始化数据列数据

            this.$nextTick(() => {
                let fixedLeftW = 0,
                    fixedRightW = 0;
                let firstRow = (this.$refs.scrollBody.$el.getElementsByTagName('tr'))[0].childNodes;
                //提取出带固定列的索引
                for (let i = 0, len = this.columns.length; i < len; i++) {

                    if (this.columns[i].hasOwnProperty("fixed")) {

                        switch (this.columns[i].fixed) {
                            case "left":
                                this.fixedLeft.push({
                                    idx: i,
                                    colWidth: firstRow[i + 1].offsetWidth,
                                })
                                fixedLeftW += firstRow[i + 1].offsetWidth;
                                break;
                            case "right":
                                this.fixedRight.push({
                                    idx: i,
                                    colWidth: firstRow[i + 1].offsetWidth,
                                })
                                fixedRightW += firstRow[i + 1].offsetWidth;
                        }
                    }

                }
                this.fixedRightWidth = fixedRightW+firstRow[0].offsetWidth;
                this.fixedLeftWidth = fixedLeftW+firstRow[0].offsetWidth;
                console.log(this.fixedLeftWidth, "数据");

            })

        },
        updateFixed() {
            let fixedLeftW = 0,
                fixedRightW = 0;
            let firstRow = (this.$refs.scrollBody.$el.getElementsByTagName('tr'))[0].childNodes;
            for (let i = 0, len = this.fixedLeft.length; i < len; i++) {
                this.fixedLeft[i].colWidth = firstRow[i + 1].offsetWidth;
                fixedLeftW += firstRow[i + 1].offsetWidth;
            }
            for (let i = 0, len = this.fixedRight.length; i < len; i++) {
                this.fixedRight[i].colWidth = firstRow[i + 1].offsetWidth;
                fixedRightW += firstRow[i + 1].offsetWidth;
            }
            this.fixedRightWidth = fixedRightW+firstRow[0].offsetWidth;
            this.fixedLeftWidth = fixedLeftW+firstRow[0].offsetWidth;
        },
        fixedResize() {
            this.$nextTick(() => {
                //粘性表头兼容方案//当单页数据量过大时采用粘性表头方案代替原生属性
                let fixedRH = this.$refs.fixedRH;
                this.fixedHtop = fixedRH.offsetHeight+3;
                this.scrollHeight = this.$refs.scrollBody.$el.clientHeight;
                this.scrollWidth = this.$refs.scrollBody.$el.offsetWidth;

                if (this.height == "auto") {
                    Stickyfill.add(this.$refs.sticky);
                    // Stickyfill.add(this.$refs.sticky2);
                }

                window.onscroll = () => {
                    var p = getPosition(this.$refs.Ftable);
                    //左侧固定
                    // if (p.top <= 0 && !this.fixedFlag) {
                    //     this.fixedFlag = true;
                    //     fixedRH.style.position = "fixed";
                    //     fixedRH.style.left = p.right - fixedRH.offsetWidth + "px";
                    // } else {
                    //     if (p.top > 0 && this.fixedFlag) {

                    //         this.fixedFlag = false;
                    //         fixedRH.style.position = "absolute";
                    //         fixedRH.style.left = "";
                    //     }
                    // }
                    //右侧固定
                     if (p.top <= 0 && !this.fixedFlag) {
                        this.fixedFlag = true;
                        fixedRH.style.position = "fixed";
                        fixedRH.style.left = p.left+ "px";
                    } else {
                        if (p.top > 0 && this.fixedFlag) {

                            this.fixedFlag = false;
                            fixedRH.style.position = "absolute";
                            fixedRH.style.left = "";
                        }
                    }

                };
            });
        },
        updateRsize() {
            let fixedRH = this.$refs.fixedRH;
            this.fixedHtop = fixedRH.offsetHeight;
            this.scrollHeight = this.$refs.scrollBody.$el.clientHeight;
            this.scrollWidth = this.$refs.scrollBody.$el.offsetWidth;
            var p = getPosition(this.$refs.Ftable);
            //右侧固定
            // if (p.top <= 0) {
            //     this.fixedFlag = true;
                
            //     fixedRH.style.position = "fixed";
            //     fixedRH.style.left = p.right - fixedRH.offsetWidth + "px";
            // } else {
            //     if (p.top > 0) {
            //         this.fixedFlag = false;
            //         fixedRH.style.position = "absolute";
            //         fixedRH.style.left = "";
            //     }
            // }
            //左侧固定
             if (p.top <= 0) {
                this.fixedFlag = true;
                fixedRH.style.position = "fixed";
                fixedRH.style.left = p.left + "px";
            } else {
                if (p.top > 0) {
                    this.fixedFlag = false;
                    fixedRH.style.position = "absolute";
                    fixedRH.style.left = "";
                }
            }
            this.updateFixed();
        }
    },

    mounted() {
        this.findFixed();

        this.fixedResize();

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
        },
        "fixedLeft": {
            handler(newVal, oldVal) {
                console.log('深度监听', newVal, oldVal);
            },
            deep: true
        }
    },
    created() {
        //收集数据

    },
    components: {
        tableBody,
        fixedTable
    },
    beforeDestroy() {
        //卸载函数
        //卸载粘性表头
        Stickyfill.remove(this.$refs.sticky);
        window.onscroll = null;
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style lang="less">
.f-table {
    .f-table-header {
        font-size: 16px;
        // box-shadow: 0px 6px 10px -5px #a5a5a5;

        table tr th,
        table tr td {
            border: 1px solid #eee;
            border-bottom: 0px solid #eee;
            padding: 10px 10px;
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
    }

    .fixed-header-left {
        font-size: 16px;

        table tr th,
        table tr td {
            border: 1px solid #eee;
            border-bottom: 0px solid #eee;
            padding: 10px 10px;
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
    }
}
</style>
