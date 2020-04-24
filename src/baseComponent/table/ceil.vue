<template>
  <div :class="getCeilClass(column)">
    <template v-if="column.render">
      <expand
        :row="row"
        :render="column.render"
        :column="column"
        :index="rowIndex"
      />
    </template>
    <template v-else-if="column.type === 'index'">
      {{ parseInt(rowIndex) + 1 }}
    </template>
    <template v-else-if="column.type === 'selection'">
      <checkbox :checked="row.isChecked" :disabled="row.isDisabled"  @change="handleSelectChange(row)"></checkbox>
    </template>
    <template v-else-if="column.type === 'expand'">
      <span
        @click="handleExpandClick(row)"
      >
        <byted-icon
          :class="getExpandIconClass(row)"
          name="angle-right"
        />
      </span>
    </template>
    <template v-else>
      {{ row[column.key] }}
    </template>
  </div>
</template>
<script>

import Expand from './expand.vue';
export default {
  name: 'Ceil',
  components: {
    Expand,
  },
  props: {
    row: {
      type: Object,
      default() {
        return {};
      },
    },
    column: {
      type: Object,
      default() {
        return {};
      },
    },
    rowIndex: {
      type: Number,
      default: -1,
    },
    fixed: {
      type: [Boolean, String],
      default: false,
    },
  },
  methods: {
    getCeilClass(column) {
      const classArr = ['bui-table-ceil'];
      if (column.align === 'right') {
        classArr.push('bui-table-ceil-right');
      }
      if (column.align === 'center') {
        classArr.push('bui-table-ceil-center');
      }
      return classArr.join(' ');
    },
    getColumnClass(column) {
      return {
        'bui-table-td-hidden': this.fixed && this.fixed !==column.fixed || (!this.fixed && column.fixed),
      };
    },
    getExpandIconClass(row) {
      const classArr = ['bui-table-ceil-expand-icon'];
      if (row.isExpand) {
        classArr.push('bui-table-ceil-expand-icon-open');
      }
      return classArr;
    },
    handleSelectChange(row) {
      const value = !row.isChecked;
      this.$parent.$parent.handleColumnSelect(value, row);
    },
    handleExpandClick(row) {
      this.$parent.$parent.handleExpandClick(row);
    },
  },
};
</script>