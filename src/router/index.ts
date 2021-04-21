import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
	{
		path: '/',
		name: 'Main',
		component: () => import("@/layout/Main.vue"),
		redirect: "/discoverMusic",
		children: [
			{
				path: "/discoverMusic",
				name: "discoverMusic",
				component: () => import("@/views/discoverMusic.vue")
			}
		]
	}
]

const router = createRouter({
	history: createWebHashHistory(),
	routes
})

export default router
