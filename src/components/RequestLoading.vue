<template>
    <div v-if="isLoading" class="requestLoading position-fixed start-0 top-0 w-100 h-100">
        <div class="position-absolute start-50 translate-middle loadingBox text-center">
            <LoadingIcon width="86" height="86" class="loadingIcon" />
            <div class="text-white text-center mt-2 fs-4">{{ loadedText }}</div>
        </div>
    </div>
</template>

<script lang="ts">
import store from "@/store";
import { computed, defineComponent, reactive, toRefs, watch } from "vue";
export default defineComponent({
    setup() {
        const initLoadedText = "玩儿命加载中...";
        const state = reactive({
            loadedText: "",
            isLoading: computed(() => store.state.isLoading),
        });
        let timer = null;
        watch(
            () => state.isLoading,
            isLoading => {
                if (isLoading) {
                    timer = setInterval(() => {
                        state.loadedText.length === initLoadedText.length
                            ? (state.loadedText = "加")
                            : (state.loadedText = initLoadedText.slice(0, state.loadedText.length + 1));
                    }, 300);
                } else {
                    clearInterval(timer);
                    timer = null;
                }
            }
        );

        return {
            ...toRefs(state),
        };
    },
});
</script>

<style scoped lang="scss">
.requestLoading {
    z-index: 99999999;
    background-color: rgba($color: #000000, $alpha: 0.4);
    .loadingBox {
        top: 40%;
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
    }
}
</style>
