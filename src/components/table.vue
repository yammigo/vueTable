<template>
  <div class="f-table" style="min-width:750px;position:relative">
    <div
      ref="sticky"
      class="f-table-header f-sticky"
      style="width:100%;
    position: sticky;
    top: 0;"
    >
      <table cellspacing="0" cellpadding="0" style="width:100%">
        <colgroup>
          <col width="40" />
          <col v-for="(item,index) in columns" :key="index" :width="item.width" />
        </colgroup>
        <thead style="display: table-header-group;">
          <tr>
            <th>
              <input type="checkbox" :checked="checkedStatus" ref="checkedAll" @change="checkedAll" />
            </th>
            <th v-for="(item,index) in columns" :key="index" :align="item.align">
              <div class="ivu-table-cell">{{item.title}}</div>
            </th>
          </tr>
        </thead>
      </table>
    </div>
    <tableBody :bodyData="data" :cols="columns" :selectItems.sync="selectItems"/>
    {{selectItems}}
  </div>
</template>
<script>
import Stickyfill from "stickyfilljs";
import tableBody from "./tableBody";
import fixedTable from "./fixedTable";
export default {
  props: {
    columns: {
      type: Array,
      default() {
        return [];
      }
    },
    data: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      selectItems: [],
    };
  },
  methods: {
    checkedAll(e) {
       this.selectItems=e.target.checked?this.data:[];
    }
  },
  mounted() {
    this.$nextTick(() => {
      Stickyfill.add(this.$refs.sticky);
    });
  },
  computed: {
    checkedStatus() {
        if(this.selectItems.length!==this.data.length){
            if(this.selectItems.length!==0){
                
                this.$refs.checkedAll&&(this.$refs.checkedAll.indeterminate = true);
            }else{
               
                this.$refs.checkedAll&& (this.$refs.checkedAll.indeterminate = false);
            }
            return false;
        }else{
            this.$refs.checkedAll&& (this.$refs.checkedAll.indeterminate = false);
            return true;
        }
     

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
  }
}
</style>