<template>
    <div class="d-flex d-flex align-items-center w-100 d-flex justify-content-center pt-5">
        <span class="translate-y-10 me-3">
            <LoadingIcon width="24" height="24" class="loadingIcon filter-invert-1" />
        </span>
        <div class="text-black text-center mt-2 fs-5 text-muted">{{ loadedText }}</div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
    props: {
        loadedText: {
            type: String,
            default: "加载中...",
        },
    },
    setup() {},
});
</script>

<style scoped lang="scss">
.loadingIcon {
    animation: rotateIcon 1s infinite;
}
@keyframes rotateIcon {
    from {
        transform: rotate(0);
    }
    to {
        transform: rotate(360deg);
    }
}
</style>
