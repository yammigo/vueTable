<template>
<div class="f-table" style="min-width:750px;position:relative">
      <tableHeader :colList="columns"/>
      <!-- <fixedTable :bodyData="data" :cols="columns"/> -->
      <tableBody :bodyData="data" :cols="columns"/>
</div>
</template>

<script>
import tableHeader from './tableHeader'
import tableBody from './tableBody'
import fixedTable from './fixedTable'
export default {
    props: {
        columns:{
            type:Array,
            default(){
                return []
            }
        },
        data:{
            type:Array,
            default(){
                return []
            }
        }
    },
    methods: {
      
    },
    mounted() {
        
    },
    components: {
        tableHeader,
        tableBody,
        fixedTable
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.f-table{
//   border:solid 1px #eee;
}
</style>