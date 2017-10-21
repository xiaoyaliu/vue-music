// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import fastclick from 'fastclick'
import VueLazyLoad from 'vue-lazyload'
import 'common/sass/index.scss'
import store from './store'
Vue.use(VueLazyLoad,{
		loading:require('common/image/default.png')
});
Vue.config.productionTip = false
fastclick.attach(document.body);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
		store,
  template: '<App/>',
  components: { App }
})
