<template>
    <div class="videoDetail row flex-center">
        <div class="h-100 pb-5 layoutWidth overflow-scroll hideScrollBar d-flex justify-content-between">
            <div class="leftArea pe-5">
                <div class="d-flex align-items-center py-3 cursor-pointer" @click="$router.back()">
                    <arrow-left-icon color="#000000" width="18px" height="18px" />
                    <span class="ms-3 fs-4">视频详情</span>
                </div>
                <video controls :poster="videoDetail.coverUrl" :src="videoUrls && videoUrls.length ? videoUrls[0].url : ''" />
                <div class="mt-3 d-flex align-items-center justify-content-between">
                    <div class="d-flex align-items-center">
                        <div :style="{ backgroundImage: `url(&quot;${videoDetail.avatarUrl}&quot;)` }" class="videoAvatar rounded-pill me-3" />
                        <div class="text-muted canSelect">{{ videoDetail?.creator?.nickname }}</div>
                    </div>

                    <div
                        v-if="userFollows.map(item => item.userId).includes(videoDetail?.creator?.userId)"
                        class="haveFocus text-muted cursor-pointer text-dark px-4 py-2 rounded-pill flex-center"
                        @click="followUser(false)"
                    >
                        √已关注
                    </div>
                    <div v-else class="focus cursor-pointer text-dark px-4 py-2 rounded-pill flex-center" @click="followUser(true)">
                        + 关注
                    </div>
                </div>
                <div class="fs-4 fw-bold mt-4">{{ videoDetail.title }}</div>
                <div class="mt-3 text-muted opacity-50">
                    <span class="me-5">发布：{{ YYYYMMDD(videoDetail.publishTime) }}</span>
                    <span v-if="videoDetail.playCount">播放：{{ playCount(videoDetail.playCount) }}次</span>
                </div>
                <div class="d-flex mt-4 flex-wrap">
                    <div class="groupTag rounded-pill px-3" v-for="item in videoDetail.videoGroup" :key="item.id">{{ item.name }}</div>
                </div>
                <div class="mt-6 d-flex justify-content-start mt-4">
                    <div
                        v-if="videoDetailInfo.liked"
                        @click="likeMV(false)"
                        class="px-4 py-2 border border-1 rounded-pill cursor-pointer opBtn flex-center"
                    >
                        <PraiseIcon width="14px" height="14px" class="me-2 translate-y--10" color="red" />已赞({{
                            playCount(videoDetail.praisedCount)
                        }})
                    </div>
                    <div v-else @click="likeMV(true)" class="px-4 py-2 border border-1 rounded-pill cursor-pointer opBtn flex-center">
                        <PraiseIcon width="14px" height="14px" class="me-2 translate-y--10" />赞({{ playCount(videoDetail.praisedCount) }})
                    </div>

                    <div
                        v-if="collectedMVList.map(item => item.vid).includes(videoDetail.vid)"
                        @click="collectMV(false)"
                        class="px-4 py-2 border border-1 rounded-pill cursor-pointer opBtn flex-center"
                    >
                        <CollectBoxIcon color="red" width="16px" height="16px" class="me-2" />已收藏({{ playCount(videoDetail.subscribeCount) }})
                    </div>
                    <div v-else @click="collectMV(true)" class="px-4 py-2 border border-1 rounded-pill cursor-pointer opBtn flex-center">
                        <CollectBoxIcon width="16px" height="16px" class="me-2" />收藏({{ playCount(videoDetail.subscribeCount) }})
                    </div>

                    <div class="px-4 py-2 border border-1 rounded-pill cursor-pointer opBtn flex-center">
                        <ShareIcon width="16px" height="16px" class="me-2" />分享({{ playCount(videoDetail.shareCount) }})
                    </div>
                </div>
            </div>
            <div class="rightArea flex-grow-1 flex-shrink-0">
                <div class="fs-4 py-3">相关推荐</div>
                <div
                    v-for="(item, index) in recommendVideoList"
                    :key="index"
                    class="recVideoItem overflow-hidden rounded-3 mb-3 d-flex cursor-pointer"
                >
                    <div
                        class="recVideoCover bg-base text-white position-relative overflow-hidden rounded-3"
                        :style="{ backgroundImage: `url(${item.data.coverUrl})` }"
                    >
                        <div class="position-absolute top-0 end-0 pe-1 pt-1 d-flex align-items-center">
                            <hollow-play-icon width="11px" height="11px" class="translate-y--20" />
                            <span class="ms-1">{{ playCount(item.data.praisedCount) }}</span>
                        </div>
                        <div class="position-absolute bottom-0 end-0 pe-1 pb-1">
                            {{ playTime(item.data.playTime) }}
                        </div>
                    </div>
                    <div class="ms-3 recVideoInfo d-flex flex-column justify-content-center">
                        <div class="mb-2 fs-5">{{ item.data.title }}</div>
                        <div class="text-muted opacity-75 text-ellipsis">by {{ item.data?.creator?.nickname }}</div>
                    </div>
                </div>
            </div>
        </div>
        <CommonModal v-model:visible="modalVisible" @confirm="okCollection">
            <div class="text-center fs-5">确定不再收藏该视频？</div>
        </CommonModal>
    </div>
    <CommonToast ref="commonToast" />
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from "vue";
import { useRoute } from "vue-router";
import {
    getVideoDetailApi,
    getVideoUrlApi,
    getLikedMVApi,
    likeMVApi,
    getCollectedMVApi,
    collectVideoApi,
    getVideoDetailInfoApi,
    getRecommendVideoApi,
} from "@/api/video";
import { getUserFollowsApi } from "@/api/login";
import { followUserApi } from "@/api/common";
import { AxiosResponseProps } from "@/utils/request";
import { playCount, YYYYMMDD, playTime } from "@/hooks/useFilters";
export default defineComponent({
    setup() {
        const route = useRoute();
        const state = reactive({
            videoId: route.query.videoId,
            videoDetail: {},
            videoUrls: [],
            commonToast: null,
            userFollows: [],
            likedMVList: [],
            modalVisible: false,
            collectedMVList: [],
            videoDetailInfo: {},
            recommendVideoList: [],
        });
        const getVideoDetail = () => {
            return new Promise((resolve, reject) => {
                getVideoDetailApi({ id: state.videoId }).then(async (res: AxiosResponseProps) => {
                    if (res.code === 200) {
                        state.videoDetail = res.data;
                        await getVideoDetailInfo(res.data.vid);
                        resolve(null);
                    }
                });
            });
        };
        getVideoDetail();
        const getVideoUrl = () => {
            getVideoUrlApi({ id: state.videoId }).then((res: any) => {
                if (res.code === 200) {
                    state.videoUrls = res.urls;
                }
            });
        };
        getVideoUrl();
        const getUserFollows = () => {
            return new Promise((resolve, reject) => {
                getUserFollowsApi().then((res: any) => {
                    if (res.code === 200) {
                        state.userFollows = res.follow;
                        resolve(null);
                    }
                });
            });
        };
        getUserFollows();
        const followUser = isFocus => {
            followUserApi({ t: isFocus ? 1 : 0, id: (state.videoDetail as { creator: { userId: number | null } }).creator.userId }).then(
                async (res: AxiosResponseProps) => {
                    if (res.code === 200) {
                        await getUserFollows();
                        state.commonToast.success(isFocus ? "已关注" : "已取消关注");
                    }
                }
            );
        };
        const getLikedMV = () => {
            return new Promise((resolve, reject) => {
                getLikedMVApi().then((res: AxiosResponseProps) => {
                    if (res.code === 200) {
                        state.likedMVList = res.data.feeds;
                        resolve(null);
                    }
                });
            });
        };
        getLikedMV();
        const likeMV = isLiked => {
            likeMVApi({ id: (state.videoDetail as { vid: string | null }).vid, t: isLiked ? 1 : 0 }).then(async (res: AxiosResponseProps) => {
                if (res.code === 200) {
                    await getLikedMV();
                    await getVideoDetail();
                    state.commonToast.success(isLiked ? "已赞" : "已取消赞");
                } else {
                    state.commonToast.warn(res.msg);
                }
            });
        };
        const getCollectedMV = () => {
            getCollectedMVApi().then((res: any) => {
                if (res.code === 200) {
                    state.collectedMVList = res.data;
                }
            });
        };
        getCollectedMV();
        const getRecommendVideo = () => {
            getRecommendVideoApi().then((res: AxiosResponseProps) => {
                if (res.code === 200) {
                    state.recommendVideoList = res.datas;
                }
            });
        };
        getRecommendVideo();
        const collectMV = isCollected => {
            if (!isCollected) state.modalVisible = false;
            collectVideoApi({ t: isCollected ? 1 : 0, id: (state.videoDetail as { vid: string | null }).vid }).then(
                async (res: AxiosResponseProps) => {
                    if (res.code === 200) {
                        await getCollectedMV();
                        await getVideoDetail();
                        state.commonToast.success(isCollected ? "已收藏" : "已取消收藏");
                    }
                }
            );
        };
        const getVideoDetailInfo = vid => {
            return new Promise((resolve, reject) => {
                getVideoDetailInfoApi({ vid }).then((res: AxiosResponseProps) => {
                    if (res.code === 200) {
                        state.videoDetailInfo = res;
                        resolve(null);
                    }
                });
            });
        };
        return {
            ...toRefs(state),
            followUser,
            playCount,
            YYYYMMDD,
            playTime,
            likeMV,
            collectMV,
        };
    },
});
</script>

<style scoped lang="scss">
.videoDetail {
    height: calc(100vh - 60px);
    .leftArea {
        width: calc(21 * 29px);
        box-sizing: content-box;
        video {
            background-color: #000000;
            width: calc(21 * 29px);
            height: calc(12 * 29px);
        }
        .videoAvatar {
            width: 48px;
            height: 48px;
            background-size: cover;
            background-repeat: no-repeat;
        }
        .haveFocus {
            background-color: rgb(231, 231, 231);
        }
        .groupTag {
            background-color: rgb(238, 238, 238);
            padding: 2px 0;
            margin-bottom: 8px;
        }
        .groupTag ~ .groupTag {
            margin-left: 8px;
        }
        .opBtn {
            &:hover {
                background-color: rgba($color: #cccccc, $alpha: 0.12);
            }
        }
        .opBtn ~ .opBtn {
            margin-left: 8px;
        }
    }
    .rightArea {
        .recVideoItem {
            .recVideoCover {
                width: 140px;
                height: 80px;
            }
            .recVideoInfo {
                width: 140px;
                > div:first-child {
                    @include ellipsis(2);
                }
            }
        }
        .recVideoItem:last-of-type{
            padding-bottom: 1rem;
        }
    }
}
.primaryTheme {
    .focus {
        color: $primary !important;
        background-color: rgba($color: $primary, $alpha: 0.15);
    }
}
.darkTheme {
    .focus {
        color: $dark !important;
        background-color: rgba($color: $dark, $alpha: 0.15);
    }
}
.freeTheme {
    .focus {
        color: $free !important;
        background-color: rgba($color: $free, $alpha: 0.15);
    }
}
</style>
