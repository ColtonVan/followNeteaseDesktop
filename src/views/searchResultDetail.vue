<template>
    <HorizontalNav :navs="navs" />
    <div>
        {{ $route.query.keyword }}
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from "vue";
import { NavsProps } from "@/components/viewParts/HorizontalNav.vue";
export default defineComponent({
    setup() {
        const state = reactive<{ navs: NavsProps[] }>({
            navs: [{ title: "单曲", active: true }],
        });
        return {
            ...toRefs(state),
        };
    },
});
</script>

<style scoped lang="scss"></style>
