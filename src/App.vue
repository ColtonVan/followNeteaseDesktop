<template>
    <router-view></router-view>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Main from "@/layout/Main.vue";
export default defineComponent({
    components: {
        Main,
    },
    setup() {
        console.log(process.env.VUE_APP_baseURL);
    },
});
</script>

<style scoped lang="scss">
    
</style>
