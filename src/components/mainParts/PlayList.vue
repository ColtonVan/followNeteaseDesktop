<template>
    <div @click.stop class="playList position-fixed bordered bg-white">
        <div
            :style="{ opacity: currentPlayList && currentPlayList.length ? 1 : 0.6 }"
            class="d-flex align-items-center mt-5 mx-4 justify-content-between border-bottom pb-3"
        >
            <div class="text-muted">
                总<span>{{ currentPlayList.length }}</span
                >首
            </div>
            <div class="rightBtns d-flex align-items-center">
                <div @click="currentPlayList.length ? (colVisible = true) : false" class="hover-opacity">
                    <CollectListIcon width="18" height="18" /><span class="ms-2">收藏全部</span>
                </div>
                <div style="height: 12px;" class="ms-5 border-end"></div>
                <div @click="$store.commit('changeCurrentPlayList', [])" class="mx-5 hover-opacity">
                    <DeleteIcon width="18" height="18" /><span class="ms-2">清空</span>
                </div>
            </div>
        </div>
        <div class="list hideScrollBar" v-if="currentPlayList.length">
            <div @click="clickMusicItem(item)" class="row ps-3" v-for="item in currentPlayList" :key="item.id">
                <div class="col d-flex" :title="item.name">
                    <div class="playIcon flex-center">
                        <span v-show="currentMusicDetail.id === item.id">
                            <DownArrowIcon v-if="isMusicPlaying" :color="themeColor" style="transform: rotate(-90deg);" width="14" height="14" />
                            <PauseIcon v-else :color="themeColor" width="14" height="14" />
                        </span>
                    </div>
                    <span :style="{ opacity: item.haveUrl === false ? 0.4 : 1 }" class="ms-2 text-ellipsis">{{ item.name }}</span>
                </div>
                <div :style="{ opacity: item.haveUrl === false ? 0.4 : 1 }" :title="item.ar.map(item => item.name).join('、')" class="col">
                    {{ item.ar.map(item => item.name).join("、") }}
                </div>
                <div :style="{ opacity: item.haveUrl === false ? 0.4 : 1 }" class="col text-muted">{{ playTime(item.dt) }}</div>
            </div>
        </div>

        <div v-else class="mt-5 flex-center flex-column">
            <div class="mt-5 pt-5 fs-5 text-muted">你还没有添加任何歌曲!</div>
            <div class="mt-3 text-muted">
                去首页<a
                    @click="
                        $router.push('/');
                        $store.commit('changeShowPlayList', false);
                    "
                    href="javascript:void(0);"
                    >发现音乐</a
                >
            </div>
        </div>

        <CollectionListModal :tracks="currentPlayList.map(item => item.id).reverse()" v-model:visible="colVisible" />
    </div>
    <CommonModal @confirm="confirmCopyModal" v-model:visible="commonModalVisible">
        <div class="text-center">由于版权保护，您所在的地区暂时无法使用。</div>
    </CommonModal>
</template>

<script lang="ts">
import { useStore } from "vuex";
import { computed, defineComponent, reactive, toRefs, watch } from "vue";
import useClickDocument from "@/hooks/useClickDocument";
import { playTime } from "@/hooks/useFilters";
export default defineComponent({
    setup() {
        const store = useStore();
        const state = reactive({
            currentPlayList: computed(() => store.state.currentPlayList),
            themeColor: computed(() => store.getters.getThemeColor),
            currentMusicDetail: computed(() => store.state.currentMusicDetail),
            isMusicPlaying: computed(() => store.state.isMusicPlaying),
            commonModalVisible: false,
            colVisible: false,
        });
        useClickDocument(() => {
            store.commit("changeShowPlayList", false);
        });
        let clickedColumns = [];
        const clickMusicItem = column => {
            if (
                clickedColumns.length &&
                Date.now() - clickedColumns[clickedColumns.length - 1].clickTime < 400 &&
                column.id === clickedColumns[clickedColumns.length - 1].id
            ) {
                if (column.haveUrl !== false) {
                    store.commit("changeCurrentMusicDetail", column);
                    store.dispatch("getCurrentMusicUrlInfo", { id: column.id });
                } else {
                    state.commonModalVisible = true;
                }
                return (clickedColumns = []);
            }
            column.clickTime = Date.now();
            clickedColumns.push(column);
        };
        const confirmCopyModal = (six) => {
            console.log("confirm");
            state.commonModalVisible = false;
        };
        return {
            ...toRefs(state),
            playTime,
            confirmCopyModal,
            clickMusicItem,
        };
    },
});
</script>

<style scoped lang="scss">
.playList {
    width: 416px;
    height: calc(100vh - 75px - 60px - 3px);
    top: 60px + 3px;
    right: 0;
    box-shadow: 0 -0.5rem 1rem rgba(0, 0, 0, 0.15);
    border-top-left-radius: 0.5rem;
    z-index: 996;
    .rightBtns {
        font-size: 1.15rem;
    }
    .list {
        height: calc(100% - 1rem - 3rem - 12px - 20px);
        overflow-y: scroll;
        overflow-x: hidden;
        .row {
            .col {
                padding: 7px 0;
                box-sizing: border-box;
                @extend .text-ellipsis;
                .playIcon {
                    width: 20px;
                }
            }
            &:hover {
                background-color: #ebebeb !important;
            }
        }
        .row:nth-child(odd) {
            background-color: #fff;
        }
        .row:nth-child(even) {
            background-color: #f1f1f1;
        }
    }
}
</style>
