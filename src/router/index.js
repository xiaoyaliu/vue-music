import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
const Recommend = (resolve) => {
  import('@/components/recommend/recommend').then((module) => {
    resolve(module)
  })
}
const Singer=(resove)=>{
		import('@/components/singer/singer').then((module)=>{
				resove(module)
		})

}
const Rank=(resove)=>{
		import('@/components/rank/rank').then((module)=>{
				resove(module)
		})

}
const Search=(resove)=>{
		import('@/components/search/search').then((module)=>{
				resove(module)
		})

}
const Disc=(resove)=>{
		import('@/components/disc/disc').then((module)=>{
				resove(module)
		})

}
const TopList = (resolve) => {
		import('components/top-list/top-list').then((module) => {
				resolve(module)
		})
}
const SingerDetail = (resolve) => {
		import('components/singer-detail/singer-detail').then((module) => {
				resolve(module)
		})
}
export default new Router({
  routes: [
	{
			path: '/',
			redirect:'/recommend'
	},
    {
      path: '/recommend',
      component:Recommend,
				children:[
						{
					   path:':id',
							component:Disc
           }
				]
    },
			{
					path: '/rank',
					component:Rank,
					children: [
							{
									path: ':id',
									component: TopList
							}
					]
			},
			{
					path: '/search',
					component:Search
			},
			{
					path: '/singer',
					component:Singer,
					children: [
							{
									path: ':id',
									component: SingerDetail
							}
					]
			}
  ]
})
