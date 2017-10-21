import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const Index = (resolve) => {
	import('@/components/Index/index').then((module) => {
		resolve(module)
	})
}
const Classify = (resolve) => {
	import('@/components/Classify/classify').then((module) => {
		resolve(module)
	})
}

export default new Router({
  routes: [
    {
      path: '/',
      component: Index
    },
		{
			path: '/Classify/:cateid',
			component: Classify
		}
  ]
})
