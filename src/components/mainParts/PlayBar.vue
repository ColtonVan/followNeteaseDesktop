<template>
    <div class="playBarOuter position-absolute bottom-0 vw-100">
        <div class="playBar bg-white border-top vw-100 d-flex align-items-center justify-content-between position-relative">
            <audio class="d-none" ref="audioTag" :muted="musicMuted" controls :src="currentMusicUrl"></audio>
            <div class="leftMusicInfo playBarHeight flex-shrink-0 d-flex flex-column justify-content-start align-self-start overflow-hidden">
                <div
                    class="d-flex playBarHeight align-items-center cursor-pointer ps-3 flex-shrink-0"
                    :class="{ scrollMusicInfoToTop: showLyricPanel, restoreMusicInfo: !showLyricPanel }"
                >
                    <div
                        @click="showLyricPanel = true"
                        class="musicCoverBox rounded-4 overflow-hidden position-relative flex-shrink-0"
                        title="展开音乐详情页"
                    >
                        <img :src="currentMusicDetail.al.picUrl" width="55" height="55" alt="" />
                        <div class="spreadMusicDetail w-100 h-100 position-absolute top-0 start-0 flex-center">
                            <arrow-left-icon class="rotate-90" width="20px" height="20px" />
                        </div>
                    </div>
                    <div class="ms-3 fs-5">
                        <div class="d-flex align-items-center">
                            <span class="musicName text-ellipsis" :title="currentMusicDetail.name">{{ currentMusicDetail.name }}</span>
                            <span v-if="loginStatus">
                                <LikedIcon
                                    @click="collectMusic(true)"
                                    v-if="!likedList.includes(currentMusicDetail.id)"
                                    class="ms-2 cursor-pointer"
                                    width="16"
                                    height="16"
                                />
                                <HaveLikedIcon @click="collectMusic(false)" v-else class="ms-2 cursor-pointer" width="16" height="16" />
                            </span>
                        </div>
                        <div class="mt-1">
                            <span class="musicAr text-ellipsis" :title="currentMusicDetail.ar.map(item => item.name).join('、')">{{
                                currentMusicDetail.ar.map(item => item.name).join("、")
                            }}</span>
                        </div>
                    </div>
                </div>
                <div class="d-flex playBarHeight align-items-center flex-shrink-0">
                    <div @click="showLyricPanel = false" class="dropMusicInfo h-100 flex-center cursor-pointer">
                        <arrow-left-icon color="#000" width="20px" height="20px" class="rotate--90" />
                    </div>
                    <div class="ms-3 d-flex">
                        <div
                            v-if="!likedList.includes(currentMusicDetail.id)"
                            @click="collectMusic(true)"
                            class="rounded-circle border opMusicCircle position-relative flex-center"
                        >
                            <LikedIcon width="17" height="17" />
                        </div>
                        <div v-else @click="collectMusic(false)" class="rounded-circle border opMusicCircle position-relative flex-center">
                            <HaveLikedIcon width="17" height="17" />
                        </div>
                        <div @click="colVisible = true" class="rounded-circle border opMusicCircle position-relative flex-center">
                            <collect-list-icon width="17px" height="17px" />
                        </div>
                        <div @click="handleDownloadMusic" class="rounded-circle border opMusicCircle position-relative flex-center">
                            <download-music-icon width="17px" height="17px" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="centerController">
                <div @click.stop class="changeMusicArea flex-center">
                    <div @click="changeMusic('previous')" title="上一首">
                        <PreMusicIcon
                            @mouseenter="preMusicIconColor = themeColor"
                            @mouseleave="preMusicIconColor = '#000000'"
                            :color="preMusicIconColor"
                            width="22"
                            height="22"
                        />
                    </div>
                    <div
                        @click="isPlaying ? pauseMusic() : playMusic()"
                        class="rounded-pill playIconBox flex-center ms-4"
                        :title="isPlaying ? '暂停' : '播放'"
                    >
                        <PauseIcon v-if="isPlaying" width="20" height="20" />
                        <DownArrowIcon v-else width="22" height="22" class="filter-invert-1 playIcon" />
                    </div>
                    <div @click="changeMusic('next')" title="下一首">
                        <NextMusicIcon
                            @mouseenter="nextMusicIconColor = themeColor"
                            @mouseleave="nextMusicIconColor = '#000000'"
                            :color="nextMusicIconColor"
                            class="ms-4"
                            width="22"
                            height="22"
                        />
                    </div>
                </div>
                <div class="flex-center">
                    <span class="text-muted">{{ playTime(musicCurrentTime) }}</span>
                    <ProgressBar v-model="mtProgress" @change="changeMtProgress" />
                    <span class="text-muted">{{ playTime(musicTimeLength) }}</span>
                </div>
            </div>
            <div class="d-flex align-items-center justify-content-end pe-4 rightController">
                <div title="开启音量" v-if="volumeProgress === 0">
                    <VolumeIcon
                        @click="
                            volumeProgress = preVolumeProgress;
                            musicMuted = false;
                        "
                        class="cursor-pointer"
                        width="22"
                        height="22"
                    />
                </div>
                <div title="静音" v-else>
                    <SilenceIcon
                        @click="
                            preVolumeProgress = volumeProgress;
                            volumeProgress = 0;
                            musicMuted = true;
                        "
                        class="cursor-pointer hover-opacity"
                        width="28"
                        height="28"
                    />
                </div>
                <ProgressBar v-model="volumeProgress" @change="changeVolumeProgress" width="60px" :title="`${volumeProgress.toFixed()}%`" />
                <PlayListIcon
                    @click.stop="$store.commit('changeShowPlayList', !$store.state.showPlayList)"
                    class="ms-4 cursor-pointer opacity-75 hover-opacity"
                    width="22"
                    height="22"
                />
            </div>
        </div>
        <LyricPanel v-model:visible="showLyricPanel" v-model:currentTime="musicCurrentTime" />
    </div>
    <CommonToast ref="toastRef" />
    <CollectionListModal :tracks="[currentMusicDetail.id]" v-model:visible="colVisible" />
</template>

<script lang="ts">
import { useStore } from "vuex";
import { computed, defineComponent, reactive, toRefs, watch, nextTick, onMounted } from "vue";
import { likeMusic } from "@/api/discover";
import { getLikeList as getLikeListApi } from "@/api/login";
import { playTime } from "@/hooks/useFilters";
import { AxiosResponseProps } from "@/utils/request";
import { downloadMusic } from "@/utils/file";
export default defineComponent({
    setup() {
        const store = useStore();
        const state = reactive({
            defaultAlbum: require("@/assets/img/default_album.jpg"),
            currentMusicDetail: computed(() =>
                store.state.currentMusicDetail.al
                    ? store.state.currentMusicDetail
                    : { al: { picUrl: state.defaultAlbum }, name: "NoteMusic", ar: [{ name: "佚名" }] }
            ),
            theme: computed(() => store.getters.getTheme),
            mtProgress: 0,
            preVolumeProgress: 0,
            volumeProgress: 100,
            preMusicIconColor: "#000000",
            nextMusicIconColor: "#000000",
            themeColor: computed(() => store.getters.getThemeColor),
            isPlaying: computed(() => store.state.isMusicPlaying),
            currentMusicUrl: store.state.currentMusicUrlInfo && store.state.currentMusicUrlInfo.length ? store.state.currentMusicUrlInfo[0].url : "",
            currentPlayList: computed(() => store.state.currentPlayList),
            audioTag: null,
            toastRef: null,
            musicTimeLength: 0,
            musicCurrentTime: 0,
            musicMuted: false,
            loginStatus: computed(() => store.getters.getLoginStatus),
            likedList: [],
            showLyricPanel: false,
            colVisible: false,
        });
        const playMusic = () => {
            if (!state.currentMusicUrl) {
                if (!state.currentPlayList.length) return state.toastRef.warn("请先选择要播放的音乐");
                changeMusic("next");
            }
            nextTick(() => {
                state.audioTag.play().catch(err => {
                    state.toastRef.warn(err.message);
                    setTimeout(() => {
                        store.commit("changeIsMusicPlaying", false);
                    }, 600);
                });
            });
        };
        const pauseMusic = () => {
            nextTick(() => {
                state.audioTag.pause();
            });
        };
        const changeMtProgress = progress => {
            state.audioTag.currentTime = (state.audioTag.duration * progress) / 100;
        };
        const changeVolumeProgress = progress => {
            state.audioTag.volume = progress / 100;
        };
        watch(
            () => store.state.currentMusicUrlInfo,
            newV => {
                if (newV.length) {
                    state.currentMusicUrl = newV[0].url;
                    playMusic();
                }
            }
        );
        const changeMusic = (type: "next" | "previous") => {
            pauseMusic();
            if (state.currentPlayList && state.currentPlayList.length) {
                //设置默认为第一首
                let futureMusicObj = state.currentPlayList[0];
                state.currentPlayList.some((item, index, arr) => {
                    if (state.currentMusicDetail.id === item.id) {
                        if (type === "next") {
                            if (index === arr.length - 1) {
                                futureMusicObj = arr[0];
                            } else {
                                futureMusicObj = arr[index + 1];
                            }
                        } else if (type === "previous") {
                            if (index === 0) {
                                futureMusicObj = arr[arr.length - 1];
                            } else {
                                futureMusicObj = arr[index - 1];
                            }
                        }
                        return true;
                    }
                });
                store.commit("changeCurrentMusicDetail", futureMusicObj);
                if (futureMusicObj.haveUrl === false) {
                    state.toastRef.warn("当前歌曲由于版权保护，您所在的地区暂时无法使用。");
                    setTimeout(() => {
                        changeMusic(type);
                    }, 400);
                    return;
                }
                store.dispatch("getCurrentMusicUrlInfo", { id: futureMusicObj.id });
            } else {
                state.toastRef.warn("请添加音乐至播放列表");
            }
        };
        onMounted(() => {
            //在第一帧数据加载完成后触发
            state.audioTag.onloadeddata = () => {
                state.musicTimeLength = state.audioTag.duration * 1000;
            };
            //播放时不停触发
            state.audioTag.ontimeupdate = event => {
                state.musicCurrentTime = event.target.currentTime * 1000;
                state.mtProgress = (100 * event.target.currentTime) / event.target.duration;
            };
            //开始播放时触发
            state.audioTag.onplay = () => {
                store.commit("changeIsMusicPlaying", true);
            };
            //暂停播放时触发
            state.audioTag.onpause = () => {
                store.commit("changeIsMusicPlaying", false);
            };
            //播放出错时触发
            state.audioTag.onerror = (err: Error) => {
                // console.dir(err);
                // state.toastRef.warn("播放失败，请稍后重试");
            };
            //当前歌曲播放完毕时触发
            state.audioTag.onended = () => {
                changeMusic("next");
            };
        });
        const getLikedList: () => Promise<AxiosResponseProps> = async () => {
            return await getLikeListApi().then((res: any) => {
                if (res.code === 200) {
                    state.likedList = res.ids;
                    return res;
                }
            });
        };
        getLikedList();
        const collectMusic = like => {
            likeMusic({ id: state.currentMusicDetail.id, like }).then(async (res: any) => {
                if (res.code === 200) {
                    await getLikedList();
                    state.toastRef.success(like ? "已添加到我喜欢的音乐" : "取消喜欢成功");
                }
            });
        };
        const handleDownloadMusic = () => {
            downloadMusic(state.currentMusicUrl, state.currentMusicDetail.name)
                .then(() => {
                    state.toastRef.success("已添加至下载");
                })
                .catch(() => {
                    state.toastRef.warn("下载失败");
                });
        };
        return {
            ...toRefs(state),
            collectMusic,
            playTime,
            playMusic,
            pauseMusic,
            changeMtProgress,
            changeVolumeProgress,
            changeMusic,
            handleDownloadMusic,
        };
    },
});
</script>

<style scoped lang="scss">
.playBarOuter {
    $playBarHeight: 75px;
    .playBar {
        z-index: 901;
        .playBarHeight {
            height: $playBarHeight;
        }
        height: $playBarHeight;

        .scrollMusicInfoToTop {
            animation: scrollMusicInfoToTop 0.4s forwards;
        }
        .restoreMusicInfo {
            animation: restoreMusicInfo 0.4s forwards;
        }
        @keyframes scrollMusicInfoToTop {
            from {
                margin-top: 0;
            }
            to {
                margin-top: calc(0px - #{$playBarHeight});
            }
        }
        @keyframes restoreMusicInfo {
            from {
                margin-top: calc(0px - #{$playBarHeight});
            }
            to {
                margin-top: 0;
            }
        }
        .leftMusicInfo {
            width: 260px;
            .dropMusicInfo {
                width: $playBarHeight;
            }
            .opMusicCircle {
                width: 38px;
                height: 38px;
                cursor: pointer;
                &:hover {
                    &::before {
                        border-radius: 50%;
                        content: "";
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background-color: rgba($color: #000000, $alpha: 0.05);
                    }
                }
            }
            .opMusicCircle ~ .opMusicCircle {
                margin-left: 14px;
            }
            .musicCoverBox {
                width: 55px;
                height: 55px;
                > img {
                    object-fit: cover;
                }
                .spreadMusicDetail {
                    display: none;
                }
                &:hover {
                    .spreadMusicDetail {
                        display: flex;
                        background-color: rgba($color: #000, $alpha: 0.7);
                    }
                }
            }
            .musicName {
                max-width: 240px;
            }
            .musicAr {
                max-width: 240px;
            }
        }
        .centerController {
            .changeMusicArea {
                height: 35px;
                > * {
                    cursor: pointer;
                }
                .playIconBox {
                    width: 35px;
                    height: 35px;
                    background-color: #f1f1f1;
                    &:hover {
                        background-color: #e6e6e6;
                    }
                    .playIcon {
                        transform: rotate(-90deg) translate(0, 5%);
                    }
                }
            }
        }
        .rightController {
            width: 260px;
        }
    }
}
</style>
