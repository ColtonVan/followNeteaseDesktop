<template>
    <div class="flex-shrink-0 routerContainer position-relative px-5 py-4">
        <router-view></router-view>
        <transition name="playList">
            <PlayList v-if="$store.state.showPlayList" />
        </transition>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
    setup() {},
});
</script>

<style scoped lang="scss">
.routerContainer {
    height: calc(100vh - 75px - 60px);
    width: calc(100vw - 200px);
    overflow-x: hidden;
    .playList-enter-active,.playList-leave-active {
        transition: right 0.3s ease;
    }
    .playList-enter-from,.playList-leave-to{
        right: -416px;
    }
    .playList-enter-to,.playList-leave-from{
        right: 0;
    }
}
</style>
