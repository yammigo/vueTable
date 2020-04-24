
<template>
  <div
    :style="fixed&&rowHeight ? {} : styles"
  >
    <template v-for="(rdata, rindex) in data">
      <div
        :key="rindex"
        :class="getRowClass(rdata)"
        :style="{
          position: 'relative',
          height: rowHeight,
        }"
        class="bui-table-tr"
        @click="handleRowClick(rdata, rindex)"
        @mouseenter="handleRowMouseEnter(rdata)"
        @mouseleave="handleRowMouseLeave(rdata)"
      >
        <div
          v-for="(column) in columns"
          :key="column._id"
          :class="getColumnClass(column)"
          :style="getColumnStyle(column)"
          class="bui-table-column"
        >
          <ceil
            v-if="isCeilShow(column)"
            :row="rdata"
            :column="column"
            :row-index="rindex"
            :fixed="fixed"
          />
        </div>
      </div>
      <div
        v-if="rdata.isExpand"
        :key="rindex+'expand'"
        :class="trExpandClass"
      >
        <div class="bui-table-column bui-table-td-expand">
          <expand
            :row="rdata"
            :render="expandRender"
            :index="rindex"
          />
        </div>

      </div>
    </template>
  </div>
</template>

<script>
import Expand from './expand.vue';
import Ceil from './ceil.vue';

export default {
  name: 'TableBodyV',
  components: {
    Expand,
    Ceil,
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
    fixed: {
      type: String,
      default: '',
    },
    rowHeight: {
      type: String,
      default: '',
    },
  },
  data() {
    return {};
  },
  computed: {
    expandRender() {
      let render = function() {
        return '';
      };
      for (let i = 0; i < this.columns.length; i++) {
        const column = this.columns[i];
        if (column.type && column.type === 'expand') {
          if (column.renderExpand) render = column.renderExpand;
        }
      }
      return render;
    },
    trExpandClass() {
      return {
        'bui-table-tr-expand-hidden': !!this.fixed,
      };
    },
    renderColumns() {
      return this.columns.slice(this.$parent.renderColumns.startIndex, this.$parent.renderColumns.endIndex);
    },
  },
  methods: {
    isCeilShow(column) {
      if (!this.rowHeight) {
        return true;
      }
      return (this.fixed && column.fixed=== this.fixed) || (!this.fixed && !column.fixed);
    },
    handleRowClick(row, index) {
      // event.stopPropagation();
      this.$parent.handleRowClick(row, index);
    },
    handleRowMouseEnter(row) {
      this.$parent.handleRowMouseEnter(row);
    },
    handleRowMouseLeave(row) {
      this.$parent.handleRowMouseLeave(row);
    },
    getRowClass(row) {
      const classArr = [].concat(row.rowClassName);
      if (row.isHover) {
        classArr.push('bui-table-tr-active');
      }
      return classArr;
    },
    getColumnClass(column) {
      return {
        'bui-table-td-hidden': this.fixed && this.fixed !==column.fixed || (!this.fixed && column.fixed),
      };
    },
    getColumnStyle(column) {
      const style = {
        width: this.columnsWidth[column._id] ? `${parseInt(this.columnsWidth[column._id].width)}px` : '',
        height: this.rowHeight,
        textAlign: column.align,
      };
      if (!this.fixed) {
        return {
          ...style,
          // position: 'absolute',
          // top: 0,
          // left: 0,
          // transform: this.columnsWidth[column._id] ? `translateX(${this.columnsWidth[column._id].x}px)` : 'none',
        };
      }
      return style;
    },
  },

};
</script>



// WEBPACK FOOTER //
// components/table/src/table-body-div.vue