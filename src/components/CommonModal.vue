<template>
    <teleport to=".main" v-if="modalVisible && canRender">
        <div ref="modalRef" class="CommonModal d-flex flex-column align-items-center bg-white">
            <div ref="dragRef" class="cursor-move title d-flex justify-content-center align-items-end">
                <div class="fs-5">{{ title }}</div>
                <CloseIcon @click="modalVisible = false" class="cursor-pointer" width="20px" height="20px" />
            </div>
            <div class="content">
                <div class="main" :style="bodyStyle" :class="bodyClass">
                    <slot name="default" />
                </div>
                <div>
                    <slot v-if="$slots.buttons" name="buttons" />
                    <div v-else @click="$emit('confirm')" class="okBtn cursor-pointer d-flex justify-content-center align-items-center">
                        {{ okText }}
                    </div>
                </div>
            </div>
        </div>
    </teleport>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref, toRefs, watch } from "vue";
import useDragMove from "@/hooks/useDragMove";
export default defineComponent({
    emits: ["update:visible", "confirm"],
    props: {
        visible: {
            type: Boolean,
            default: true,
        },
        title: {
            type: String,
            default: "",
        },
        okText: {
            type: String,
            default: "确定",
        },
        bodyStyle: {
            type: String,
            default: "",
        },
        bodyClass: {
            type: String,
            default: "",
        },
    },
    setup(props, context) {
        const state = reactive({
            modalVisible: computed({
                get: () => props.visible,
                set: newV => context.emit("update:visible", newV),
            }),
            canRender: false,
        });
        const modalRef = ref(null);
        const dragRef = ref(null);
        onMounted(() => {
            state.canRender = true; //teleport标签必须检测到to指定的元素已经存在才能渲染
        });
        watch(
            () => state.modalVisible,
            newV => {
                if (newV) {
                    useDragMove(modalRef, dragRef);
                }
            }
        );
        return {
            ...toRefs(state),
            modalRef,
            dragRef,
        };
    },
});
</script>

<style scoped lang="scss">
.CommonModal {
    position: fixed;
    z-index: 999;
    top: 50vh;
    left: 50vw;
    transform: translate(-50%, -50%);
    width: 500px;
    min-height: 240px;
    background-color: #fff;
    border-radius: 6px;
    box-shadow: 0 0 2px 1.5px rgba($color: #000000, $alpha: 0.075);
    box-sizing: border-box;
    .title {
        font-weight: bold;
        width: 100%;
        height: 80px;
        padding-bottom: 22px;
        position: relative;
        > svg {
            position: absolute;
            top: 14px;
            right: 14px;
            filter: invert(0.5);
        }
    }
    .content {
        width: calc(100% - 36px * 2);
        flex: 1;
        position: relative;
        margin: 0 36px 26px;
        box-sizing: border-box;
        .main {
            min-height: 90px;
            margin-bottom: 46px;
        }
        .okBtn {
            width: 106px;
            height: 38px;
            border-radius: 20px;
            position: absolute;
            right: 0;
            bottom: 0;
            color: #fff;
            &:hover {
                filter: invert(0.08);
            }
        }
    }
}
.primaryTheme {
    .okBtn {
        background-color: $primary;
    }
}
.darkTheme {
    .okBtn {
        background-color: $dark;
    }
}
.freeTheme {
    .okBtn {
        background-color: $free;
    }
}
</style>
