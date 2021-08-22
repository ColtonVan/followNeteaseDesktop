<template>
    <div class="px-5 py-4">
        <div class="pb-5 d-flex">
            <img :src="playListDetail.coverImgUrl" width="190" height="190" class="rounded-5 me-5 coverImg" alt="" />
            <div class="flex-grow-1">
                <div class="d-flex align-items-center">
                    <div class="MusicListTag rounded flex-center me-2">歌单</div>
                    <div class="fs-3 fw-bold canSelect text-ellipsis" style="max-width: 400px;">{{ playListDetail.name }}</div>
                    <EditOutlinedIcon
                        v-if="playListDetail?.creator?.userId == userInfo.userId"
                        @click="$router.push({ path: '/container/updateMusicList', query: { id: playListDetail.id } })"
                        @mouseover="EditOutlinedIconActive = true"
                        @mouseout="EditOutlinedIconActive = false"
                        :color="EditOutlinedIconActive ? '#333' : '#9a9a9a'"
                        class="ms-3"
                        width="18"
                        height="18"
                    />
                </div>
                <div class="d-flex align-items-center mt-2">
                    <img width="35" class="rounded-pill me-3 cursor-pointer" :src="playListDetail.creator?.avatarUrl" alt="" />
                    <a class="me-3 cursor-pointer">{{ playListDetail.creator?.nickname }}</a>
                    <span class="text-muted">{{ YYYYMMDD(playListDetail.createTime) }}创建</span>
                </div>
                <div class="mt-3">
                    <PlayAllListBtn :musicList="playListDetail.tracks" />
                </div>
                <div class="mt-3 mb-1">
                    <span>标签：</span>
                    <span class="colorA" v-for="(tag, tagIndex) in playListDetail.tags" :key="tagIndex">
                        <span class="cursor-pointer">{{ tag }}</span>
                        <span class="text-muted px-1" v-if="tagIndex != playListDetail.tags.length - 1">/</span>
                    </span>
                    <span v-if="!playListDetail.tags.length" class="text-black-50">无</span>
                </div>
                <div class="mb-1">
                    <span class="me-3"
                        >歌曲：<span class="text-black-50">{{ playListDetail.trackCount }}</span></span
                    >
                    <span
                        >播放：<span class="text-black-50">{{ playCount(playListDetail.playCount) }}</span></span
                    >
                </div>
                <div class="d-flex justify-content-between" v-bind="{ ...(playListDetail.description ? { title: playListDetail.description } : {}) }">
                    <span class="d-flex align-items-start flex-grow-1">
                        <div class="d-flex align-items-start">
                            简介：
                        </div>
                        <div
                            v-if="!playListDetail.description && playListDetail?.creator?.userId == userInfo.userId"
                            class="colorA cursor-pointer"
                            @click="$router.push({ path: '/container/updateMusicList', query: { id: playListDetail.id, desc: 'true' } })"
                        >
                            添加简介
                        </div>
                        <div
                            ref="descRef"
                            class="canSelect text-black-50"
                            style="word-break: break-all;"
                            :class="{ 'text-ellipsis': !iconIsUp, 'flex-grow-1': iconIsUp }"
                            :style="{ width: iconIsUp ? '0' : '400px' }"
                            v-else
                        >
                            {{ playListDetail.description || "无" }}
                        </div>
                    </span>
                    <DownArrowIcon
                        v-if="showDownArrowIcon"
                        @click="iconIsUp = !iconIsUp"
                        :class="{ 'rotate-180': iconIsUp }"
                        width="14"
                        height="14"
                        color="#6c757d"
                    />
                </div>
            </div>
        </div>
        <HorizontalNav v-model:navs="navs" class="pb-2" />
        <MusicList
            v-if="navs.find(item => item.active).key === 0"
            :columns="columns"
            :dataSource="playListDetail.tracks?.map((item, index) => ({ ...item, index: index }))"
        >
            <template #toolBar="{id:musicId,index,name}">
                <span class="text-muted me-3">{{ String(index + 1).padStart(2, "0") }}</span>
                <span class="me-3">
                    <LikedIcon
                        class="cursor-pointer"
                        v-if="!likedMusicList.includes(musicId)"
                        @click="collectMusic(true, musicId)"
                        width="15"
                        height="15"
                    />
                    <HaveLikedIcon class="cursor-pointer" v-else @click="collectMusic(false, musicId)" width="15" height="15" />
                </span>
                <DownloadMusicIcon @click="handleDownloadMusic({ id: musicId, name })" class="cursor-pointer" width="15" height="15" />
            </template>
        </MusicList>
    </div>
    <CommonToast ref="toastRef" />
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent, nextTick, reactive, ref, Ref, toRefs, watch } from "vue";
import { getPlayListDetailApi } from "@/api/playList";
import { useRoute } from "vue-router";
import { playTime, YYYYMMDD, addHaveUrl, playCount } from "@/hooks/useFilters";
import { useStore } from "vuex";
import { likeMusic } from "@/api/discover";
import { ColumnProps } from "@/components/viewParts/MusicList.vue";
import { NavsProps } from "@/components/viewParts/HorizontalNav.vue";
import { downloadMusic } from "@/utils/file";
import { getSongUrlApi } from "@/api/song";
import { AxiosResponseProps } from "@/utils/request";
import ArrowRightIcon from "@/components/svgIcons/ArrowRightIcon.vue";
export default defineComponent({
    components: { ArrowRightIcon },
    setup() {
        const route = useRoute();
        const store = useStore();
        const state = reactive<{
            columns: ColumnProps[];
            playListDetail?: object;
            navs: NavsProps[];
            likedMusicList: ComputedRef<unknown[]>;
            toastRef: Ref;
            EditOutlinedIconActive: boolean;
            userInfo: ComputedRef;
            iconIsUp: boolean;
            descRef: Ref;
            showDownArrowIcon: boolean;
        }>({
            columns: [
                {
                    title: "",
                    span: 1,
                    dataIndex: "toolBar",
                    slots: { customRender: "toolBar" },
                },
                {
                    title: "音乐标题",
                    span: 3,
                    dataIndex: "name",
                },
                {
                    title: "歌手",
                    span: 3,
                    dataIndex: "ar",
                    render: text => {
                        return text.map(item => item.name).join("、");
                    },
                },
                {
                    title: "专辑",
                    span: 2,
                    dataIndex: "al",
                    render: text => {
                        return text.name;
                    },
                },
                {
                    title: "时长",
                    span: 1,
                    dataIndex: "dt",
                    render: text => {
                        return playTime(text);
                    },
                },
            ],
            playListDetail: { coverImgUrl: "https://p1.music.126.net/jWE3OEZUlwdz0ARvyQ9wWw==/109951165474121408.jpg", tags: [] },
            navs: [
                {
                    title: "歌曲列表",
                    active: true,
                    key: 0,
                },
                {
                    title: computed(() => `评论(${state.playListDetail.commentCount || 0})`),
                    key: 1,
                },
                {
                    title: "收藏者",
                    key: 2,
                },
            ],
            likedMusicList: computed(() => store.state.likedMusicList),
            toastRef: ref(null),
            EditOutlinedIconActive: false,
            userInfo: computed(() => store.state.userInfo),
            iconIsUp: false,
            descRef: ref(null),
            showDownArrowIcon: false,
        });
        const getPlayListDetail = async id => {
            getPlayListDetailApi({ id, t: Date.now() }).then(async (res: any) => {
                if (res.code === 200) {
                    //addHaveUrl格式化歌单，添加是否能播放的标识haveUrl，既修改原数组又返回修改后的数组
                    state.playListDetail = { ...res.playlist, tracks: await addHaveUrl(res.playlist.tracks) };
                    nextTick(() => {
                        state.showDownArrowIcon = state.descRef.scrollWidth > state.descRef.offsetWidth;
                    });
                    //立即播放
                    if (route.query.immediate == "true") {
                        if (!res.playlist.tracks.length) return state.toastRef.warn("歌单暂无歌曲，请去添加一些吧~");
                        store.commit("changeCurrentMusicDetail", res.playlist.tracks[0]);
                        store.commit("changeCurrentPlayList", [...JSON.parse(JSON.stringify(res.playlist.tracks)), ...store.state.currentPlayList]);
                        store.dispatch("getCurrentMusicUrlInfo", { id: res.playlist.tracks[0].id });
                    }
                    //下载全部
                    if (route.query.download == "true") {
                        if (!res.playlist.tracks.length) return state.toastRef.warn("歌单暂无歌曲，请添加一些再来下载吧~");
                        res.playlist.tracks.forEach((item, index) => {
                            setTimeout(() => {
                                handleDownloadMusic({ id: item.id, name: item.name });
                            }, 60 * index);
                        });
                    }
                }
            });
            await store.dispatch("getLikedMusicList");
        };
        const collectMusic = (like, id) => {
            likeMusic({ id, like }).then(async (res: any) => {
                if (res.code === 200) {
                    await store.dispatch("getLikedMusicList");
                    state.toastRef.success(like ? "已添加到我喜欢的音乐" : "取消喜欢成功");
                }
            });
        };
        watch(
            () => route.query,
            newV => {
                getPlayListDetail(newV.id);
            },
            { immediate: true }
        );
        const handleDownloadMusic = ({ id, name }) => {
            getSongUrlApi({ id }).then((res: AxiosResponseProps) => {
                if (res.code === 200) {
                    let urls = res.data;
                    if (urls && urls.length) {
                        downloadMusic(urls[0].url, name)
                            .then(() => {
                                state.toastRef.success("已添加至下载");
                            })
                            .catch(() => {
                                state.toastRef.warn("下载失败");
                            });
                    } else {
                        state.toastRef.warn("获取音乐链接失败");
                    }
                }
            });
        };
        return {
            ...toRefs(state),
            YYYYMMDD,
            collectMusic,
            handleDownloadMusic,
            playCount,
        };
    },
});
</script>

<style scoped lang="scss">
.coverImg {
    object-fit: cover;
}
.MusicListTag {
    height: 18px;
    width: 32px;
}
.primaryTheme {
    .MusicListTag {
        border: 1px solid $primary;
        color: $primary;
    }
}
.darkTheme {
    .MusicListTag {
        border: 1px solid $dark;
        color: $dark;
    }
}
.freeTheme {
    .MusicListTag {
        border: 1px solid $free;
        color: $free;
    }
}
</style>
