<template>
  <div :class="getCeilClass(column)">
    <template v-if="column.renderHeader">
      <expand
        :row="column"
        :render="column.renderHeader"
        :column="column"
        :index="columnIndex"
      />
    </template>
    <template v-else>
      {{ column.title }}
    </template>
    <template v-if="column.type === 'selection'">
      <checkbox :checked="isSelectAll" @change="handleSelectAll" :disabled="data&&!data.length"></checkbox>
     
    </template>
    <template v-else-if="column.sortable">
      <span
        class="bui-table-header-icon-wrapper"
        @click.stop="handleSortClick(column)"
      >
        <byted-icon
          :color="column.sortType==='asc' ? '#598fe6' : '#999999'"
          class="bui-table-sort-icon sort-icon-asc"
          name="sort-asc"
        />
        <byted-icon
          :color="column.sortType==='desc' ? '#598fe6' : '#999999'"
          class="bui-table-sort-icon sort-icon-desc"
          name="sort-asc"
        />
      </span>
    </template>
  </div>
</template>
<script>
import Expand from './expand.vue';
export default {
  name: 'HeadCeil',
  components: {
    Expand,
  },
  props: {
    data: {
      type: Array,
      default() {
        return [];
      },
    },
    column: {
      type: Object,
      default() {
        return {};
      },
    },
    columnIndex: {
      type: Number,
      default: -1,
    },
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
    // 全选
    handleSelectAll(value) {
      this.$parent.$parent.handleSelectAll(value);
    },
    // 排序功能
    handleSortClick(column) {
      this.$parent.$parent.handleSortClick(column);
    },
    // 过滤功能
    handleFilterClick(column) {
      // todo
    },
  },
};
</script>