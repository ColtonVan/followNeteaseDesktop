<template>
    <div class="dailyRec ps-3 h-100 overflow-scroll hideScrollBar">
        <div class="m-5 d-flex">
            <div class="position-relative calendarBox">
                <CalendarIcon width="90" height="90" :color="calendarColor" />
                <div class="dateText fw-bold position-absolute start-50 fs-1 translate-middle">{{ new window.Date().getDate() }}</div>
            </div>
            <div class="ms-5 d-flex flex-column justify-content-center">
                <div class="fs-1">每日歌曲推荐</div>
                <div class="text-muted">根据你的音乐口味生成，每天6:00更新</div>
            </div>
        </div>
        <div class="d-flex">
            <div
                class="rounded-pill d-flex align-items-center justify-content-between text-white mb-4 ms-5 cursor-pointer position-relative overflow-hidden playAllBtn"
            >
                <div class="d-flex align-items-center justify-content-center border-end h-100 hover-btn">
                    <DownArrowIcon width="20" height="20" />
                    <span class="ms-1">播放全部</span>
                </div>
                <div class="d-flex align-items-center justify-content-center flex-grow-1 h-100 hover-btn">
                    <PlusIcon width="20" height="20" />
                </div>
            </div>
            <div @click="colVisible = true" class="collectList ms-3 rounded-pill px-5 border d-flex align-items-center cursor-pointer hover-btn">
                <CollectList width="20" height="20" />
                <span class="ms-2">收藏全部</span>
            </div>
        </div>
        <div class="border-top mb-5">
            <div class="row songRow headRow w-100">
                <div class="col-6 p-3 text-black-50 fs-5 songCol">音乐标题</div>
                <div class="col p-3 text-black-50 fs-5 songCol">歌手</div>
                <div class="col p-3 text-black-50 fs-5 songCol">专辑</div>
                <div class="col p-3 text-black-50 fs-5 songCol">时长</div>
            </div>
            <div class="row ps-5 songRow w-100" v-for="(dailySong, dailySongIndex) in dailySongs" :key="dailySongIndex">
                <div class="col-6 p-3 songCol">
                    <span class="text-black-50 me-4">{{ String(dailySongIndex + 1).padStart(2, "0") }}</span>
                    <HaveLikedIcon
                        @click="collectMusic(dailySong, false)"
                        v-if="likeList.includes(dailySong.id)"
                        width="14"
                        height="14"
                        class="hover-likedIcon"
                    />
                    <LikedIcon @click="collectMusic(dailySong, true)" v-else width="14" height="14" class="hover-icon" />
                    <DownloadMusicIcon @click="tryDownloadMusic(dailySong)" width="14" height="14" class="hover-icon ms-4" />
                    <span class="ms-4">{{ dailySong.name }}</span>
                </div>
                <div class="col-2 p-3 songCol">{{ dailySong.ar.map(item => item.name).join("、") }}</div>
                <div class="col-2 p-3 songCol">{{ dailySong.al.name }}</div>
                <div class="col-2 p-3 songCol">{{ playTime(dailySong.dt) }}</div>
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
    <CollectionListModal :tracks="dailySongs.map(item => item.id)" v-model:visible="colVisible" />
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref, toRefs, watch } from "vue";
import { getRecommendSongsApi, getSongDetail, getSongUrl, likeMusic } from "@/api/discover";
import { getLikeList as getLikeListApi } from "@/api/login";
import { playTime } from "@/hooks/useFilters";
import { useStore } from "vuex";
import { downloadMusic as downloadMusicFun } from "@/utils/file";
import { musicQuality } from "@/hooks/useFilters";
import { AxiosResponseProps } from "@/utils/request";
export default defineComponent({
    setup() {
        const store = useStore();
        const state = reactive({
            dailySongs: [],
            downloadModalVisible: false,
            songsUrlObjArr: [],
            currentMusicObj: {},
            likeList: [],
            commonToast: ref(null),
            colVisible: false,
        });
        watch(
            () => state.songsUrlObjArr,
            newV => {
                console.log(newV);
            }
        );
        const getRec = () => {
            return new Promise((resolve, reject) => {
                getRecommendSongsApi({ t: Date.now() }).then((res: AxiosResponseProps) => {
                    if (res.code === 200) {
                        state.dailySongs = res.data.dailySongs;
                        resolve(res);
                    }
                });
            });
        };
        getRec();
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
        getLikeList();
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
    .playAllBtn {
        background-color: $dark;
    }
    .okBtn {
        background-color: $dark;
    }
}
.freeTheme {
    .dateText {
        color: $free;
    }
    .playAllBtn {
        background-color: $free;
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
    .playAllBtn {
        width: 160px;
        height: 36px;
        svg:first-of-type {
            transform: rotate(-90deg);
        }
        > div:nth-child(1) {
            flex-grow: 3;
        }
    }
    .collectList {
        height: 36px;
    }
    .headRow {
        .songCol {
            text-align: center;
        }
    }
    .songRow {
        .songCol {
            box-sizing: border-box;
            @extend .text-ellipsis;
            .hover-icon {
                @extend .cursor-pointer;
                opacity: 0.5;
                &:hover {
                    opacity: 1;
                }
            }
        }
        &:hover {
            background-color: rgb(235, 235, 235) !important;
        }
    }
    .songRow:nth-child(odd) {
        background-color: #f1f1f1;
    }
    .songRow:nth-child(even) {
        background-color: #fff;
    }
    .songRow:nth-child(1) {
        background-color: #fff;
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
