<template>
    <div @mousedown="mousedownProgressLine" ref="progressRef" class="progressOuter py-2 mx-3 opacity-75 cursor-pointer">
        <div class="progress cursor-pointer" style="overflow:inherit;" :style="{ height, width }">
            <div
                class="progress-bar position-relative"
                role="progressbar"
                style="transition: none !important;"
                :style="{ width: `${modelValue}%` }"
                :aria-valuenow="modelValue"
                aria-valuemin="0"
                aria-valuemax="100"
            >
                <div
                    @mousedown="mouseDownProgressDot"
                    ref="proDot"
                    class="rounded-circle position-absolute p-2 proDot"
                ></div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, toRefs, watch } from "vue";

export default defineComponent({
    props: {
        width: {
            type: String,
            default: "360px",
        },
        height: {
            type: String,
            default: "3px",
        },
        modelValue: {
            type: Number,
            default: 50,
        },
    },
    emits:["update:modelValue","change"],
    setup(props, { emit }) {
        const state = reactive({
            progress: computed({ get: () => props.modelValue, set: newV => emit("update:modelValue", newV) }),
            initPageX: 0,
            innerWidth: 0,
            initModelValue: 0,
            isDrag: false,
            progressRef: null,
            proDot: null,
            clientWidth: computed(() => state.progressRef?.clientWidth || 0),
            proDotWidth: computed(() => state.proDot?.clientWidth || 0),
        });
        const mouseDownProgressDot = (e: MouseEvent) => {
            state.initModelValue = props.modelValue;
            state.isDrag = true;
            state.initPageX = e.pageX;
        };
        window.addEventListener("mousemove", (e: MouseEvent) => {
            if (state.isDrag) {
                let moveValue = state.initModelValue + ((e.pageX - state.initPageX) / state.clientWidth) * 100;
                if (moveValue < 0) moveValue = 0;
                if (moveValue > 100) moveValue = 100;
                emit("change",moveValue);
                emit("update:modelValue", moveValue);
            }
        });
        window.addEventListener("mouseup", () => {
            state.isDrag = false;
        });
        const mousedownProgressLine = (e: MouseEvent) => {
            let offsetLeft = (e.currentTarget as HTMLElement).offsetLeft;
            let downProgress = ((e.pageX - offsetLeft) / state.clientWidth) * 100;
            emit("change",downProgress);
            emit("update:modelValue", downProgress);
        };
        return {
            ...toRefs(state),
            mouseDownProgressDot,
            mousedownProgressLine,
        };
    },
});
</script>

<style scoped lang="scss">
.progressOuter {
    .progress {
        .progress-bar {
            position: relative;
            border-top-left-radius: 0.4rem;
            border-bottom-left-radius: 0.4rem;
            overflow: inherit;
            .proDot {
                right: 0;
                top: 0;
                transform: translate(50%, -30%);
                display: none;
            }
        }
    }
    &:hover,
    &:active {
        .progress {
            height: 5px !important;
            transform: translateY(-12.5%);
            .progress-bar {
                height: 5px !important;
                .proDot {
                    display: inline-block;
                }
            }
        }
    }
}
.primaryTheme {
    .progress-bar {
        background-color: $primary;
        &:after {
            background-color: $primary;
        }
    }
    .proDot {
        background-color: $primary;
    }
}
.darkTheme {
    .progress-bar {
        background-color: $dark;
        &:after {
            background-color: $dark;
        }
    }
    .proDot {
        background-color: $dark;
    }
}
.freeTheme {
    .progress-bar {
        background-color: $free;
        &:after {
            background-color: $free;
        }
    }
    .proDot {
        background-color: $free;
    }
}
</style>
