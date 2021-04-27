<template>
    <svg t="1619149891918" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3255" width="200" height="200">
        <path
            d="M544 128 480 128 480 480 128 480 128 544 480 544 480 896 544 896 544 544 895.936 544 895.936 480 544 480Z"
            p-id="3256"
            :fill="color"
        ></path>
    </svg>
</template>
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
    props: {
        color: {
            type: String,
            default: "#ffffff",
        },
    },
    setup() {},
});
</script>
