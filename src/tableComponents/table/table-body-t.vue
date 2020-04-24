
<template>
  <table
    :style="styles"
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
    <tbody>
      <template v-for="(rdata, rindex) in data">
        <tr
          :key="rindex"
          :class="getRowClass(rdata)"
          @click="handleRowClick(rdata, rindex)"
          @mouseenter="handleRowMouseEnter(rdata)"
          @mouseleave="handleRowMouseLeave(rdata)">
          <td
            v-for="(column) in columns"
            :key="column._id"
            :class="getColumnClass(column)"
            :style="{
              width: columnsWidth[column._id] ? columnsWidth[column._id].width + 'px' : '',
              textAlign: column.align,
            }"
          >
            <ceil
              :row="rdata"
              :column="column"
              :row-index="rindex"
              :fixed="fixed"
            />
          </td>
        </tr>
        <tr
          v-if="rdata.isExpand"
          :class="trExpandClass"
          :key="rindex+'expand'">
          <td
            :colspan="columns.length"
            class="bui-table-td-expand">
            <expand
              :row="rdata"
              :render="expandRender"
              :index="rindex"/>
          </td>
        </tr>
      </template>

    </tbody>
  </table>
</template>

<script>
import Expand from './expand.vue';
import Ceil from './ceil.vue';

export default {
  name: 'TableBody',
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
  },
  methods: {
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
  },

};
</script>



// WEBPACK FOOTER //
// components/table/src/table-body-t.vue