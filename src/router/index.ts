import store from "@/store";
import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        name: "Main",
        component: () => import("@/layout/Main.vue"),
        redirect: "/container",
        children: [
            {
                path: "/container",
                name: "container",
                component: () => import("@/layout/container/Container.vue"),
                redirect: "/container/discoverMusic",
                children: [
                    {
                        path: "/container/discoverMusic",
                        name: "discoverMusic",
                        component: () => import("@/views/discoverMusic.vue"),
                        redirect: "/container/discoverMusic/personalizedRec",
                        children: [
                            {
                                path: "/container/discoverMusic/personalizedRec",
                                name: "personalizedRec",
                                component: () => import("@/views/views/personalizedRec.vue"),
                            },
                        ],
                    },
                    {
                        path: "/container/dailyRec",
                        name: "dailyRec",
                        component: () => import("@/views/dailyRec.vue"),
                    },
                    {
                        path: "/container/videos",
                        name: "videos",
                        component: () => import("@/views/videos.vue"),
                    },
                    {
                        path: "/container/createdMusicList",
                        name: "createdMusicList",
                        component: () => import("@/views/createdMusicList.vue"),
                    },
                    {
                        path: "/container/searchResultDetail",
                        name: "searchResultDetail",
                        component: () => import("@/views/searchResultDetail.vue"),
                    },
                ],
            },
            {
                path: "videoDetail",
                name: "videoDetail",
                component: () => import("@/layout/container/videoDetail.vue"),
            },
        ],
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});
router.beforeEach((to, from, next) => {
    let storedRouteFromList = [...store.state.routeFromList];
    if (storedRouteFromList.length < 5) {
        store.commit("changeRouteFromList", [...storedRouteFromList, from]);
    } else {
        storedRouteFromList.splice(0, 1);
        storedRouteFromList.push({ ...from, isCurrent: false });
        store.commit("changeRouteFromList", storedRouteFromList);
    }
    next();
});
export default router;
