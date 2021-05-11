<template>
    <teleport to=".main" v-if="modalVisible">
        <div @click.stop ref="collectionListModalRef" class="collectionListModal position-absolute translate-middle bg-white shadow rounded">
            <div ref="dragDomRef" class="title cursor-move w-100 d-flex justify-content-center align-items-center fs-5 fw-bold">
                <CloseIcon @click="modalVisible = false" class="cursor-pointer" width="18" height="18" />
                <div>收藏到歌单</div>
            </div>
            <div class="createdList overflow-scroll hideScrollBar">
                <div
                    @click="
                        defaultListName ? createListAndAdd() : (modalVisible = false);
                        addListModalVisible = true;
                    "
                    class="px-3 py-2 d-flex align-items-center cursor-pointer createdItem"
                >
                    <div class="createNewItemImg rounded me-3 d-flex justify-content-center align-items-center" style="height:56px;width:56px;">
                        <PlusIcon :color="themeColor" width="34" height="34" />
                    </div>
                    <div>
                        <div>创建为新歌单</div>
                    </div>
                </div>
                <div
                    class="px-3 py-2 d-flex align-items-center cursor-pointer hover-createdItem createdItem"
                    v-for="(item, index) in createdList"
                    :key="index"
                    @click="addToList(item)"
                >
                    <img class="rounded me-3" width="56" :src="item.coverImgUrl" alt="" />
                    <div>
                        <div>{{ item.name }}</div>
                        <div class="text-muted mt-1">{{ item.trackCount }}首音乐</div>
                    </div>
                </div>
            </div>
        </div>
    </teleport>
    <CommonToast ref="toastRef" />
    <CreateMusicListForm v-model:visible="addListModalVisible" v-model:formData="addMusicListObj" @complete="completeCreate" />
</template>

<script lang="ts">
import { computed, defineComponent, PropType, reactive, ref, toRefs, watch, watchEffect } from "vue";
import { getUserPlayList as getUserPlayListApi } from "@/api/login";
import { createPlayListApi, addDelMusicFromListApi } from "@/api/discover";
import { useStore } from "vuex";
import useDragMove from "@/hooks/useDragMove";
import { AxiosResponseProps } from "@/utils/request";
export default defineComponent({
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
        tracks: {
            type: Array as PropType<number[] | string[] | any[]>,
            default: [],
        },
        defaultListName: {
            type: String,
            default: "",
        },
    },
    setup(props, { emit }) {
        const state = reactive({
            userPlayList: [],
            collectedList: [],
            createdList: [],
            modalVisible: computed({
                get: () => props.visible,
                set: newV => emit("update:visible", newV),
            }),
            toastRef: ref(null),
            themeColor: computed(() => store.getters.getThemeColor),
            addListModalVisible: false,
            addMusicListObj: {
                name: "",
                isPrivate: false,
            },
        });
        const collectionListModalRef = ref(null);
        const dragDomRef = ref(null);
        const getUserPlayList = () => {
            return new Promise((resolve, reject) => {
                getUserPlayListApi().then((res: any) => {
                    if (res.code === 200) {
                        state.userPlayList = res.playlist;
                        state.collectedList = res.playlist.filter(item => item.creator.userId !== userId.value);
                        state.createdList = res.playlist.filter(item => item.creator.userId === userId.value);
                        resolve(null);
                    }
                });
            });
        };
        watchEffect(() => {
            if (props.visible) {
                useDragMove(collectionListModalRef, dragDomRef);
                getUserPlayList();
            }
        });
        const store = useStore();
        const userId = computed(() => store.state.userInfo.userId);
        const addToList = item => {
            addDelMusicFromListApi({ pid: item.id, tracks: String(props.tracks) }).then((res1: AxiosResponseProps) => {
                if (res1.status === 200 || res1.code === 200) {
                    getUserPlayList().then(() => {
                        store.dispatch("getCreatedMusicList").then(() => {
                            state.toastRef.success("已收藏歌单");
                            emit("update:visible", false);
                        });
                    });
                }
            });
        };
        const createListAndAdd = () => {
            try {
                createPlayListApi({
                    name: props.defaultListName as string,
                }).then((res: any) => {
                    if (res.code === 200) {
                        addToList({ id: res.id });
                    }
                });
            } catch (err) {
                state.toastRef.warn("收藏失败");
            }
        };
        const completeCreate = listObj => {
            addToList(listObj);
        };
        return {
            ...toRefs(state),
            collectionListModalRef,
            dragDomRef,
            createListAndAdd,
            addToList,
            completeCreate,
        };
    },
});
</script>

<style scoped lang="scss">
.collectionListModal {
    z-index: 999;
    width: 480px;
    height: 420px;
    left: 50%;
    top: 50%;
    .title {
        height: 90px;
        > svg {
            position: absolute;
            top: 9px;
            right: 9px;
            filter: invert(0.5);
        }
    }
    .createdList {
        height: 330px;
        .hover-createdItem {
            &:hover {
                background-color: rgb(228, 228, 228);
            }
        }
        .createdItem {
            .createNewItemImg {
                background-color: rgb(226, 226, 226);
            }
        }
    }
}
</style>
