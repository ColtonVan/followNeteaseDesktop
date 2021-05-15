<template>
    <span>{{ name.substring(0, name.indexOf(keyword)) }}</span>
    <a href="javascript:void(0)">{{ keyword }}</a>
    <span>{{ name.substring(name.indexOf(keyword) + keyword.length) }}</span>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
    props: {
        keyword: {
            type: String,
            default: "",
        },
        name: {
            type: String,
            default: "",
        },
    },
    setup() {
        
    },
});
</script>
<style lang="scss" scoped>
a {
    color: #0c73c2;
    text-decoration: none;
}
</style>