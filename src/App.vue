<template>
  <div id="app">
    <cepPosterEditor />
    <!-- <router-view /> -->
  </div>
</template>
<script>
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss' // global css
import '@/styles/element-variables.scss'
import store from './store'
import cepPosterEditor from './views/posterEditor'

export default {
  store,
  components: { cepPosterEditor }
}
</script>
<style lang="scss">
</style>

