<template>
<div class="f-table">
      <tableHeader/>
      <tableBody/>
</div>
</template>

<script>
import tableHeader from './tableHeader'
import tableBody from './tableBody'
export default {
    props: {
        msg: String
    },
    components: {
        tableHeader,
        tableBody
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.f-table{
  border:solid 1px #eee;
}
</style>