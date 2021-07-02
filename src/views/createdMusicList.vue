<template>
    <div class="pb-5 d-flex">
        <img :src="playListDetail.coverImgUrl" width="190" class="rounded-5 me-5" alt="" />
        <div class="flex-grow-1">
            <div class="d-flex align-items-center">
                <div class="MusicListTag rounded flex-center me-2">歌单</div>
                <div class="fs-3 fw-bold canSelect text-ellipsis flex-grow-1" style="width: 0;">{{ playListDetail.name }}</div>
            </div>
            <div class="d-flex align-items-center mt-3">
                <img width="35" class="rounded-pill me-3 cursor-pointer" :src="playListDetail.creator?.avatarUrl" alt="" />
                <a class="me-3 cursor-pointer">{{ playListDetail.creator?.nickname }}</a>
                <span class="text-muted">{{ YYYYMMDD(playListDetail.createTime) }}创建</span>
            </div>
            <div class="mt-4">
                <PlayAllListBtn :musicList="playListDetail.tracks" />
            </div>
            <div class="mt-4">
                <span class="me-3"
                    >歌曲：<span class="text-black-50">{{ playListDetail.trackCount }}</span></span
                >
                <span
                    >播放：<span class="text-black-50">{{ playListDetail.playCount }}</span></span
                >
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
    <CommonToast ref="toastRef" />
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent, reactive, ref, Ref, toRefs, watch } from "vue";
import { getPlayListDetailApi } from "@/api/playList";
import { useRoute } from "vue-router";
import { playTime, YYYYMMDD, addHaveUrl } from "@/hooks/useFilters";
import { useStore } from "vuex";
import { likeMusic } from "@/api/discover";
import { ColumnProps } from "@/components/viewParts/MusicList.vue";
import { NavsProps } from "@/components/viewParts/HorizontalNav.vue";
import { downloadMusic } from "@/utils/file";
import { getSongUrlApi } from "@/api/song";
import { AxiosResponseProps } from "@/utils/request";
export default defineComponent({
    setup() {
        const route = useRoute();
        const store = useStore();
        const state = reactive<{
            columns: ColumnProps[];
            playListDetail?: object;
            navs: NavsProps[];
            likedMusicList: ComputedRef<unknown[]>;
            toastRef: Ref;
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
            playListDetail: { coverImgUrl: "https://p1.music.126.net/jWE3OEZUlwdz0ARvyQ9wWw==/109951165474121408.jpg" },
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
        });

        const getPlayListDetail = async id => {
            getPlayListDetailApi({ id, t: Date.now() }).then(async (res: any) => {
                if (res.code === 200) {
                    state.playListDetail = { ...res.playlist, tracks: await addHaveUrl(res.playlist.tracks) };
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
            () => route.query.id,
            newV => {
                getPlayListDetail(newV);
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
        };
    },
});
</script>

<style scoped lang="scss">
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
