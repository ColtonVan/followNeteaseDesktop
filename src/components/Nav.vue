<template>
    <div class="nav d-flex justify-content-between align-items-center">
        <div class="leftArea"></div>
        <div class="rightArea mx-3">
            <SkinIcon width="18" height="18" />
            <EmailIcon width="18" height="18" />
            <FullScreenIsTrueIcon v-if="isFullScreen" @click="toggleFullScreen" width="18" height="18" />
            <FullScreenIsFalseIcon v-else @click="toggleFullScreen" width="18" height="18" />
            <CloseIcon width="18" height="18" />
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import useFullScrenn from "@/hooks/useFullScreen";
import { useStore } from "vuex";
export default defineComponent({
    setup() {
        const store = useStore();
        let { toggleFullScreen } = useFullScrenn();
        const isFullScreen = computed(() => store.state.fullScreen);
        return {
            toggleFullScreen,
            isFullScreen,
        };
    },
});
</script>

<style scoped lang="scss">
.nav {
    height: 60px;
    width: 100vw;
    .rightArea {
        svg {
            opacity: 0.86;
            @extend .cursor-pointer;
            &:hover {
                opacity: 1;
            }
        }
        svg ~ svg {
            margin-left: 18px;
        }
    }
}
.primaryTheme {
    .nav {
        background-color: $primary;
    }
}
.darkTheme {
}
.whiteTheme {
}
</style>
