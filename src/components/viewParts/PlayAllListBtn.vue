<template>
    <div
        class="rounded-pill align-self-start d-flex align-items-center justify-content-between text-white cursor-pointer position-relative overflow-hidden playAllBtn"
    >
        <div @click="clickPlayAll" class="d-flex align-items-center justify-content-center border-end h-100 hover-btn">
            <DownArrowIcon width="20" height="20" />
            <span class="ms-1">播放全部</span>
        </div>
        <div @click="addAll" class="d-flex align-items-center justify-content-center flex-grow-1 h-100 hover-btn">
            <PlusIcon width="20" height="20" />
        </div>
        <CommonModal title="替换播放列表" v-model:visible="commonModalVisible" @confirm="confirmReplaceList">
            <div class="w-100 text-center fs-5">"播放全部"将会替换当前的播放列表，是否继续？</div>
            <div class="mt-5 d-flex align-items-center justify-content-center">
                <label for="noRemain d-flex align-items-center">
                    <input class="translate-y-10" type="checkbox" id="noRemain" v-model="noRemain" />
                    <span class="ms-2 text-muted">不再提醒</span>
                </label>
            </div>
        </CommonModal>
        <CommonToast ref="commonToastRef" />
    </div>
</template>

<script lang="ts">
import { useStore } from "vuex";
import { defineComponent, PropType, reactive, toRefs, watch } from "vue";
export default defineComponent({
    props: {
        musicList: {
            type: Array,
            default: [],
        },
    },
    setup(props: { musicList: { id: number }[] }) {
        const store = useStore();
        const state = reactive({
            commonModalVisible: null,
            noRemain: false,
            commonToastRef: null,
        });
        if (localStorage["noRemainReplaceMusicList"] === undefined) {
            localStorage["noRemainReplaceMusicList"] = JSON.stringify(false);
        }
        watch(
            () => state.noRemain,
            newV => {
                localStorage["noRemainReplaceMusicList"] = JSON.stringify(newV);
            }
        );
        const confirmPlayAll = () => {
            if (props.musicList.length) {
                store.commit("changeCurrentMusicDetail", props.musicList[0]);
                store.commit("changeCurrentPlayList", JSON.parse(JSON.stringify(props.musicList)));
                store.dispatch("getCurrentMusicUrlInfo", { id: props.musicList[0].id });
            } else {
                state.commonToastRef.warn("歌单暂无歌曲，请去添加一些吧~");
            }
        };
        const clickPlayAll = () => {
            if (JSON.parse(localStorage["noRemainReplaceMusicList"]) === false) {
                state.commonModalVisible = true;
            } else {
                confirmPlayAll();
            }
        };
        const confirmReplaceList = () => {
            confirmPlayAll();
            state.commonModalVisible = false;
        };
        const addAll = () => {
            let preMusicList = store.state.currentPlayList;
            store.commit("changeCurrentPlayList", [...preMusicList, ...JSON.parse(JSON.stringify(props.musicList))]);
        };
        return {
            ...toRefs(state),
            confirmReplaceList,
            clickPlayAll,
            addAll,
        };
    },
});
</script>

<style scoped lang="scss">
.playAllBtn {
    width: 148px;
    height: 34px;
    svg:first-of-type {
        transform: rotate(-90deg);
    }
    > div:nth-child(1) {
        flex-grow: 3;
    }
}
.hover-btn {
    &:hover {
        background-color: rgba($color: #000000, $alpha: 0.1) !important;
    }
}
.primaryTheme {
    .dateText {
        color: $primary;
    }
    .playAllBtn {
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
}
.freeTheme {
    .dateText {
        color: $free;
    }
    .playAllBtn {
        background-color: $free;
    }
}
</style>
