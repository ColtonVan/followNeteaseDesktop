<template>
    <svg
        t="1620314091993"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="3065"
        width="200"
        height="200"
    >
        <path
            d="M362.3 512l445-332.3v664.5L362.3 512zM216.7 179.7h80v664.5h-80V179.7z"
            :fill="color"
            p-id="3066"
        ></path>
    </svg>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    props: {
        color: {
            type: String,
            default: "#000000",
        },
    },
    setup() {
        return {};
    },
});
</script>
