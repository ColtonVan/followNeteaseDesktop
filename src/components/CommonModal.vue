<template>
    <teleport to=".app" v-if="modalVisible && canRender">
        <div ref="modalRef" class="CommonModal d-flex flex-column align-items-center bg-white">
            <div @mousedown="handleMouseDown" class="cursor-move title d-flex justify-content-center align-items-end">
                <div>{{ title }}</div>
                <CloseIcon @click="modalVisible = false" class="cursor-pointer" width="20px" height="20px" />
            </div>
            <div class="content">
                <div class="main" :style="bodyStyle" :class="bodyClass">
                    <slot name="default" />
                </div>
                <div @click="$emit('confirm')" class="okBtn cursor-pointer d-flex justify-content-center align-items-center">
                    {{ okText }}
                </div>
            </div>
        </div>
    </teleport>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref, toRefs } from "vue";
export default defineComponent({
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
            modalRef: ref<null | HTMLDivElement>(null),
            canRender: false,
        });
        let startClientX = 0;
        let startClientY = 0;
        let startOffsetLeft = 0;
        let startOffsetTop = 0;
        let canDrag = false;
        let modalDom: HTMLDivElement;
        onMounted(() => {
            state.canRender = true; //teleport标签必须检测到to指定的元素已经存在才能渲染
        });
        const getWindowWidth = () => {
            //获取窗口宽度
            if (window.innerWidth) {
                //兼容DOM
                return window.innerWidth;
            } else if (document.body && document.body.clientWidth) {
                //兼容IE
                return document.body.clientWidth;
            }
            return 0;
        };
        const getWindowHeight = () => {
            //获取窗口高度
            if (window.innerHeight) {
                //兼容DOM
                return window.innerHeight;
            } else if (document.body && document.body.clientHeight) {
                //兼容IE
                return document.body.clientHeight;
            }
            return 0;
        };
        const handleMouseDown = (e: MouseEvent) => {
            canDrag = true;
            modalDom = state.modalRef as HTMLDivElement;
            startClientX = e.clientX;
            startClientY = e.clientY;
            startOffsetLeft = modalDom.offsetLeft;
            startOffsetTop = modalDom.offsetTop;
        };
        const handleMouseMove = (e: MouseEvent) => {
            if (canDrag) {
                let difX = e.clientX - startClientX;
                let difY = e.clientY - startClientY;
                let currentLeft = difX + startOffsetLeft;
                let currentTop = difY + startOffsetTop;
                if (currentLeft - modalDom.offsetWidth / 2 < 0) {
                    currentLeft = modalDom.offsetWidth / 2;
                }
                if (currentTop - modalDom.offsetHeight / 2 < 0) {
                    currentTop = modalDom.offsetHeight / 2;
                }
                if (currentLeft + modalDom.offsetWidth - modalDom.offsetWidth / 2 > getWindowWidth()) {
                    currentLeft = getWindowWidth() - modalDom.offsetWidth + modalDom.offsetWidth / 2;
                }
                if (currentTop + modalDom.offsetHeight - modalDom.offsetHeight / 2 > getWindowHeight()) {
                    currentTop = getWindowHeight() - modalDom.offsetHeight + modalDom.offsetHeight / 2;
                }
                modalDom.style.left = currentLeft + "px";
                modalDom.style.top = currentTop + "px";
            }
        };
        const handleMouseUp = (e: MouseEvent) => {
            canDrag = false;
        };
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
        return {
            ...toRefs(state),
            handleMouseDown,
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
        padding-bottom: 16px;
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
