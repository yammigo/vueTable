<template>
<div ref="sticky" class="f-table-header f-sticky" style="width:100%;
    position: sticky;
    top: 0;">
    <table cellspacing="0" cellpadding="0" style="width:100%">
        <colgroup>
            <col width=40>
            <col v-for="(item,index) in colList" :key="index" :width="item.width">
        </colgroup>
        <thead style="display: table-header-group;">
            <tr>
                <th><input type="checkbox"></th>
                <th v-for="(item,index) in colList" :key="index" :align="item.align">
                    <div class="ivu-table-cell">
                        {{item.title}}
                    </div>
                </th>
            </tr>
        </thead>
    </table>
     <!-- <table cellspacing="0" cellpadding="0" style="width:100%">
        <colgroup>
            <col width=40>
            <col v-for="(item,index) in colList" :key="index" :width="item.width">
        </colgroup>
        <thead style="display: table-header-group;">
            <tr>
                <th></th>
                <th v-for="(item,index) in colList" :key="index" :align="item.align">
                    <div class="ivu-table-cell">
                        {{item.title}}
                    </div>
                </th>
            </tr>
        </thead>
    </table> -->
</div>
</template>

<style lang="less">
.f-table-header {
    font-size: 16px;
    box-shadow:0px 6px 10px -5px #a5a5a5;
    table,
    table tr th,
    table tr td {
        border: 1px solid #eee;
        border-bottom: 0px solid #eee;
        padding:5px 10px;
        background:#eee;
        cursor: pointer;
    }

    table tr th:active{
        color:green;
    }
    table {
        border-collapse: collapse;
        padding: 2px;
        table-layout:fixed;
    }
    .f-sticky{
        box-shadow:0px 0px 10px black;
    }
}
</style>

<script>
import Stickyfill from "stickyfilljs"
export default {
    props: {
        colList: {
            type: Array,
            default: () => {
                return []
            }
        }
    },
    mounted() {
        this.$nextTick(()=>{
            Stickyfill.add(this.$refs.sticky);
        })
    },

}
</script>

<style>

</style>
