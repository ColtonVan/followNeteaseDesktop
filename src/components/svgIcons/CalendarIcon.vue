<template>
    <svg
        t="1619072846045"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="21960"
        data-spm-anchor-id="a313x.7781069.0.i18"
        width="200"
        height="200"
    >
        <path
            d="M789.333333 1024H234.666667C104.533333 1024 0 923.733333 0 800v-533.333333C0 142.933333 104.533333 42.666667 234.666667 42.666667h554.666666c130.133333 0 234.666667 100.266667 234.666667 224v531.2C1024 923.733333 919.466667 1024 789.333333 1024zM234.666667 83.2c-106.666667 0-192 83.2-192 183.466667v531.2c0 102.4 85.333333 183.466667 192 183.466666h554.666666c106.666667 0 192-83.2 192-183.466666V266.666667c0-102.4-85.333333-183.466667-192-183.466667H234.666667z"
            p-id="21961"
            :fill="color"
            data-spm-anchor-id="a313x.7781069.0.i17"
            class="selected"
        ></path>
        <path
            d="M0 266.666667h1024v42.666666H0zM256 0h42.666667v213.333333h-42.666667zM725.333333 0h42.666667v213.333333h-42.666667z"
            p-id="21962"
            :fill="color"
            data-spm-anchor-id="a313x.7781069.0.i19"
            class="selected"
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
