<template>
    <div v-loadMore="scrollList" class="videoList hideScrollBar overflow-scroll w-100 d-flex flex-wrap justify-content-between align-items-start">
        <LoadingComponent v-if="isLoading && !groupList.length" />
        <div
            @mouseenter="item.showPre = true"
            @mouseleave="item.showPre = false"
            class="videoItem overflow-hidden rounded-8 mb-4 position-relative cursor-pointer"
            v-for="(item, index) in groupList"
            :key="index"
        >
            <img class="position-absolute top-0 start-0" :src="item.data.coverUrl" alt="" />
            <img v-show="!item.showPre" class="position-absolute top-0 start-0" :src="item.data.coverUrl" alt="" />
            <img v-if="item.showPre" class="position-absolute top-0 start-0" :src="item.data.previewUrl || item.data.coverUrl" alt="" />
            <div class="playCountLine position-absolute d-flex align-items-center">
                <HollowPlayIcon width="12" height="12" />
                <span class="text-white ms-1">{{ playCount(item.data.playCount) }}</span>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, toRefs, watch } from "vue";
import { getGroupVideoApi, getRecommendVideoApi } from "@/api/video";
import { playCount } from "@/hooks/useFilters";
let getGroupVideo = null;
let nextPage = null;
export default defineComponent({
    props: {
        id: {
            type: Number,
            default: 0,
        },
    },
    directives: {
        loadMore: {
            mounted(el, binding, vnode, prevVNode) {
                el.addEventListener("scroll", e => {
                    let { clientHeight, scrollTop, scrollHeight } = e.target;
                    console.log({ clientHeight, scrollTop, scrollHeight });
                    if (clientHeight + scrollTop >= scrollHeight) {
                        nextPage();
                        getGroupVideo();
                    }
                });
            },
        },
    },
    setup(props, context) {
        const state = reactive({
            groupId: computed({
                get: () => props.id,
                set: newV => context.emit("update:id", newV),
            }),
            groupList: [],
            page: 1,
            isLoading: false,
            hasMore: true,
        });
        watch(
            () => props.id,
            newV => {
                state.page = 1;
                state.groupList = [];
                getGroupVideo();
            }
        );
        getGroupVideo = () => {
            state.isLoading = true;
            let apiFun = getGroupVideoApi;
            let params: any = { offset: (state.page - 1) * 8 };
            if (state.groupId === 0) {
                apiFun = getRecommendVideoApi;
                params = { ...params };
            } else {
                params = { ...params, id: state.groupId };
            }
            apiFun(params)
                .then((res: any) => {
                    state.isLoading = false;
                    if (res.code === 200) {
                        state.groupList = state.groupList.concat(res.datas);
                        if (state.groupList.length < 24 && res.datas.length) {
                            nextPage();
                            getGroupVideo();
                        }
                    }
                })
                .catch(err => {
                    state.isLoading = true;
                });
        };
        getGroupVideo();
        nextPage = () => {
            state.page++;
        };
        const scrollList = () => {};
        return {
            ...toRefs(state),
            scrollList,
            playCount
        };
    },
});
</script>

<style scoped lang="scss">
.videoList {
    .videoItem {
        padding-left: 23%;
        padding-top: 13%;
        width: 0;
        height: 0;
        > img {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
        > img:nth-child(1) {
            object-fit: cover;
        }
        > img:nth-child(2) {
            // display: none;
            // visibility: hidden;
        }
        &:hover {
            > img:nth-child(2) {
                // display: inline-block;
                // visibility: visible;
            }
        }
        .playCountLine {
            top: 3px;
            right: 8px;
        }
    }
}
</style>
