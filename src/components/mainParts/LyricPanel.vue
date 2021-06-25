<template>
    <div :class="{ showLyricPanel: visible }" class="lyricPanel position-absolute">
        <Nav type="lyricPanel" @ondrop="$emit('update:visible', false)" />
        <div class="lyricContainer d-flex justify-content-center w-100">
            <div class="lyricHeader position-absolute start-50 translate-middle-x pt-4 d-flex flex-column align-items-center">
                <div class="fs-2 w-100 text-ellipsis text-center">{{ currentMusicDetail.name }}</div>
                <div class="mt-1 text-muted w-100 text-ellipsis text-center">
                    <span>{{ currentMusicDetail.ar.map(item => item.name).join("、") }}</span>
                    <span> - </span>
                    <span>{{ currentMusicDetail.al.name }}</span>
                </div>
                <div></div>
            </div>
            <div class="diskOuter position-relative">
                <div
                    class="diskNeedle bg-base position-absolute"
                    :class="{ pausedNeedle: !isPlaying }"
                    :style="{ backgroundImage: `url(${require('@/assets/img/needle-ab.png')})` }"
                ></div>
                <div :class="{ rotateDisk: isPlaying === true }" class="diskBox rounded-circle flex-center">
                    <div class="diskBg rounded-circle flex-center" :style="{ backgroundImage: `url(${require('@/assets/img/coverall.png')})` }">
                        <div :style="{ backgroundImage: `url(${currentMusicDetail.al.picUrl})` }" class="coverBg bg-base rounded-circle"></div>
                    </div>
                </div>
            </div>
            <div
                ref="centerLyric"
                class="centerLyric d-flex flex-column align-items-center overflow-scroll hideScrollBar text-center canSelect flex-shrink-0"
            >
                <div style="transition: transform ease 0.4s;" :style="{ transform: `translateY(${lyricAreaTranslateY}px)` }">
                    <div
                        class="lyricItem flex-shrink-0"
                        :class="{ 'fw-bold': item.active, 'fs-4': item.active }"
                        v-for="item in songLyricList"
                        :key="item.time"
                    >
                        {{ item.lyricItem }}
                    </div>
                </div>
            </div>
            <div v-if="!collapseLyricSider" class="similarList d-flex flex-column me-5">
                <div class="mb-4 fw-bold fs-5">和这首歌相似的歌单</div>
                <div
                    class="similarListItem rounded-2 d-flex align-items-center p-2 text-ellipsis box-border"
                    :title="item.name"
                    v-for="item in similarPlaylist"
                    @click="clickSimilarMusic(item)"
                    :key="item.id"
                >
                    <img class="rounded-2 me-3" :src="item.coverImgUrl" />
                    <div class="text-ellipsis">{{ item.name }}</div>
                </div>
            </div>
            <div class="collapseBtnArea position-absolute d-flex align-items-center ms-5">
                <div class="rounded-pill flex-center" @click="collapseLyricSider = !collapseLyricSider">
                    <CollapseSiderIcon
                        class="cursor-pointer"
                        :class="{ 'rotate-180': !collapseLyricSider }"
                        width="22px"
                        height="22px"
                        color="#8997b2"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, toRefs, watch, ref } from "vue";
import { useStore } from "vuex";
import { getSongLyricApi } from "@/api/song";
import { AxiosResponseProps } from "@/utils/request";
import { getSimilarPlayListApi } from "@/api/playList";
import { fromLyricStrToTime } from "@/hooks/useFilters";
import router from "@/router";
export default defineComponent({
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
        currentTime: {
            type: [Number, String],
            default: 0,
        },
    },
    setup(props, context) {
        const store = useStore();
        const state = reactive({
            LyricPanelVisible: computed({
                get: () => props.visible,
                set: newV => context.emit("update:visible", newV),
            }),
            currentMusicDetail: computed(() =>
                store.state.currentMusicDetail.al
                    ? store.state.currentMusicDetail
                    : { al: { picUrl: state.defaultAlbum }, name: "NoteMusic", ar: [{ name: "佚名" }] }
            ),
            isPlaying: computed(() => store.state.isMusicPlaying),
            songLyricList: [],
            similarPlaylist: [],
            collapseLyricSider: false,
            musicCurrentTime: computed({
                get: () => props.currentTime,
                set: newV => context.emit("update:currentTime", newV),
            }),
            centerLyric: ref(null),
            preLyricItem: {},
            lyricAreaTranslateY: 0,
        });
        //持久化是否折叠歌词侧边栏变量
        state.collapseLyricSider = localStorage["collapseLyricSider"] ? JSON.parse(localStorage["collapseLyricSider"]) : false;
        watch(
            () => state.collapseLyricSider,
            newV => {
                localStorage["collapseLyricSider"] = newV;
            }
        );
        //监听当前播放进度
        watch(
            () => props.currentTime,
            newV => {
                state.songLyricList = state.songLyricList.map((item, index, arr) => {
                    if (!item.time) return { ...item, active: false };
                    let currentLyricTime = fromLyricStrToTime(item.time);
                    if (index === arr.length - 1) {
                        if (newV >= currentLyricTime) {
                            return { ...item, active: true };
                        } else {
                            return { ...item, active: false };
                        }
                    } else {
                        let nextLyricTIme = fromLyricStrToTime(arr[index + 1].time);
                        if (newV >= currentLyricTime && newV < nextLyricTIme) {
                            return { ...item, active: true };
                        } else {
                            return { ...item, active: false };
                        }
                    }
                });
                let currentLyricItem = state.songLyricList.find(item => item.active);
                if (currentLyricItem?.time != state.preLyricItem?.time) {
                    state.lyricAreaTranslateY = currentLyricItem?.translateY;
                }
                state.preLyricItem = currentLyricItem;
            }
        );
        const getSongLyric = () => {
            getSongLyricApi({ id: state.currentMusicDetail.id }).then((res: any) => {
                if (res.code === 200) {
                    state.songLyricList = res.lrc.lyric.split("\n").map((item, index) => {
                        let splitArr = item.split("]");
                        return {
                            time: splitArr[0].substr(1),
                            lyricItem: splitArr[1],
                            active: false,
                            translateY: 0 - (18 + 20) * index,
                        };
                    });
                }
            });
        };
        const getSimilarPlayList = () => {
            getSimilarPlayListApi({ id: state.currentMusicDetail.id }).then((res: any) => {
                if (res.code === 200) {
                    state.similarPlaylist = res.playlists;
                }
            });
        };
        //监听当前播放歌曲
        watch(
            () => state.currentMusicDetail,
            () => {
                getSongLyric();
                getSimilarPlayList();
            },
            {
                immediate: true,
            }
        );
        const clickSimilarMusic = similarMusicItem => {
            router.push({ path: "/container/createdMusicList", query: { id: similarMusicItem.id } });
            state.LyricPanelVisible = false;
        };
        return {
            ...toRefs(state),
            clickSimilarMusic,
        };
    },
});
</script>

<style scoped lang="scss">
$playBarHeight: 75px;
.lyricPanel {
    z-index: 900;
    top: $playBarHeight;
    width: 100vw;
    height: calc(100vh - #{$playBarHeight});
    background: linear-gradient(to bottom, rgb(218, 204, 204), #fff);
    transition: top ease 0.4s;
    .lyricContainer {
        height: calc(100% - 75px);
        width: 100%;
        .lyricHeader {
            width: 800px;
        }
        .diskOuter {
            $diskOuterWidth: 300px;
            width: $diskOuterWidth;
            margin-top: 66px;
            padding-top: 85px;
            .diskNeedle {
                width: calc(251px * 0.38);
                height: calc(409px * 0.38);
                left: 47%;
                top: 0;
                z-index: 1;
                transform: rotate(0);
                transition: transform ease 0.4s;
                transform-origin: 13px 13px;
            }
            .pausedNeedle {
                transform: rotate(-38deg);
                transition: transform ease 0.4s;
            }
            .diskBox {
                width: $diskOuterWidth;
                height: $diskOuterWidth;
                background-color: rgba($color: #adadad, $alpha: 0.8);
                .diskBg {
                    width: calc(#{$diskOuterWidth} - 10px);
                    height: calc(#{$diskOuterWidth} - 10px);
                    background-size: calc(76% * 2.46) calc(299% * 2.46); //380/1495
                    background-position: 80.46% 44.961%;
                    .coverBg {
                        width: 64.5%;
                        height: 64.5%;
                        background-color: #fff;
                        transform: translate(-0.5%, 0.5%);
                    }
                }
            }
            .rotateDisk {
                animation: rotateDisk 8s linear infinite;
            }
            @keyframes rotateDisk {
                from {
                    transform: rotate(0);
                }
                to {
                    transform: rotate(360deg);
                }
            }
        }
        .centerLyric {
            width: 600px;
            height: 380px;
            margin-top: 200px;
            padding-top: 40px;
            .lyricItem {
                min-width: 60px;
                height: 18px;
                margin-bottom: 20px;
            }
        }
        .similarList {
            width: 300px;
            margin-top: 120px;
            margin-left: 90px;
            .similarListItem {
                width: 100%;
                img {
                    width: 30px;
                    height: 30px;
                }
                &:hover {
                    background-color: rgba($color: #ccc, $alpha: 0.6);
                }
            }
        }
        .collapseBtnArea {
            right: 25px;
            top: 50%;
            > div {
                width: 23px;
                height: 46px;
                background-color: rgba($color: #ccc, $alpha: 0.3);
                &:hover {
                    background-color: rgba($color: #ccc, $alpha: 0.5);
                }
            }
        }
    }
}
.showLyricPanel {
    transition: top ease 0.4s;
    top: calc(0px - (100vh - #{$playBarHeight}));
}
</style>
