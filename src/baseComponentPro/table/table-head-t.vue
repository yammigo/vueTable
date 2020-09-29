<template>
  <table
    :style="fixed&&headerHeight ? {} : styles"
    cellspacing="0"
    cellpadding="0"
    border="0"
  >
    <colgroup>
      <template v-for="column in columns">
        <col
          :key="column.id"
          :name="column.id"
          :width="columnsWidth[column._id]?columnsWidth[column._id].width:column.width||''"
          :align="column.align">
      </template>
    </colgroup>
    <thead>
      <tr
        v-for="(rows, rindex) in headRows"
        :key="rindex">
        <th
          v-for="(column , cindex) in rows"
          :key="column._id"
          :colspan="column.colSpan"
          :rowspan="column.rowSpan"
          :class="getThClass(column)"
          :id="column._id"
          @click="handleThClick(column)">
          <head-ceil
            :style="{
              width: getColumnWidth(column),
              height: getColumnHeight(column),
              overflow: 'hidden',
              cursor: resizing ? 'col-resize' : ''
            }"
            :data="data"
            :column="column"
            :column-index="cindex"
          />
          <div
            v-if="isColumnResizable&&(cindex !==rows.length -1 || isShowResizeBar(column))"
            class="bui-table-th-resize"
            @mousedown.stop="handleMouseDown(column, $event)"
            @mousemove.stop="handleMouseMove(column, $event)"/>
        </th>

      </tr>
    </thead>
  </table>
</template>

<script>

import HeadCeil from './head-ceil.vue';
export default {
  name: `table-head`,
  components: {
    HeadCeil,
  },
  props: {
    columns: {
      type: Array,
      default() {
        return [];
      },
    },
    data: {
      type: Array,
      default() {
        return [];
      },
    },
    columnsWidth: {
      type: Object,
      default() {
        return {};
      },
    },
    styles: {
      type: Object,
      default() {
        return {};
      },
    },
    columnRows: {
      type: Array,
      default() {
        return [];
      },
    },
    headerHeight: {
      type: String,
      default: '',
    },
    fixed: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      resizing: false,
      resizeColumn: null,
      resizeState: {
        startMouseLeft: 0,
        startLeft: 0,
        startColumnLeft: 0,
        tableLeft: 0,
      },
    };
  },
  computed: {
    isSelectAll() {
      let isSelectAll = true;
      if (!this.data.length) isSelectAll = false;
      for (let i = 0; i < this.data.length; i++) {
        if (!this.data[i].isChecked && !this.data[i].isDisabled) {
          isSelectAll = false;
          break;
        }
      }
      return isSelectAll;
    },
    headRows() {
      if (this.columnRows.length > 1) {
        return this.columnRows;
      }
      return [this.columns];
    },
    isColumnResizable() {
      const {turbo, columnResizable} = this.$parent;
      return turbo.mode === 'div' && !!turbo.headerHeight && !!turbo.rowHeight && columnResizable;
    },

  },
  methods: {
    getColumnWidth(column) {
      if (column.children) {
        const width = this.getColumnChildWidth(column.children);
        return width ? parseInt(width) + 'px' : '';
      }
      return this.columnsWidth[column._id] ? parseInt(this.columnsWidth[column._id].width) + 'px' : '';
    },
    getColumnChildWidth(childrens) {
      if (!Array.isArray(childrens)) {
        return 0;
      }
      let temp = 0;
      childrens.map((item)=>{
        if (item.children) {
          temp += this.getColumnChildWidth(item.children);
        } else {
          temp += this.columnsWidth[item._id] ? this.columnsWidth[item._id].width : item.width || item.minWidth || 0;
        }
      });
      return temp;
    },
    getColumnHeight(column) {
      // 需要考虑到合并行的border-bottom-width
      return this.headerHeight ? column.rowSpan * parseInt(this.headerHeight) + column.rowSpan - 1 + 'px' : '';
    },
    getThClass(column) {
      return {
        'bui-table-th-pointer': column.sortable,
        'bui-table-th-hidden': this.fixed && this.fixed !==column.fixed || (!this.fixed && column.fixed),
      };
    },
    handleThClick(column) {
      if (this.resizing) return;
      if (column.sortable) {
        this.$parent.handleSortClick(column);
      }
    },
    handleMouseDown(column, event) {
      if (!this.isColumnResizable) return;
      this.resizing = true;
      const curParent = this.$parent;
      const tableEl = curParent.$el;
      let tableLeft = 0;
      let columnEl;
      let columnRect;
      let minLeft;
      try {
        tableLeft = tableEl.getBoundingClientRect().left;
        columnEl = this.$el.querySelector(`#${this.resizeColumn._id}`);
        columnRect = columnEl.getBoundingClientRect();
        minLeft = columnRect.left - tableLeft + 60;
      } catch (error) {
        this.resizing = false;
        // console.log('遇到错误啦');
        return;
      }

      curParent.showResizeLine = true;

      this.resizeState = {
        // 鼠标位置
        startMouseLeft: event.clientX,
        // 列开始移动的位置
        startLeft: columnRect.right - tableLeft,
        // 列左侧的位置
        startColumnLeft: columnRect.left - tableLeft,
        // 表格左侧的位置
        tableLeft,
      };

      const resizeLineEl = curParent.$refs.resizeLine;
      resizeLineEl.style.left = this.resizeState.startLeft + 'px';
      const onselectstarttFn = document.onselectstart || null;
      const ondragstartFn = document.onselectstart || null;
      document.onselectstart = function() {
        return false;
      };
      document.ondragstart = function() {
        return false;
      };
      // 拖拽过程中设置拖拽线的位置
      const handleMouseMove = (event) => {
        const tempLeft = event.clientX - this.resizeState.startMouseLeft;
        let lineLeft = this.resizeState.startLeft + tempLeft;
        lineLeft = Math.max(minLeft, lineLeft);
        resizeLineEl.style.left = lineLeft + 'px';
      };
      // 拖拽结束
      const handleMouseUp = () => {
        if (!this.resizing) return;
        const {
          startColumnLeft,
          // startLeft,
        } = this.resizeState;
        const columnWidth = parseInt(resizeLineEl.style.left, 10) - startColumnLeft;
        if (this.columnsWidth[this.resizeColumn._id]) {
          curParent.updateTableWidth(this.resizeColumn, columnWidth);
        }
        setTimeout(() =>{
          this.resizing = false;
          this.resizeColumn = null;
          this.resizeState = {};
        }, 0);


        curParent.showResizeLine = false;

        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.onselectstart = onselectstarttFn;
        document.ondragstart = ondragstartFn;
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    handleMouseMove(column, event) {
      // th
      if (!column || !this.isColumnResizable || this.resizing) {
        return;
      }
      const resizeColumn = this.getResizeColumn(column);
      let target;
      try {
        target = this.$el.querySelector(`#${resizeColumn._id}`);
      } catch (error) {
        return;
      }
      const thRect = target.getBoundingClientRect();
      // 预览可以进行拖拽的空间
      if (thRect.right - event.pageX < 8) {
        this.resizeColumn = resizeColumn;
      } else if (!this.resizing) {
        this.resizeColumn = null;
      }
    },
    getResizeColumn(column) {
      if (column.children && column.children.length) {
        return this.getResizeColumn(column.children[column.children.length - 1]);
      }
      return column;
    },
    // 最后一列不显示拖拽
    isShowResizeBar(column, columns = this.$parent.cloneColumns) {
      const lastColumn = columns[columns.length -1];
      if (column._id === lastColumn._id) {
        return false;
      } else if (lastColumn.children && lastColumn.children.length) {
        return this.isShowResizeBar(column, lastColumn.children);
      }
      return true;
    },
  },
};
</script>