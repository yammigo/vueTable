<template>
<div :class="baseClass">
    <div v-show="touchCeiling" ref="scrollBarConsm" :style="{...bodyWrapperStyles,width:bodyWidth+'px'}" style="overflow-x:scroll;width:100%;position:fixed;z-index:10;bottom:0px;" @scroll.passive="handScrollbar">
        <div :style="tableStyles" style="height:20px;"></div>
    </div>
    <div class="fui-table-wrapper">
        <div ref="headerWrapper" :style="headerStyles.headerWrapper" :class="{
          'fui-table-overflow-y': scrollY,
        }" class="fui-table-header" @mousewheel="handleMouseWheel" @DOMMouseScroll="handleMouseWheel">
            <table-head ref="head" :columns="allColumns" :data="rebuildData" :column-rows="columnRows" :styles="tableStyles" :columns-width="columnsWidth" :header-height="isTableBodyDiv ? turbo.headerHeight : ''" />
        </div>
        <div v-if="touchCeiling" :class="{
          'fui-table-overflow-y': scrollY,
        }" class="fui-table-header">
            <table-head :columns="allColumns" :data="rebuildData" :column-rows="columnRows" :styles="tableStyles" :columns-width="columnsWidth" :header-height="isTableBodyDiv ? turbo.headerHeight : ''" />
        </div>
        <div v-if="data && data.length" ref="bodyWrapper" :class="{
          'fui-table-overflow-x': scrollX,
          'fui-table-overflow-y': scrollY,
          'fui-table-scrolling-left': scrollPosition === 'left',
          'fui-table-scrolling-right': scrollPosition === 'right',
          'fui-table-scrolling-middle': scrollPosition === 'middle',
        }" :style="bodyWrapperStyles" class="fui-table-body" @scroll.passive="handleBodyScroll">
            <table-body-div v-if="isTableBodyDiv" ref="body" :columns="allColumns" :columns-width="columnsWidth" :styles="tableStyles" :data="rebuildData" :row-height="turbo.rowHeight" />
            <table-body v-else ref="body" :columns="allColumns" :columns-width="columnsWidth" :styles="tableStyles" :data="rebuildData" />
        </div>
        <div v-if="!data || !data.length" class="fui-table-no-data">
            <slot name="no-data">
                <table cellspacing="0" cellpadding="0" border="0">
                    <tbody>
                        <tr>
                            <td :colspan="allColumns.length">
                                <div :style="bodyWrapperStyles" class="fui-table-no-data-text">{{ _noDataText }}</div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </slot>
        </div>
        <div v-if="isLeftFixed " :style="fixedLeftTableStyles" :class="{
          'fui-table-fixed-left': true,
          'fui-table-fixed-left__ceiling': touchCeiling,
        }" @mousewheel="handleFixedMouseWheel" @DOMMouseScroll="handleFixedMouseWheel">
            <div ref="leftHeaderWrapper" :style="headerStyles.leftHeaderWrapper" class="fui-table-fixed-header">
                <table-head :columns="leftColumns" :data="rebuildData" :column-rows="leftFixedColumnRows" :styles="tableStyles" :columns-width="columnsWidth" :header-height="isTableBodyDiv ? turbo.headerHeight : ''" fixed="left" />
            </div>
            <div v-if="touchCeiling" class="fui-table-fixed-header">
                <table-head :columns="leftColumns" :data="rebuildData" :column-rows="leftFixedColumnRows" :styles="tableStyles" :columns-width="columnsWidth" :header-height="isTableBodyDiv ? turbo.headerHeight : ''" fixed="left" />
            </div>
            <div v-if=" data && data.length" ref="leftBodyWrapper" :style="fixedBodyWrapperStyles" class="fui-table-fixed-body">
                <table-body-div v-if="isTableBodyDiv" :columns="leftColumns" :columns-width="columnsWidth" :styles="tableStyles" :data="rebuildData" :row-height="turbo.rowHeight" fixed="left" />
                <table-body v-else :columns="leftColumns" :columns-width="columnsWidth" :styles="tableStyles" :data="rebuildData" fixed="left" />
            </div>
        </div>
        <div v-if="isRightFixed " :style="fixedRightTableStyles" :class="{
          'fui-table-fixed-right': true,
          'fui-table-fixed-right__ceiling': touchCeiling,
        }" @mousewheel="handleFixedMouseWheel" @DOMMouseScroll="handleFixedMouseWheel">
            <div ref="rightHeaderWrapper" :style="headerStyles.rightHeaderWrapper" class="fui-table-fixed-header">
                <table-head :columns="rightColumns" :data="rebuildData" :column-rows="rightFixedColumnRows" :styles="tableStyles" :columns-width="columnsWidth" :header-height="isTableBodyDiv ? turbo.headerHeight : ''" fixed="right" />
            </div>
            <div v-if="touchCeiling" class="fui-table-fixed-header">
                <table-head :columns="rightColumns" :data="rebuildData" :column-rows="rightFixedColumnRows" :styles="tableStyles" :columns-width="columnsWidth" :header-height="isTableBodyDiv ? turbo.headerHeight : ''" fixed="right" />
            </div>
            <div v-if="data && data.length" ref="rightBodyWrapper" :style="fixedBodyWrapperStyles" class="fui-table-fixed-body">
                <table-body-div v-if="isTableBodyDiv" :data="rebuildData" :columns="rightColumns" :columns-width="columnsWidth" :styles="tableStyles" :row-height="turbo.rowHeight" fixed="right" />
                <table-body v-else :data="rebuildData" :columns="rightColumns" :columns-width="columnsWidth" :styles="tableStyles" fixed="right" />
            </div>
        </div>
        <!-- 当右侧固定同时出现滚动条时表头与滚动条补齐 -->
        <!-- <div v-if="scrollY" :style="fixedRightHeaderBarStyle" class="fui-table-fixed-right-header" /> -->
    </div>
    <div v-show="showResizeLine" ref="resizeLine" class="fui-table-resizeline" />
</div>
</template>

<script>
import {
    isOneOf
} from '../utils/helper.js';
import Utils from '../utils/utils.js';
import tableHead from './table-head-t.vue';
import tableBody from './table-body-t.vue';
import tableBodyDiv from './table-body-div.vue';
import elementResizeDetectorMaker from 'element-resize-detector';
import {
    setColumnsData,
    handleColumnsOrder,
    getFlattenColumns,
    handleColumns2Rows
} from './util.js';
import {
    on,
    off,
    getScrollBarWidth,
    getStyle
} from '../utils/dom.js';
import throttle from 'lodash.throttle';
export default {
    name: 'jiantao-table',
    components: {
        tableHead,
        tableBody,
        tableBodyDiv
    },
    // mixins: [locale],
    props: {
        data: {
            type: Array,
            default () {
                return [];
            }
        },
        columns: {
            type: Array,
            default () {
                return [];
            }
        },
        height: {
            type: [String, Number],
            default: ''
        },
        noDataText: {
            type: String,
            default: ''
        },
        ceilingOptions: {
            type: Object,
            default () {
                return {
                    enabled: true,
                    paddingTop: 0,
                    boundariesElement: document
                };
            }
        },
        turbo: {
            type: Object,
            default () {
                return {
                    mode: 'div',
                    rowHeight: 'auto',
                    headerHeight: 'auto'
                };
            }
        },
        //
        columnResizable: {
            type: Boolean,
            default: true
        },
        border: {
            type: [Boolean, String],
            default: true,
            validator(value) {
                return typeof value === 'boolean' || isOneOf(value, ['cellspacing']);
            }
        }
    },
    data() {
        return {
            cloneColumns: [],
            allColumns: [],
            columnRows: [],
            rightFixedColumnRows: [],
            rightColumns: [],
            leftFixedColumnRows: [],
            leftColumns: [],
            //body可滚动的宽度
            bodyWidth: 0,
            // 最后一列
            lastColumn: null,
            //
            rebuildData: [],
            // table宽度
            tableWidth: 0,
            // 左侧固定宽度
            leftFixedWidth: 0,
            // 右侧固定宽度
            rightFixedWidth: 0,
            // x轴是否有滚动条
            scrollX: false,
            // Y轴是否有滚动条
            scrollY: false,
            // 滚动条宽度
            scrollBarWidth: 0,
            // 每列宽度
            columnsWidth: {},
            headerHeight: 0,
            // body高度
            bodyHeight: 0,
            // body的真实高度
            bodyOffsetHeight: 0,
            // 左右滚动时记录滚动的位置，以判断左右fixed部分是否显示阴影
            scrollPosition: '',
            observer: null,
            // 表格是否抵达视口顶端
            touchCeiling: false,
            headerStyles: {
                headerWrapper: {},
                leftHeaderWrapper: {},
                rightHeaderWrapper: {}
            },
            // 列宽拖拽线
            showResizeLine: false
        };
    },
    computed: {
        _noDataText() {
            return '暂无数据';
        },
        baseClass() {
            const classArr = [`jiantao-table`];
            if (!this.border) {
                classArr.push(`jiantao-table-no-border`);
            } else if (this.border === 'cellspacing') {
                classArr.push(`jiantao-table-cellspacing-border`);
            }
            return classArr;
        },
        isLeftFixed() {
            return this.columns.some(column => column.fixed && column.fixed === 'left');
        },
        isRightFixed() {
            return this.columns.some(column => column.fixed && column.fixed === 'right');
        },
        tableStyles() {
            // table style
            const style = {};
            let width = 0;
            if (this.tableWidth) {
                width = this.tableWidth - (this.scrollY ? this.scrollBarWidth : 0);
                style._width = width;
                style.width = `${width}px`;
            }
            return style;
        },
        bodyWrapperStyles() {
            // table body wrapper style
            const style = {};
            const key = this.bodyOffsetHeight < this.bodyHeight ? 'max-height' : 'height';
            if (this.bodyHeight) {
                style[key] = `${this.bodyHeight}px`;
            }
            return style;
        },
        fixedBodyWrapperStyles() {
            // fixed table body wrapper style
            const style = {};
            const key = this.bodyOffsetHeight < this.bodyHeight ? 'max-height' : 'height';
            if (this.bodyHeight) {
                style[key] = `${this.bodyHeight - (this.scrollX ? this.scrollBarWidth : 0)}px`;
            }
            return style;
        },
        fixedLeftTableStyles() {
            // fixed left table style
            const style = {};
            let width = 0;
            this.allColumns.forEach(column => {
                if (column.fixed && column.fixed === 'left') {
                    width += this.columnsWidth[column._id] ? this.columnsWidth[column._id].width : 0;
                }
            });
            style._width = width;
            style.width = `${width}px`;
            if (this.scrollX && this.data && this.data.length) {
                style.bottom = `${this.scrollBarWidth}px`;
            }

            return style;
        },
        fixedRightTableStyles() {
            // fixed right table style
            const style = {};
            let width = 0;
            this.allColumns.forEach(column => {
                if (column.fixed && column.fixed === 'right') {
                    width += this.columnsWidth[column._id] ? this.columnsWidth[column._id].width : 0;
                }
            });
            style._width = width;
            style.width = `${width}px`;
            if (this.scrollX && this.data && this.data.length) {
                style.bottom = `${this.scrollBarWidth}px`;
            }
            if (this.scrollY) {
                style.right = `${this.scrollBarWidth}px`;
            }
            return style;
        },
        fixedRightHeaderBarStyle() {
            // fixed right header bar, if scrollY === true
            return {
                width: `${this.scrollBarWidth}px`,
                height: `${this.headerHeight}px`
            };
        },
        isCeiling() {
            return this.ceilingOptions.enabled;
        },
        isTableBodyDiv() {
            return this.turbo.mode === 'div';
        }
    },
    watch: {
        data: {
            immediate: true,
            deep: true,
            handler() {
                this.handleTableData(this.data);
                if (this.rebuildData.length) {
                    this.fixedHeader();
                }
            }
        },
        columns: {
            immediate: true,
            deep: true,
            handler() {
                const cloneColumns = setColumnsData(this.columns);
                const initColumns = handleColumnsOrder(cloneColumns);
                const centerColumns = initColumns.left;
                // const leftColumns = initColumns.left;
                const rightColumns = initColumns.right;
                const allColumns = getFlattenColumns(centerColumns);
                const allColumnsForHead = handleColumns2Rows(centerColumns);
                let leftAllColumns = allColumns;
                let leftAllColumnsForHead = allColumnsForHead;
                let rightAllColumns = getFlattenColumns(rightColumns, 'right');
                let rightAllColumnsForHead = handleColumns2Rows(rightColumns);
                if (this.isTableBodyDiv) {
                    leftAllColumns = this.getFixedAllColumns(allColumns, 'left');
                    leftAllColumnsForHead = this.getFixedColumnsForHead(allColumnsForHead, 'left');
                    rightAllColumns = this.getFixedAllColumns(rightAllColumns, 'right');
                    rightAllColumnsForHead = this.getFixedColumnsForHead(rightAllColumnsForHead, 'right');
                }
                // 每一列设置id
                this.cloneColumns = cloneColumns;
                this.lastColumn = allColumns[allColumns.length - 1];
                // body需要的列
                this.allColumns = allColumns;
                // head渲染的行
                this.columnRows = allColumnsForHead;
                // fixed = left
                this.leftColumns = leftAllColumns;
                // fixed = left
                this.leftFixedColumnRows = leftAllColumnsForHead;
                // fixed = right body需要的列，fixed=right在前
                this.rightColumns = rightAllColumns;
                // fixed = right head渲染的行，fixed=right在前
                this.rightFixedColumnRows = rightAllColumnsForHead;
                // 重置列宽
                this.handleResize();
            }
        },
        scrollY() {
            this.handleResize();
        },
        height() {
            this.fixedHeader();
        },
        'ceilingOptions.boundariesElement': function (newBoundariesElement, oldBoundariesElement) {
            if (this.isCeiling) {
                off(oldBoundariesElement, 'scroll', this.handleBoundariesElementScroll);
                on(
                    newBoundariesElement,
                    'scroll',
                    throttle(() => {
                        this.handleBoundariesElementScroll();
                    }, 50)
                );
            }
        }
    },
    mounted() {
        this.scrollBarWidth = getScrollBarWidth();
        this.tableResize();
        // 监听table resize，调整列宽
        if (!this.isTableBodyDiv) {
            this.observer = elementResizeDetectorMaker();
            this.observer.listenTo(this.$el, () => {
                this.tableResize();
            });
        }
        on(window, 'resize', this.tableResize);
        this.$on('on-visible-change', value => {
            if (value) {
                this.tableResize();
            }
        });

        // 监听外部滚动，调整表头position
        if (this.isCeiling) {
            on(
                this.ceilingOptions.boundariesElement,
                'scroll',
                throttle(() => {
                    this.handleBoundariesElementScroll();
                }, 50)
            );
        }
    },
    beforeDestroy() {
        if (this.isCeiling) {
            off(this.ceilingOptions.boundariesElement, 'scroll', this.handleBoundariesElementScroll);
        }
        if (this.observer && this.$el) {
            this.observer.uninstall(this.$el);
        }
    },
    methods: {
        getFixedAllColumns(columns, fixed) {
            const clmArr = [];
            columns.some(column => {
                if (column.fixed === fixed) {
                    clmArr.push(column);
                    return false;
                }
                return true;
            });
            return clmArr;
        },
        getFixedColumnsForHead(columnsForHead, fixed) {
            const newColumn = [];
            for (let index = 0; index < columnsForHead.length; index++) {
                const rowColumns = columnsForHead[index];
                // const fixedIndex = rowColumns.findIndex((column) => column.fixed !== fixed);
                newColumn.push(this.getFixedAllColumns(rowColumns, fixed));
            }
            return newColumn;
        },
        // data 初始化
        handleTableData(data) {
            const tableArr = [];
            data.forEach((row, index) => {
                const newRow = Utils.deepCopy(row);
                newRow.isHover = false;
                newRow._index = index;
                newRow.rowClassName = row.rowClassName || [];
                if (newRow.checked) {
                    newRow.isChecked = newRow.checked;
                } else {
                    newRow.isChecked = false;
                }
                if (newRow.expand) {
                    newRow.isExpand = newRow.expand;
                } else {
                    newRow.isExpand = false;
                }
                tableArr.push(newRow);
            });
            this.rebuildData = tableArr;
        },
        fixedHeader() {
            if (this.height && !this.isCeiling && this.$refs.headerWrapper) {
                this.$nextTick(() => {
                    this.headerHeight = this.$refs.headerWrapper.offsetHeight;
                    this.bodyHeight = this.height - this.headerHeight;
                    this.$nextTick(() => {
                        this.fixedBody();
                    });
                });
            } else {
                this.bodyHeight = 0;
                this.$nextTick(() => {
                    this.fixedBody();
                });
            }
        },
        fixedBody() {
            if (!this.$refs.bodyWrapper || !this.data || this.data.length === 0) {
                return;
            }
            const $bodyEl = this.$refs.body.$el;
            this.bodyOffsetHeight = $bodyEl.offsetHeight;
            this.scrollY = this.bodyHeight ? $bodyEl.offsetHeight + (this.scrollX ? this.scrollBarWidth : 0) > this.bodyHeight : false;
        },
        tableResize() {
            // 提供业务方调用
            this.$nextTick(() => {
                this.fixedHeader();
                this.handleResize();
                if (this.isCeiling) {
                    this.handleBoundariesElementScroll();
                     this.bodyWidth = this.$refs.bodyWrapper.offsetWidth-1;
                }

               

            });
        },
        // 处理列的宽度
        handleResize() {
            if (!this.$el) return;
            const columnsWidth = {};
            // 获取当前容器的宽度
            const tableWidth = this.$el.offsetWidth - 1;
            // 设置无width的列初始width为80
            const initColumnWidth = 80;
            // 已设置了width的column的width总和
            let hasUsedWidth = 0;
            // 没有设置width的列的最小widht综合
            let flexMinWidth = 0;
            // 最小需要table宽度
            let tabelMinWidth = 0;
            // 需要调整宽度的列选项
            const flexColumns = this.allColumns.filter(column => {
                return typeof column.width !== 'number';
            });
            // Y轴滚动条宽度
            const scrollYWidth = this.scrollY ? this.scrollBarWidth : 0;
            // 根据column的width和minwidth属性获取table需要的最小宽度
            this.allColumns.forEach(column => {
                if (column.width) {
                    hasUsedWidth += parseInt(column.width);
                } else {
                    flexMinWidth += parseInt(column.minWidth) || initColumnWidth;
                }
                columnsWidth[column._id] = {
                    width: column.width || column.minWidth || initColumnWidth
                };
            });
            tabelMinWidth = hasUsedWidth + flexMinWidth + scrollYWidth;
            // 最小需要宽度大于table的宽度，需要横向滚动条,设置table width
            this.scrollX = tabelMinWidth > tableWidth;
            // this.tableWidth = Math.max(tabelMinWidth, tableWidth);
            if (flexColumns.length > 0 && tabelMinWidth < tableWidth) {
                // 剩余可调整的宽度
                const usableFlexWidth = tableWidth - tabelMinWidth;
                // 与minwidth的比例
                const flexRatio = usableFlexWidth / flexMinWidth;
                // 考虑会有小数省略的情况，在最后重新给第一项赋值
                let noFirstWidth = 0;
                // 设置无width属性的列的显示宽度
                flexColumns.forEach((column, index) => {
                    if (index === 0) return;
                    const width = (column.minWidth || initColumnWidth) + Math.floor((column.minWidth || initColumnWidth) * flexRatio);
                    columnsWidth[column._id] = {
                        width: width
                    };
                    noFirstWidth += width;
                });
                columnsWidth[flexColumns[0]._id] = {
                    width: flexMinWidth + usableFlexWidth - noFirstWidth
                };
            }
            this.tableWidth =
                Object.keys(columnsWidth).reduce((acc, item) => {
                    return parseInt(columnsWidth[item].width) + acc;
                }, 0) + scrollYWidth;
            this.columnsWidth = columnsWidth;
        },
        updateTableWidth(resizeColumn, columnWidth) {
            // 获取当前容器的宽度
            // Y轴滚动条宽度
            const scrollYWidth = this.scrollY ? this.scrollBarWidth : 0;
            // 表格可用区域的宽度
            const tableWidth = this.$el.offsetWidth - 1;

            this.columnsWidth[resizeColumn._id].width = columnWidth;
            // cloneColumn 对应的列也作出调整，用于对外传出变量
            resizeColumn.width = columnWidth;
            const curTableWidth =
                Object.keys(this.columnsWidth).reduce((acc, item) => {
                    return this.columnsWidth[item].width + acc;
                }, 0) + scrollYWidth;
            this.scrollX = curTableWidth > tableWidth;
            if (this.scrollX) {
                this.tableWidth = curTableWidth;
            } else {
                // 表格中最后一行，当表格实际宽度小于父容器宽度时最后一列用来填充剩余宽度,
                this.resizeLastColumnWidth(tableWidth - curTableWidth);
                this.tableWidth = tableWidth;
            }
            if (this.isCeiling) {
                this.headerStyles.leftHeaderWrapper.width = this.fixedLeftTableStyles.width;
                this.headerStyles.rightHeaderWrapper.width = this.fixedRightTableStyles.width;
            }
            this.$emit('column-width-resize', this.cloneColumns, resizeColumn);
        },
        resizeLastColumnWidth(resizeWidth) {
            this.lastColumn.width += resizeWidth;
            this.columnsWidth[this.lastColumn._id].width += resizeWidth;
        },
        // 处理某一行选中
        handleColumnSelect(value, row) {
            row.isChecked = !row.isChecked;
            this.rebuildData.splice(row._index, 1, row);
            const selection = this.getSelection();
            this.$emit('select-change', selection, {
                checked: value,
                row: row
            });
        },

        // 处理全选
        handleSelectAll(status) {
            this.data.forEach((row, index) => {
                if (!this.rebuildData[index].isDisabled) {
                    this.rebuildData[index].isChecked = status;
                }
            });
            const selection = this.getSelection();
            if (status) {
                this.$emit('select-all', selection);
            }
            this.$emit('select-change', selection, {});
        },
        // 获取选中项
        getSelection() {
            let selectArr = [];
            this.rebuildData.forEach(row => {
                row.isChecked && selectArr.push(row);
            });
            selectArr = selectArr.slice();
            return selectArr;
        },
        // 表头排序
        handleSortClick(column) {
            const sortType = column.sortType === 'desc' ? 'asc' : 'desc';
            const key = column.key;
            column.sortType = sortType;
            this.$emit('sort-change', column, key, sortType);
        },
        // 展开项
        handleExpandClick(row) {
            // todo
            const status = !row.isExpand;
            const index = row._index;
            row.isExpand = status;
            this.rebuildData.splice(row._index, 1, row);
            this.$emit('on-expand', {
                row,
                index,
                status
            });
        },
        // 滚轮事件
        handleMouseWheel(event) {
            // event.preventDefault();
            // 水平滚动
            const $bodyWrapper = this.$refs.bodyWrapper;
            if (!$bodyWrapper) {
                return;
            }
            let deltaX = event.deltaX;
            if (!deltaX && event.detail) {
                deltaX = event.detail * 40;
            }
            $bodyWrapper.scrollLeft += deltaX;
            this.getScrollPosition($bodyWrapper.scrollLeft);
        },
        // fixed的滚轮事件
        handleFixedMouseWheel(event) {
            const $bodyWrapper = this.$refs.bodyWrapper;
            if (!$bodyWrapper) {
                return;
            }
            let deltaY = event.deltaY;
            // wheelDelta是120的倍数
            // firefox DOMMouseScroll 鼠标滚轮信息保存在detail中，-3的倍数
            if (!deltaY && event.detail) {
                deltaY = event.detail * 40;
            }
            if (!deltaY && event.wheelDeltaY) {
                deltaY = -event.wheelDeltaY;
            }
            if (!deltaY && event.wheelDelta) {
                deltaY = -event.wheelDelta;
            }
            const currentScrollTop = $bodyWrapper.scrollTop;
            if (deltaY < 0 && currentScrollTop > 0) {
                event.preventDefault();
            }
            if (deltaY > 0 && $bodyWrapper.scrollHeight - $bodyWrapper.offsetHeight - currentScrollTop > 0) {
                event.preventDefault();
            }
            $bodyWrapper.scrollTop += deltaY;
        },
        //虚拟滚动条
        handScrollbar(event) {
            let scrollLeft = event.target.scrollLeft;
            this.$refs.headerWrapper.scrollLeft = scrollLeft;
            this.$refs.bodyWrapper.scrollLeft = scrollLeft;
            let scrollTop = this.$refs.bodyWrapper.scrollTop;
            if (this.isLeftFixed) {
                this.$refs.leftBodyWrapper.scrollTop = scrollTop;
            }
            if (this.isRightFixed) {
                this.$refs.rightBodyWrapper.scrollTop = scrollTop;
            }
            this.getScrollPosition(scrollLeft);
        },
        // body滚动
        handleBodyScroll(event) {
            const scrollLeft = event.target.scrollLeft;
            const scrollTop = event.target.scrollTop;
            this.$refs.scrollBarConsm.scrollLeft = scrollLeft;
            this.$refs.headerWrapper.scrollLeft = scrollLeft;
            if (this.isLeftFixed) {
                this.$refs.leftBodyWrapper.scrollTop = scrollTop;
            }
            if (this.isRightFixed) {
                this.$refs.rightBodyWrapper.scrollTop = scrollTop;
            }
            this.getScrollPosition(scrollLeft);
        },
        getScrollPosition(scrollLeft) {
            const maxScroll = this.tableStyles._width - this.$refs.bodyWrapper.offsetWidth + (this.scrollY ? this.scrollBarWidth : 0);
            if (scrollLeft >= maxScroll) {
                this.scrollPosition = 'right';
            } else if (scrollLeft === 0) {
                this.scrollPosition = 'left';
            } else {
                this.scrollPosition = 'middle';
            }
        },
        //
        handleRowMouseEnter(row) {
            row.isHover = true;
            this.rebuildData.splice(row._index, 1, row);
        },
        //
        handleRowMouseLeave(row) {
            row.isHover = false;
            this.rebuildData.splice(row._index, 1, row);
        },
        //
        handleRowClick(row, index) {
            this.$emit('row-click', row, index);
        },
        handleBoundariesElementScroll() {
            // 获取表格容器相对视口距离
            const wrapperBounding = this.$el.getBoundingClientRect();

            const elementsNeedChange = [this.$refs.headerWrapper, this.$refs.leftHeaderWrapper, this.$refs.rightHeaderWrapper];
            const rightHeaderIndex = 2;

            const ceilingTop = this.ceilingOptions.paddingTop;
            const ceilingTopDistance = ceilingTop;
            const ceilingBottomDistance = ceilingTop + this.$refs.headerWrapper ? this.$refs.headerWrapper.getBoundingClientRect().height : 0;

            const headerStyles = [];
            // 如果被覆盖, 则调整表头的position为fixed
            if (wrapperBounding.top <= ceilingTopDistance && wrapperBounding.bottom >= ceilingBottomDistance) {
                // this.touchCeiling = true;
                //判断是否锁定滚动条
                this.touchCeiling = this.$refs.bodyWrapper.getBoundingClientRect().bottom > window.innerHeight;
                // if (!this.$refs.bodyWrapper.getBoundingClientRect().bottom > window.innerHeight) {
                //     this.touchCeiling = false;
                // }
                elementsNeedChange.forEach((elem, index) => {
                    let headerStyle;
                    if (elem) {
                        const parentNode = elem.parentNode;
                        const bounding = parentNode.getBoundingClientRect();

                        const {
                            left
                        } = bounding;
                        // 右固定列的表头不需要加 border-left, 其他两个需要加
                        if (index !== rightHeaderIndex) {
                            const leftBorderWidth = 1;
                            const width = `${parseFloat(getStyle(parentNode, 'width')) + leftBorderWidth}px`;
                            headerStyle = {
                                position: 'fixed',
                                left: `${left - leftBorderWidth}px`,
                                top: `${ceilingTop}px`,
                                width: width,
                                overflow: 'hidden',
                                'z-index': index + 1,
                                'border-top': '1px solid #DADFE3',
                                'border-left': `${leftBorderWidth}px solid #DADFE3`
                            };
                        } else {
                            headerStyle = {
                                position: 'fixed',
                                left: `${left}px`,
                                top: `${ceilingTop}px`,
                                width: getStyle(parentNode, 'width'),
                                overflow: 'hidden',
                                'z-index': index + 1,
                                'border-top': '1px solid #DADFE3'
                            };
                        }
                    }
                    headerStyles.push(headerStyle);
                });

                // 如果没有被覆盖，则调整表头的position为static
            } else {
                this.touchCeiling = false;
                elementsNeedChange.forEach(elem => {
                    let headerStyle;
                    if (elem) {
                        const parentNode = elem.parentNode;
                        const width = getStyle(parentNode, 'width');
                        headerStyle = {
                            position: 'static',
                            border: 'none',
                            width: width
                        };
                    }
                    headerStyles.push(headerStyle);
                });
            }

            this.headerStyles = {
                headerWrapper: headerStyles[0] || {},
                leftHeaderWrapper: headerStyles[1] || {},
                rightHeaderWrapper: headerStyles[2] || {}
            };
        }
    }
};
</script>

<style>
@import './table.css';
</style>
