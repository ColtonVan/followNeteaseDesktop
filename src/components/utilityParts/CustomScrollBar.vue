<template>
    <div class="h-100 customScrollBar position-absolute end-0 hideScrollBar" :style="{ width, top: `${outerNumberTop}px` }">
        <div
            @mousedown="handldownBar"
            class="position-absolute rounded-pill start-0 w-100"
            :style="{ backgroundColor: color, height: `${numberHeight}px`, top: `${innerNumberTop}px` }"
        ></div>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs } from "vue";
export default defineComponent({
    props: {
        width: {
            type: String,
            default: "8px",
        },
        color: {
            type: String,
            default: "#e0e0e0",
        },
        listId: {
            type: String,
            required: true,
        },
    },
    setup(props) {
        const state = reactive({
            numberHeight: 0,
            outerNumberTop: 0,
            innerNumberTop: 0,
        });
        let list, listScrollHeight, listClientHeight, listScrollTop;
        onMounted(() => {
            setTimeout(() => {
                list = document.getElementById(props.listId as string);
                listScrollHeight = list.scrollHeight;
                listClientHeight = list.clientHeight;
                state.numberHeight = listClientHeight * (listClientHeight / listScrollHeight);
                list.addEventListener("scroll", () => {
                    listScrollTop = list.scrollTop;
                    state.outerNumberTop = listScrollTop;
                    state.innerNumberTop = listClientHeight * (listScrollTop / listScrollHeight);
                    if (listScrollTop == 0) {
                        state.innerNumberTop = 0;
                    }
                    if (listScrollTop > listScrollHeight - listClientHeight) {
                        state.innerNumberTop = listClientHeight - state.numberHeight;
                    }
                });
            });
        });
        let pageDownY = 0;
        let downInnerNumberTop = 0;
        let downScrollTop = 0;
        let haveDown = false;
        const handldownBar = e => {
            haveDown = true;
            pageDownY = e.pageY;
            downInnerNumberTop = state.innerNumberTop;
            downScrollTop = list.scrollTop;
        };
        window.addEventListener("mousemove", e => {
            if (haveDown) {
                let difPageY = e.pageY - pageDownY;
                state.innerNumberTop = downInnerNumberTop + difPageY;
                list.scrollTop = downScrollTop + listScrollHeight * (difPageY / listClientHeight);
                if (difPageY + downInnerNumberTop < 0) {
                    state.innerNumberTop = 0;
                    list.scrollTop = 0;
                }
                if (downInnerNumberTop + difPageY + state.numberHeight > listClientHeight) {
                    state.innerNumberTop = listClientHeight - state.numberHeight;
                    list.scrollTop = listScrollHeight - listClientHeight;
                }
            }
        });
        window.addEventListener("mouseup", () => {
            haveDown = false;
        });
        return {
            ...toRefs(state),
            handldownBar,
        };
    },
});
</script>

<style scoped lang="scss">
.customScrollBar {
    overflow-y: scroll;
    > div {
        &:hover,
        &:active {
            &::before {
                content: "";
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                border-radius: 50rem;
                background-color: rgba($color: #000000, $alpha: 0.3);
            }
        }
    }
}
</style>
