<template>
    <div class="playBar border-top position-absolute bottom-0 vw-100 d-flex align-items-center justify-content-between">
        <audio class="d-none" ref="audioTag" :muted="musicMuted" controls :src="currentMusicUrl"></audio>
        <div class="ps-3 d-flex align-items-center cursor-pointer">
            <div class="musicCoverBox rounded-4 overflow-hidden position-relative">
                <img :src="currentMusicDetail.al.picUrl" width="55" alt="" />
            </div>
            <div class="ms-3 fs-5">
                <div class="d-flex align-items-center">
                    <span>{{ currentMusicDetail.name }}</span>
                    <LikedIcon class="ms-2 cursor-pointer" width="16" height="16" />
                </div>
                <div class="mt-1">
                    <span>{{ currentMusicDetail.ar.map(item => item.name).join("、") }}</span>
                </div>
            </div>
        </div>
        <div class="centerController">
            <div class="changeMusicArea flex-center">
                <div title="上一首">
                    <PreMusicIcon
                        @mouseenter="preMusicIconColor = themeColor"
                        @mouseleave="preMusicIconColor = '#000000'"
                        :color="preMusicIconColor"
                        width="22"
                        height="22"
                    />
                </div>
                <div class="rounded-pill playIconBox flex-center ms-4" :title="isPlaying ? '暂停' : '播放'">
                    <PauseIcon @click="pauseMusic" v-if="isPlaying" width="20" height="20" />
                    <DownArrowIcon @click="playMusic" v-else width="22" height="22" class="filter-invert-1 playIcon" />
                </div>
                <div title="下一首">
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
                    class="cursor-pointer"
                    width="28"
                    height="28"
                />
            </div>
            <ProgressBar
                v-model="volumeProgress"
                @change="changeVolumeProgress"
                width="60px"
                :title="`${volumeProgress.toFixed()}%`"
            />
            <PlayListIcon class="ms-4 cursor-pointer opacity-75" width="22" height="22" />
        </div>
    </div>
    <CommonToast ref="toastRef" />
</template>

<script lang="ts">
import { useStore } from "vuex";
import { computed, defineComponent, reactive, toRefs, watch, nextTick, onMounted } from "vue";
import { playTime } from "@/hooks/useFilters";
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
            currentMusicUrl:
                store.state.currentMusicUrlInfo && store.state.currentMusicUrlInfo.length
                    ? store.state.currentMusicUrlInfo[0].url
                    : "",
            audioTag: null,
            toastRef: null,
            musicTimeLength: 0,
            musicCurrentTime: 0,
            musicMuted: false,
        });
        const playMusic = () => {
            nextTick(() => {
                setTimeout(() => {
                    state.musicTimeLength = state.audioTag.duration * 1000;
                    state.audioTag.play();
                    store.commit("changeIsMusicPlaying", true);
                    state.audioTag.addEventListener("timeupdate", event => {
                        state.musicCurrentTime = event.target.currentTime * 1000;
                        state.mtProgress = (100 * event.target.currentTime) / event.target.duration;
                    });
                    state.audioTag.onerror = err => {
                        state.toastRef.warn("播放失败，请稍后重试");
                    };
                }, 140);
            });
        };
        const pauseMusic = () => {
            nextTick(() => {
                state.audioTag.pause();
                store.commit("changeIsMusicPlaying", false);
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
        return {
            ...toRefs(state),
            playTime,
            playMusic,
            pauseMusic,
            changeMtProgress,
            changeVolumeProgress,
        };
    },
});
</script>

<style scoped lang="scss">
.playBar {
    height: 75px;
    .musicCoverBox {
        width: 55px;
        height: 55px;
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
        width: 180px;
    }
}
</style>
