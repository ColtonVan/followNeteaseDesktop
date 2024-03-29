<template>
    <div class="px-5 py-4">
        <div class="dailyRec ps-3 h-100 overflow-scroll hideScrollBar">
            <div class="m-5 d-flex">
                <div class="position-relative calendarBox">
                    <CalendarIcon width="90" height="90" :color="calendarColor" />
                    <div class="dateText fw-bold position-absolute start-50 fs-1 translate-middle">
                        {{ new window.Date().getDate() }}
                    </div>
                </div>
                <div class="ms-5 d-flex flex-column justify-content-center">
                    <div class="fs-1">每日歌曲推荐</div>
                    <div class="text-muted">根据你的音乐口味生成，每天6:00更新</div>
                </div>
            </div>
            <div class="d-flex mb-4 ms-5">
                <PlayAllListBtn :musicList="dailySongs" />
                <div @click="colVisible = true" class="collectList ms-3 rounded-pill px-5 border d-flex align-items-center cursor-pointer hover-btn">
                    <CollectListIcon width="20" height="20" />
                    <span class="ms-2">收藏全部</span>
                </div>
            </div>
            <div class="border-top mb-5">
                <MusicList :columns="columns" :dataSource="dailySongs" />
            </div>
        </div>
    </div>
    <CommonModal v-model:visible="downloadModalVisible">
        <template #default>
            <div class="d-flex justify-content-center">
                <div v-for="(item, index) in songsUrlObjArr" :key="index" class="d-flex align-items-center cursor-pointer">
                    <input type="radio" :name="item.level" :id="item.level" v-model="item.checked" :checked="item.checked" />
                    <label class="ms-3" :for="item.level">{{ musicQuality(item.level) }}</label>
                </div>
            </div>
        </template>
        <template #buttons>
            <div class="d-flex justify-content-center">
                <div @click="confirmDownload" class="okBtn cursor-pointer d-flex justify-content-center align-items-center">
                    确定
                </div>
                <div
                    @click="downloadModalVisible = false"
                    class="okBtn cancelBtn ms-4 rounded-pill text-muted border cursor-pointer d-flex justify-content-center align-items-center"
                >
                    取消
                </div>
            </div>
        </template>
    </CommonModal>
    <CommonToast ref="commonToast" />
    <CollectionListModal :tracks="dailySongs.map(item => item.id)" v-model:visible="colVisible" :defaultListName="defaultListName" />
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref, toRefs, watch } from "vue";
import { getRecommendSongsApi, getSongDetail, getSongUrl, likeMusic } from "@/api/discover";
import { getLikeList as getLikeListApi } from "@/api/login";
import { playTime, addHaveUrl } from "@/hooks/useFilters";
import { useStore } from "vuex";
import { downloadMusic as downloadMusicFun } from "@/utils/file";
import { musicQuality } from "@/hooks/useFilters";
import { AxiosResponseProps } from "@/utils/request";
import { useRoute } from "vue-router";
export default defineComponent({
    setup() {
        const store = useStore();
        const route = useRoute();
        const state = reactive({
            dailySongs: [],
            downloadModalVisible: false,
            songsUrlObjArr: [],
            currentMusicObj: {},
            likeList: [],
            commonToast: ref(null),
            colVisible: false,
            columns: [
                {
                    title: "音乐标题",
                    dataIndex: "name",
                },
                {
                    title: "歌手",
                    dataIndex: "ar",
                    render: text => {
                        return text.map(item => item.name).join("、");
                    },
                },
                {
                    title: "专辑",
                    dataIndex: "al",
                    render: text => {
                        return text.name;
                    },
                },
                {
                    title: "时长",
                    dataIndex: "dt",
                    render: text => {
                        return playTime(text);
                    },
                },
            ],
            defaultListName: `每日歌曲推荐(${new Date().getFullYear()}.${String(new Date().getMonth() + 1).padStart(2, "0")}.${String(
                new Date().getDate()
            ).padStart(2, "0")})`,
        });
        watch(
            () => state.songsUrlObjArr,
            newV => {
                console.log(newV);
            }
        );
        const getRec = () => {
            return new Promise((resolve, reject) => {
                getRecommendSongsApi({ t: Date.now() }).then(async (res: AxiosResponseProps) => {
                    if (res.code === 200) {
                        state.dailySongs = await addHaveUrl(res.data.dailySongs);
                        const immediate = route.query.immediate;
                        if (immediate && res?.data?.dailySongs?.length) {
                            store.commit("changeCurrentMusicDetail", res.data.dailySongs[0]);
                            store.commit("changeCurrentPlayList", [
                                ...JSON.parse(JSON.stringify(res.data.dailySongs)),
                                ...store.state.currentPlayList,
                            ]);
                            store.dispatch("getCurrentMusicUrlInfo", { id: res.data.dailySongs[0].id });
                        }
                        resolve(res);
                    }
                });
            });
        };
        const getLikeList: () => Promise<AxiosResponseProps> = () => {
            return new Promise((resolve, reject) => {
                getLikeListApi().then((res: any) => {
                    if (res.code === 200) {
                        state.likeList = res.ids;
                        resolve(res);
                    }
                });
            });
        };
        const initPageData = () => {
            getRec();
            getLikeList();
        };
        initPageData();
        const calendarColor = computed(() =>
            store.getters.getTheme === "primaryTheme" ? "#ec4141" : store.getters.getTheme === "darkTheme" ? "#212529" : "#50c475"
        );
        const tryDownloadMusic = item => {
            state.currentMusicObj = item;
            getSongUrl(item.id).then((res: AxiosResponseProps) => {
                if (res.code === 200) {
                    if (res.data.length === 1) {
                        state.songsUrlObjArr = res.data.map(item => ({ ...item, checked: true }));
                    } else {
                        state.songsUrlObjArr = res.data.map(item => ({ ...item, checked: false }));
                    }
                    state.downloadModalVisible = true;
                }
            });
        };
        const confirmDownload = () => {
            console.log(state.songsUrlObjArr);
            let findResult = state.songsUrlObjArr.find(item => item.checked);
            if (findResult) {
                downloadMusicFun(findResult.url, (state.currentMusicObj as { name: string }).name);
            }
        };
        const collectMusic = (item, like) => {
            likeMusic({ id: item.id, like }).then((res: any) => {
                if (res.code === 200) {
                    Promise.all([getRec(), getLikeList()]).then(([res1, res2]: [AxiosResponseProps, AxiosResponseProps]) => {
                        if (res1.code === 200 && res2.code === 200) {
                            state.commonToast.success(like ? "已添加到我喜欢的音乐" : "取消喜欢成功");
                        }
                    });
                }
            });
        };
        return {
            ...toRefs(state),
            playTime,
            calendarColor,
            window,
            tryDownloadMusic,
            musicQuality,
            confirmDownload,
            collectMusic,
        };
    },
});
</script>

<style scoped lang="scss">
.primaryTheme {
    .dateText {
        color: $primary;
    }
    .playAllBtn {
        background-color: $primary;
    }
    .okBtn {
        background-color: $primary;
    }
}
.darkTheme {
    .dateText {
        color: $dark;
    }
    .okBtn {
        background-color: $dark;
    }
}
.freeTheme {
    .dateText {
        color: $free;
    }
    .okBtn {
        background-color: $free;
    }
}
.dailyRec {
    .calendarBox {
        width: 90px;
        height: 90px;
        box-sizing: border-box;
        .dateText {
            top: 60%;
        }
    }
    .hover-btn {
        &:hover {
            background-color: rgba($color: #000000, $alpha: 0.1) !important;
        }
    }
    .collectList {
        height: 36px;
    }
}
.okBtn {
    width: 106px;
    height: 38px;
    border-radius: 20px;
    color: #fff;
    &:hover {
        filter: invert(0.08);
    }
}
.cancelBtn {
    background-color: #fff !important;
}
</style>
