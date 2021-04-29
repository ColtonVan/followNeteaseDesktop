<template>
    <div class="flex-shrink-0 routerContainer px-5 py-4">
        <router-view></router-view>
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
}
</style>
