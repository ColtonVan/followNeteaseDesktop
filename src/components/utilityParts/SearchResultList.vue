<template>
    <div class="searchResultList rounded-6 shadow position-absolute start-50 translate-middle-x bg-white">
        <LoadingComponent v-if="isLoading" />
        <div v-else>
            <div class="hover-opacity py-2 px-3 w-100 text-ellipsis">
                搜"<span class="text-black">{{ keyword }}</span
                >"相关的结果 >
            </div>

            <div v-if="searchSuggestObj.songs && searchSuggestObj.songs.length">
                <div class="d-flex align-items-center titleRow py-2 cursor-pointer">
                    <ThinNoteIcon class="mx-2" width="16" height="16" />
                    <span>单曲</span>
                </div>
                <div
                    @click="clickSong(song)"
                    class="contentRow py-2 w-100 text-ellipsis cursor-pointer"
                    v-for="song in searchSuggestObj.songs"
                    :key="song.id"
                >
                    <SearchHighLightText :keyword="keyword" :name="filterSongName(song)" />
                </div>
            </div>

            <div v-if="searchSuggestObj.artists && searchSuggestObj.artists.length">
                <div class="d-flex align-items-center titleRow py-2 cursor-pointer">
                    <SingerIcon class="mx-2" width="16" height="16" />
                    <span>歌手</span>
                </div>
                <div class="contentRow py-2 w-100 text-ellipsis cursor-pointer" v-for="artist in searchSuggestObj.artists" :key="artist.id">
                    <SearchHighLightText :keyword="keyword" :name="artist.name" />
                </div>
            </div>

            <div v-if="searchSuggestObj.albums && searchSuggestObj.albums.length">
                <div class="d-flex align-items-center titleRow py-2 cursor-pointer">
                    <AlbumIcon class="mx-2" width="16" height="16" />
                    <span>专辑</span>
                </div>
                <div class="contentRow py-2 w-100 text-ellipsis cursor-pointer" v-for="album in searchSuggestObj.albums" :key="album.id">
                    <SearchHighLightText :keyword="keyword" :name="filterAlbumName(album)" />
                </div>
            </div>

            <div v-if="searchSuggestObj.playlists && searchSuggestObj.playlists.length">
                <div class="d-flex align-items-center titleRow py-2 cursor-pointer">
                    <MusicListIcon class="mx-2" width="16" height="16" />
                    <span>歌单</span>
                </div>
                <div class="contentRow py-2 w-100 text-ellipsis cursor-pointer" v-for="playlist in searchSuggestObj.playlists" :key="playlist.id">
                    <SearchHighLightText :keyword="keyword" :name="playlist.name" />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { multimatchSearch, searchApi, cloudsearchApi, searchSuggestApi } from "@/api/search";
import { useStore } from "vuex";
import { defineComponent, reactive, toRefs, watch } from "vue";
import { getSongDetailApi } from "@/api/song";
import { AxiosResponseProps } from "@/utils/request";
export default defineComponent({
    props: {
        keyword: {
            type: String,
            default: "",
        },
        modelValue: {
            type: Boolean,
            required: true,
        },
    },
    emits: ["update:modelValue", "search"],
    setup(props, { emit }) {
        const store = useStore();
        const state = reactive({
            searchSuggestObj: {},
            isLoading: false
        });
        watch(
            () => props.keyword,
            newV => {
                state.isLoading = true;
                searchSuggestApi(newV).then((res: any) => {
                    state.isLoading = false;
                    if (res.code === 200) {
                        state.searchSuggestObj = res.result;
                    }
                });
            },
            {
                immediate: true,
            }
        );
        const filterSongName = song => {
            return `${song.name} - ${song.artists.map(item => item.name).join("、")}`;
        };
        const filterAlbumName = album => {
            return `${album.name} - ${album.artist.name}`;
        };
        const clickSong = song => {
            getSongDetailApi(song.id).then((res: any) => {
                if (res.code === 200 && res.songs && res.songs.length) {
                    store.commit("changeCurrentMusicDetail", res.songs[0]);
                    store.commit("changeCurrentPlayList", [res.songs[0], ...store.state.currentPlayList]);
                    store.dispatch("getCurrentMusicUrlInfo", { id: res.songs[0].id });
                    emit("search");
                    emit("update:modelValue", false);
                }
            });
        };
        return {
            ...toRefs(state),
            filterSongName,
            filterAlbumName,
            clickSong,
        };
    },
});
</script>

<style scoped lang="scss">
.searchResultList {
    top: 32px;
    width: 350px;
    height: 420px;
    overflow-y: scroll;
    z-index: 10;
    @extend .hideScrollBar;
    animation: startAni 0.3s;
    @keyframes startAni {
        from {
            height: 450px;
        }
        to {
            height: 420px;
        }
    }
    .titleRow {
        background-color: #ebebeb;
    }
    .contentRow {
        padding-left: 24px;
        &:hover {
            background-color: #e6e6e6;
        }
    }
}
</style>
