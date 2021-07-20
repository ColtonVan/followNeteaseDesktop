<template>
    <teleport to="body" v-if="visible">
        <div
            class="commonToast position-absolute top-50 start-50 translate-middle rounded-8 d-flex px-5 justify-content-center align-items-center"
            :class="{ closeToast: startCloseAni }"
        >
        <span class="me-3" v-if="icon === 'success'">
            <SuccessTipsIcon width="48" height="48" />
        </span>
        <span class="me-3" v-if="icon === 'warn' || icon === 'warnning'">
            <ExclamationIcon width="42" height="42" />
        </span>
        <span class="text-white fs-5">{{ tips }}</span>
        </div>
    </teleport>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from "vue";
export default defineComponent({
    setup() {
        const state = reactive({
            visible: false,
            icon: "success",
            duration: 1200,
            startCloseAni: false,
            tips: ""
        });
        const success = (tips: string, options?: { duration: number }) => {
            state.duration = options && options.duration && options.duration !== 0 ? options.duration : 1200;
            state.tips = tips;
            state.icon = "success";
            startAni();
        };
        const warn = (tips: string, options?: { duration: number }) => {
            state.duration = options && options.duration && options.duration !== 0 ? options.duration : 1200;
            state.tips = tips;
            state.icon = "warn";
            startAni();
        };
        const error = warn;
        let timer1 = null;
        let timer2 = null;
        const startAni = () => {
            if (timer1) {
                clearTimeout(timer1);
                timer1 = null;
            }
            if (timer2) {
                clearTimeout(timer2);
                timer2 = null;
            }
            state.visible = true;
            timer1 = setTimeout(() => {
                state.startCloseAni = true;
                timer2 = setTimeout(() => {
                    state.startCloseAni = false;
                    state.visible = false;
                }, 800);
            }, state.duration);
        };
        return {
            ...toRefs(state),
            success,
            warn,
            error
        };
    },
});
</script>

<style scoped lang="scss">
.commonToast {
    z-index: 999999;
    min-width: 320px;
    height: 96px;
    background-color: rgba($color: #000000, $alpha: 0.8);
}
.closeToast {
    opacity: 1;
    animation: opacityAni 0.8s;
}
@keyframes opacityAni {
    from {
        opacity: 1;
    }
    to {
        opacity: 0;
    }
}
</style>
