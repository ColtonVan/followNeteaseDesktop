<template>
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
            v-for="(nav, navIndex) in navList"
            :key="navIndex"
        >
            <div class="navTitle pb-1 d-flex align-items-start">
                {{ nav.title }}
            </div>
            <div class="activedNavBorder" v-if="nav.active"></div>
        </span>
    </div>
</template>

<script lang="ts">
import { useRouter } from "vue-router";
import { computed, defineComponent, PropType, reactive, toRefs } from "vue";
export default defineComponent({
    props: {
        navs: {
            type: Array as PropType<{ title: string; active?: boolean; path?: string }[]>,
            default: [],
        },
    },
    emits: ["update:navs"],
    setup(props, { emit }) {
        const router = useRouter();
        const state = reactive({
            navList: computed({
                get: () => props.navs,
                set: newV => emit("update:navs", newV),
            }),
        });
        //点击导航标题
        const clickNavItem = (nav, navIndex) => {
            state.navList = (state.navList as any[]).map((item, index) => {
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
