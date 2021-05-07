<template>
    <svg
        t="1620314145065"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="3364"
        width="200"
        height="200"
    >
        <path d="M216.7 844.3V179.7l445 332.3-445 332.3z m590.6 0h-80V179.7h80v664.6z" :fill="color" p-id="3365"></path>
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
