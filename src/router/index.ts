import store from "@/store";
import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        name: "Main",
        component: () => import("@/layout/Main.vue"),
        redirect: "/discoverMusic",
        children: [
            {
                path: "/discoverMusic",
                name: "discoverMusic",
                component: () => import("@/views/discoverMusic.vue"),
                redirect: "/discoverMusic/personalizedRec",
                children: [
                    {
                        path: "/discoverMusic/personalizedRec",
                        name: "personalizedRec",
                        component: () => import("@/views/personalizedRec.vue"),
                    },
                ],
            },
            {
                path: "/dailyRec",
                name: "dailyRec",
                component: () => import("@/views/dailyRec.vue"),
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
