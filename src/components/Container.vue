<template>
    <div class="flex-grow-1 routerContainer">
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
.routerContainer{
    height: calc(100vh - 75px - 60px);
}
</style>
