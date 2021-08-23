<template>
    <!-- px-5 py-4 -->
    <div id="routerContainer" class="flex-shrink-0 routerContainer position-relative hideScrollBar">
        <router-view></router-view>
        <transition name="playList">
            <PlayList v-if="$store.state.showPlayList" />
        </transition>
        <CustomScrollBar v-if="!isLoading && !['personalizedRec','videos'].includes($route.name)" listId="routerContainer" />
    </div>
</template>

<script lang="ts">
import store from "@/store";
import { computed, defineComponent, reactive, toRefs } from "vue";
export default defineComponent({
    setup() {
        const state = reactive({
            isLoading: computed(() => store.state.isLoading),
        });
        return {
            ...toRefs(state),
        };
    },
});
</script>

<style scoped lang="scss">
.routerContainer {
    height: calc(100vh - 75px - 60px);
    width: calc(100vw - 200px);
    min-width: 600px;
    overflow-y: scroll;
    .playList-enter-active,
    .playList-leave-active {
        transition: right 0.3s ease;
    }
    .playList-enter-from,
    .playList-leave-to {
        right: -416px;
    }
    .playList-enter-to,
    .playList-leave-from {
        right: 0;
    }
}
</style>
