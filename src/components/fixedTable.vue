<template>
<div class="f-table-fixed" style="width:120px;overflow:hidden;position:absolute;z-index:999;top:0px;">
    <table cellspacing="0" cellpadding="0" border="0" style="width:100%">
        <colgroup>
            <col width=40>
            <col v-for="(item,index) in cols" :key="index" :width="item.width">
        </colgroup>
        <thead style="display: table-header-group;">
            <tr>
                <th><input type="checkbox"></th>
                <th v-for="(item,index) in cols" :key="index" :align="item.align">
                    <div class="ivu-table-cell">
                        {{item.title}}
                    </div>
                </th>
            </tr>
        </thead>
        <tbody class="ivu-table-tbody" ref="tbody" style="display: table-row-group;">
            <tr class="ivu-table-row" v-for="(tritem,index1) in bodyData" :key="index1">
                <td><input type="checkbox" class="checkbox" @change="changeCheck(index1)"></td>
                <td v-for="(tditem,index2) in cols" :key="index2" :align="tditem.align">
                    <div class="ivu-table-cell" style=" padding:5px;">
                        {{tritem[tditem.name]}}
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
</div>
</template>

<script>
export default {
    props: {
        cols: {
            type: Array,
            default: () => {
                return []
            }
        },
        bodyData: {
            type: Array,
            default: () => {
                return []
            }

        },

    },
    data() {
        return {
            checkList: {

            },
            //3种状态 0：未选，1：板悬：2全选
            checkType: 0
        }
    },
    methods: {
        changeCheck(val) {

            if (this.$refs.tbody.getElementsByClassName('checkbox')[val].checked) {
                this.checkList[val] = this.bodyData[val];

                this.checkList.length += 1

            } else {
                delete this.checkList[val];
                this.checkList.length -= 1
            }

        },
        getThWidthList() {
            let tdChild = len = this.$refs.tbody.firstChild.children;
            for (let i = 0, len = this.$refs.tbody.firstChild.children.length; i < 0; i++) {

            }
        }
    },
    mounted() {
        // console.log(this.$refs.tbody.firstChild)

    },
    computed: {
        checkstatus() {
            return this.checkType;
        }
    },

}
</script>

<style lang="less">
.f-table-fixed {

    table,
    table tr th,
    table tr td {
        border: 1px solid #eee;
        border-bottom: 0px solid #eee;
        padding:5px;
        background:#eee;
        cursor: pointer;
    }

    table {
        border-collapse: collapse;
        padding: 2px;
        table-layout: fixed;
    }
    table tr{
        background:red;
    }

    table tr:nth-child(even) {
        background: red;
    }

    table tr:hover {
        background: red;
    }
}
</style>
