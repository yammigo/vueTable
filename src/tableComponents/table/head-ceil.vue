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
      <byted-checkbox
        :value="isSelectAll"
        :disabled="data&&!data.length"
        @change="handleSelectAll"
      />
    </template>
    <template v-else-if="column.sortable">
      <span
        class="bui-table-header-icon-wrapper"
        @click.stop="handleSortClick(column)"
      >
        <!-- <byted-icon
          :color="column.sortType==='asc' ? '#598fe6' : '#999999'"
          class="bui-table-sort-icon sort-icon-asc"
          name="sort-asc"
        />
        <byted-icon
          :color="column.sortType==='desc' ? '#598fe6' : '#999999'"
          class="bui-table-sort-icon sort-icon-desc"
          name="sort-asc"
        /> -->
           <div :style="{fill:column.sortType==='asc' ? '#598fe6' : '#999999'}" class="bui-table-sort-icon sort-icon-asc byted-icon bui-icon-sort-asc" style="fill: rgb(153, 153, 153);"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 48 48" width="100%" height="100%"><defs><path id="sort-asc_svg__a" d="M0 0h48v48H0z"></path></defs><g fill-rule="evenodd"><mask id="sort-asc_svg__b" fill="#fff"><use xlink:href="#sort-asc_svg__a"></use></mask><use fill="#FFF" fill-opacity=".01" xlink:href="#sort-asc_svg__a"></use><path fill-rule="nonzero" d="M16 11c0-1.782 2.154-2.674 3.414-1.414l12 12a2 2 0 0 1 0 2.828l-12 12C18.154 37.674 16 36.782 16 35V11z" transform="rotate(-90 24 23)"></path></g></svg></div>

         
        <!-- <jiantao-icon
          :color="column.sortType==='desc' ? '#598fe6' : '#999999'"
          class="fui-table-sort-icon sort-icon-desc"
          name="sort-asc"
        /> -->
        <div :style="{fill:column.sortType==='desc' ? '#598fe6' : '#999999'}" class="bui-table-sort-icon sort-icon-desc byted-icon bui-icon-sort-asc" style="fill: rgb(89, 143, 230);"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 48 48" width="100%" height="100%"><defs><path id="sort-asc_svg__a" d="M0 0h48v48H0z"></path></defs><g fill-rule="evenodd"><mask id="sort-asc_svg__b" fill="#fff"><use xlink:href="#sort-asc_svg__a"></use></mask><use fill="#FFF" fill-opacity=".01" xlink:href="#sort-asc_svg__a"></use><path fill-rule="nonzero" d="M16 11c0-1.782 2.154-2.674 3.414-1.414l12 12a2 2 0 0 1 0 2.828l-12 12C18.154 37.674 16 36.782 16 35V11z" transform="rotate(250 24 23)"></path></g></svg></div>
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



// WEBPACK FOOTER //
// components/table/src/head-ceil.vue