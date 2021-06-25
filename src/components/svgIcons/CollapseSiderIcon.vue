<template>
    <svg t="1624522578268" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3411" width="200" height="200">
        <path
            d="M525.248 288l-224 224 224 224L480 781.248 210.752 512 480 242.752 525.248 288z m288 0l-224 224 224 224L768 781.248 498.752 512 768 242.752 813.248 288z"
            :fill="color"
            p-id="3412"
        ></path>
    </svg>
</template>
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
    props: {
        color: {
            type: String,
            default: "#fff",
        },
    },
    setup() {},
});
</script>
