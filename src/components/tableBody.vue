<template>
  <div class="f-table-body">
    <scrollBar style="width:100%;height:100%;overflow:hidden" @scroll="scrollX">
      <table
        v-if="fixedLeft.length==0"
        cellspacing="0"
        cellpadding="0"
        border="0"
        style="width:100%"
      >
        <colgroup>
          <col width="40" />
          <col v-for="(item,index) in cols" :key="index" :width="item.width" />
        </colgroup>
        <tbody class="ivu-table-tbody" ref="tbody" style="display: table-row-group;">
          <tr class="ivu-table-row" v-for="(tritem,index1) in bodyData" :key="index1">
            <td>
              <input
                type="checkbox"
                :checked="findIndex(selectItems,tritem)>-1"
                class="checkbox"
                @change="changeCheck(index1,$event)"
              />
            </td>
            <td v-for="(tditem,index2) in cols" :key="index2" :align="tditem.align">
              <div class="ivu-table-cell" style=" padding:5px;">{{tritem[tditem.name]}}</div>
            </td>
          </tr>
        </tbody>
      </table>
    </scrollBar>
    <table v-if="fixedLeft.length>0" cellspacing="0" cellpadding="0" border="0" style="width:100%">
      <colgroup>
        <col width="40" />
        <col v-for="(item,index) in cols" :key="index" :width="item.width" />
      </colgroup>
      <tbody class="ivu-table-tbody" ref="tbody" style="display: table-row-group;">
        <tr class="ivu-table-row" v-for="(tritem,index1) in bodyData" :key="index1">
          <td>
            <input
              type="checkbox"
              :checked="findIndex(selectItems,tritem)>-1"
              class="checkbox"
              @change="changeCheck(index1,$event)"
            />
          </td>
          <!-- <td v-for="(tditem,index2) in fixedLeft" :key="index2" :align="cols[tditem.idx].align">
                    <div class="ivu-table-cell" style=" padding:5px;">
                        {{bodyData[cols[tditem.idx]['name']]}}
                       
                    </div>
          </td>-->
          <td v-for="(tditem,index2) in cols" :key="index2" :align="tditem.align">
            <div class="ivu-table-cell" style=" padding:5px;">{{tritem[tditem.name]}}</div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import { deepCopy, findIndex } from "../utils/utils";
import scrollBar from "../lib/scrollBar/index";
export default {
  components: {
    scrollBar,
  },
  props: {
    cols: {
      type: Array,
      default: () => {
        return [];
      },
    },
    bodyData: {
      type: Array,
      default: () => {
        return [];
      },
    },
    selectItems: {
      type: Array,
      default: () => {
        return [];
      },
    },
    fixedLeft: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      findIndex: findIndex,
      checkList: {},
      //3种状态 0：未选，1：半选：2全选
      checkType: 0,
    };
  },
  methods: {
    scrollX(e){
      this.$emit('scroll',e)
     
    },
    changeCheck(val, e) {
      let copySelectItems = deepCopy(this.selectItems);
      if (e.target.checked) {
        copySelectItems.push(this.bodyData[val]);
      } else {
        let idx = findIndex(copySelectItems, this.bodyData[val]);
        copySelectItems.splice(idx, 1);
      }
      this.$emit("update:selectItems", copySelectItems);
    },
  },
  mounted() {},
  computed: {},
};
</script>

<style lang="less">
.f-table-body {
  table,
  table tr th,
  table tr td {
    border: 1px solid #eee;
    padding: 5px 10px;
  }

  table {
    border-collapse: collapse;
    padding: 2px;
    table-layout: fixed;
  }

  // table tr:nth-child(even) {
  //     background: #EEE;
  // }
  table tr:last-child td {
    border-bottom: none;
  }

  table tr:hover {
    background: #efefef;
  }
}
</style>
