<template>
    <div class="main vw-100 vh-100 position-relative" :class="{ [theme]: allowTheme }">
        <Nav />
        <router-view></router-view>
        <RequestLoading />
    </div>
</template>
<script lang="ts">
import { computed, reactive, toRefs } from "vue";
import { useStore } from "vuex";
import "@/utils/request";
export default {
    setup() {
        const store = useStore();
        const state = reactive({
            theme: computed(() => store.getters.getTheme),
            allowTheme: true,
        });
        return {
            ...toRefs(state),
        };
    },
};
</script>
<style lang="scss">
.main {
    position: relative;
    overflow: hidden;
}
</style>
