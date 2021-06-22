<template>
    <div v-loadMore="scrollList" class="videoList hideScrollBar overflow-scroll w-100 d-flex flex-wrap justify-content-between align-items-start">
        <div
            @mouseenter="item.showPre = true"
            @mouseleave="item.showPre = false"
            @click="$router.push({ name: 'videoDetail', query: { videoId: item.data.vid } })"
            class="videoItem mb-4 position-relative cursor-pointer"
            v-for="(item, index) in groupList"
            :key="index"
        >
            <div class="videoItemInner position-absolute start-0 top-0 w-100 h-100">
                <img class="rounded-6" :src="item.data.coverUrl" alt="" />
                <img v-show="!item.showPre" class="rounded-6 position-absolute start-0 left-0" :src="item.data.coverUrl" alt="" />
                <img
                    v-if="item.showPre"
                    class="rounded-6 position-absolute start-0 left-0"
                    :src="item.data.previewUrl || item.data.coverUrl"
                    alt=""
                />
                <div class="playCountLine position-absolute d-flex align-items-center">
                    <HollowPlayIcon width="12" height="12" />
                    <span class="text-white ms-1">{{ playCount(item.data.playCount || item.data.praisedCount) }}</span>
                </div>
                <div class="playTime position-absolute">{{ playTime(item.data.playTime) }}</div>
                <div class="videoTitle">{{ item.data.title }}</div>
                <div class="videoDes text-secondary opacity-50">by {{ item.data.creator?.nickname }}</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, toRefs, watch } from "vue";
import { getGroupVideoApi, getRecommendVideoApi } from "@/api/video";
import { playCount } from "@/hooks/useFilters";
import { playTime } from "@/hooks/useFilters";
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
            let apiFun = getGroupVideoApi;
            let params: any = { offset: (state.page - 1) * 8 };
            if (state.groupId === 0) {
                apiFun = getRecommendVideoApi;
                params = { ...params };
            } else {
                params = { ...params, id: state.groupId };
            }
            apiFun(params).then((res: any) => {
                if (res.code === 200) {
                    state.groupList = state.groupList.concat(res.datas);
                    if (state.groupList.length < 24 && res.datas.length) {
                        nextPage();
                        getGroupVideo();
                    }
                }
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
            playCount,
            playTime,
        };
    },
});
</script>

<style scoped lang="scss">
.videoList {
    .videoItem {
        padding-left: 24%;
        padding-top: calc(15% + 3rem);
        width: 0;
        height: 0;
        .videoItemInner {
            > img {
                width: 100%;
                height: calc(87% - 3rem);
                object-fit: contain;
            }
            > img:nth-child(1) {
                object-fit: cover;
            }
            .playCountLine {
                top: 3px;
                right: 8px;
            }
            .videoTitle {
                margin-top: 5%;
            }
            .videoDes {
                margin-top: 1%;
            }
            .videoTitle,
            .videoDes {
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
            }
            .playTime {
                top: calc(87% - 3rem - 1.6rem);
                right: 0.6rem;
                color: #ffffff;
            }
        }
    }
}
</style>
