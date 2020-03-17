<template>
  <div id="app">
       <Ftable></Ftable>
  </div>
</template>


<script>
import Ftable from './components/table.vue'

export default {
  name: 'App',
  components: {
    Ftable
  }
}
</script>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
