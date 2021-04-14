<template>
    <div class="app" :class="{ [theme]: allowTheme }">
        <Nav />
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
.app {
    position: relative;
}
</style>
