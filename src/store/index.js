import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
// import poster from '../views/posterEditor/poster.vuex'
import logger from 'vuex/dist/logger'

Vue.use(Vuex)

const store = new Vuex.Store({
  // modules: {
  //   poster
  // },
  getters,
  plugins: process.env.NODE_ENV !== 'production' ? [logger()] : []
})

export default store
