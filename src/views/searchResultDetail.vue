<template>
    <HorizontalNav :navs="navs" />
    <musicList
        :columns="columns"
        :dataSource="dataSource?.map((item, index) => ({ ...item, index: index }))"
        emptyText="暂无搜索结果，搜搜其他关键词吧~"
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
    </musicList>
    <CommonToast ref="toastRef" />
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent, reactive, ref, Ref, toRefs, watch } from "vue";
import { NavsProps } from "@/components/viewParts/HorizontalNav.vue";
import { searchApi, cloudsearchApi } from "@/api/search";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import MusicList, { ColumnProps } from "@/components/viewParts/MusicList.vue";
import { playTime, YYYYMMDD, addHaveUrl } from "@/hooks/useFilters";
import { likeMusic } from "@/api/discover";
import { downloadMusic } from "@/utils/file";
import { AxiosResponseProps } from "@/utils/request";
import { getSongUrlApi } from "@/api/song";
export default defineComponent({
    components: { MusicList },
    setup() {
        const route = useRoute();
        const store = useStore();
        const state = reactive<{
            navs: NavsProps[];
            keywords: ComputedRef<string>;
            songs: any[];
            columns: ColumnProps[];
            dataSource: any[];
            likedMusicList: ComputedRef<unknown[]>;
            toastRef: Ref;
        }>({
            navs: [{ title: "单曲", active: true }],
            keywords: computed(() => route.query.keyword as string),
            songs: [],
            columns: [
                {
                    title: "",
                    span: 1,
                    dataIndex: "toolBar",
                    slots: { customRender: "toolBar" },
                },
                {
                    title: "音乐标题",
                    dataIndex: "name",
                    span: 3,
                    slots: { customRender: "name" },
                },
                {
                    title: "歌手",
                    dataIndex: "ar",
                    span: 3,
                    render: text => {
                        return text.map(item => item.name).join("、");
                    },
                },
                {
                    title: "专辑",
                    dataIndex: "al",
                    span: 2,
                    render: text => {
                        return text.name;
                    },
                },
                {
                    title: "时长",
                    dataIndex: "dt",
                    span: 1,
                    render: text => {
                        return playTime(text);
                    },
                },
            ],
            dataSource: [],
            likedMusicList: computed(() => store.state.likedMusicList),
            toastRef: ref(null),
        });
        watch(
            () => state.keywords,
            async newV => {
                if (newV) {
                    cloudsearchApi({ keywords: newV, type: 1 }).then(async (res: any) => {
                        if (res.code === 200) {
                            state.dataSource = await addHaveUrl(res.result.songs || []);
                        }
                    });
                    await store.dispatch("getLikedMusicList");
                }
            },
            {
                immediate: true,
            }
        );
        const collectMusic = (like, id) => {
            likeMusic({ id, like })
                .then(async (res: any) => {
                    if (res.code === 200) {
                        await store.dispatch("getLikedMusicList");
                        state.toastRef.success(like ? "已添加到我喜欢的音乐" : "取消喜欢成功");
                    } else {
                        state.toastRef.error(like ? "添加失败" : "取消喜欢失败");
                    }
                })
                .catch(err => {
                    state.toastRef.error("请求失败");
                });
        };
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
            collectMusic,
            handleDownloadMusic,
        };
    },
});
</script>

<style scoped lang="scss"></style>
