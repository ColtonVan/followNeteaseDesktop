<template>
    <div class="px-5 py-4 h-100 w-100 d-flex flex-column">
        <div class="navBox d-flex align-items-end">
            <span
                class="navItem cursor-pointer d-flex flex-column align-items-center"
                :class="{
                    'fw-bold': nav.active,
                    'fs-4': nav.active,
                    'fs-5': !nav.active,
                    activeNav: nav.active,
                }"
                @click="clickNavItem(nav, navIndex)"
                v-for="(nav, navIndex) in navs"
                :key="navIndex"
            >
                <div class="navTitle pb-1 d-flex align-items-start">
                    {{ nav.title }}
                </div>
                <div class="activedNavBorder" v-if="nav.active"></div>
            </span>
        </div>

        <div class="flex-grow-1 overflow-scroll hideScrollBar">
            <div class="container">
                <div class="row d-flex flex-column align-items-center">
                    <div class="col-xxl-10 containerCol">
                        <router-view></router-view>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { useRouter } from "vue-router";
import { defineComponent, reactive, toRefs, watchEffect } from "vue";
export default defineComponent({
    setup() {
        const router = useRouter();
        const state = reactive({
            navs: [
                {
                    title: "个性推荐",
                    active: true,
                    path: "/discoverMusic/personalizedRec",
                },
                {
                    title: "歌单",
                    path: "",
                },
                {
                    title: "主播电台",
                    path: "",
                },
                {
                    title: "排行榜",
                    path: "",
                },
                {
                    title: "歌手",
                    path: "",
                },
                {
                    title: "最新音乐",
                    path: "",
                },
            ],
        });
        //点击导航标题
        const clickNavItem = (nav, navIndex) => {
            state.navs = state.navs.map((item, index) => {
                if (index == navIndex) {
                    return {
                        ...item,
                        active: true,
                    };
                } else {
                    return {
                        ...item,
                        active: false,
                    };
                }
            });
            if (nav.path) {
                router.push(nav.path);
            }
        };
        return {
            ...toRefs(state),
            clickNavItem,
        };
    },
});
</script>

<style scoped lang="scss">
.navBox {
    .navItem {
        min-width: 60px;
        height: 38px;
        .navTitle {
            transition: font-size ease 0.1s;
        }
        .activedNavBorder {
            height: 3px;
            width: 80%;
        }
    }
    .navItem ~ .navItem {
        margin-left: 16px;
    }
}
.containerCol {
    // min-width: 1000px;
}
.primaryTheme {
    .activedNavBorder {
        background-color: $primary;
    }
}
.darkTheme {
    .activedNavBorder {
        background-color: $dark;
    }
}
.freeTheme {
    .activedNavBorder {
        background-color: $free;
    }
}
</style>
