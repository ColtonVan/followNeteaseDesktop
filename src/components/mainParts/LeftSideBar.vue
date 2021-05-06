<template>
    <div class="leftSideBar hideScrollBar border-end ps-3 pe-1 pt-2 fs-5 flex-shrink-0">
        <div
            class="mt-1 p-2 cursor-pointer rounded hover-menuItem"
            :class="{ visitedMenu: menu.active, 'fw-bold': menu.active }"
            @click="
                menuList = menuList.map((item, index) => {
                    if (menu.key === item.key) {
                        return { ...item, active: true };
                    } else {
                        return { ...item, active: false };
                    }
                });
                clickMenuItem(menu);
            "
            v-for="menu in menuList.slice(0, 5)"
            :key="menu.key"
        >
            {{ menu.title }}
        </div>

        <div
            @click="createdCollapsed = !createdCollapsed"
            class="hover-arrow cursor-pointer text-black-50 fs-6 ps-2 py-3 d-flex align-items-center justify-content-between"
        >
            <div :title="createdCollapsed ? '展开' : '收起'">
                <span class="me-2">创建的歌单</span>
                <DownArrowIcon :class="{ createdCollapsed }" class="downArrow" color="rgba(0, 0, 0, 0.5)" width="10px" height="10px" />
            </div>
            <div title="新建歌单">
                <PlusIcon @click.stop="addListModalVisible = true" width="15" height="15" class="plusIcon me-5" />
            </div>
        </div>

        <div v-if="!createdCollapsed">
            <div
                class="mt-1 p-2 cursor-pointer rounded likedMusic d-flex align-items-center"
                v-for="menu in menuList.slice(5, 6)"
                :key="menu.key"
                :class="{ visitedMenu: menu.active, 'hover-menuItem': canMyLikeHover }"
                @click="
                    menuList = menuList.map((item, index) => {
                        if (menu.key === item.key) {
                            return { ...item, active: true };
                        } else {
                            return { ...item, active: false };
                        }
                    });
                    clickMenuItem(menu);
                "
            >
                <LikedIcon class="me-2" width="15px" height="15px" />
                <span>我喜欢的音乐</span>
                <div
                    class="heartBeat rounded-pill py-1 px-3 border ms-2 d-flex align-items-center"
                    @mouseover="canMyLikeHover = false"
                    @mouseout="canMyLikeHover = true"
                >
                    <HeartBeatIcon width="20px" height="20px" />
                </div>
            </div>

            <div
                class="mt-1 p-2 cursor-pointer rounded likedMusic d-flex align-items-center"
                v-for="menu in menuList.filter(item => item.type === 'created')"
                :key="menu.key"
                :class="{ visitedMenu: menu.active, 'hover-menuItem': canMyLikeHover }"
                :title="menu.name"
                @click="
                    menuList = menuList.map((item, index) => {
                        if (menu.key === item.key) {
                            return { ...item, active: true };
                        } else {
                            return { ...item, active: false };
                        }
                    });
                    clickMenuItem(menu);
                "
            >
                <MusicListIcon class="me-2" width="20" height="20" />
                <span class="text-ellipsis">{{ menu.name }}</span>
            </div>
        </div>

        <div
            @click="collectedCollapsed = !collectedCollapsed"
            class="hover-arrow cursor-pointer text-black-50 fs-6 ps-2 py-3 d-flex align-items-center justify-content-between"
        >
            <div :title="collectedCollapsed ? '展开' : '收起'">
                <span class="me-2">收藏的歌单</span>
                <DownArrowIcon
                    :class="{ createdCollapsed: collectedCollapsed }"
                    class="downArrow"
                    color="rgba(0, 0, 0, 0.5)"
                    width="10px"
                    height="10px"
                />
            </div>
        </div>

        <div v-if="!collectedCollapsed">
            <div
                class="mt-1 p-2 cursor-pointer rounded likedMusic d-flex align-items-center"
                v-for="menu in menuList.filter(item => item.type === 'collected')"
                :key="menu.key"
                :class="{ visitedMenu: menu.active, 'hover-menuItem': canMyLikeHover }"
                :title="menu.name"
                @click="
                    menuList = menuList.map((item, index) => {
                        if (menu.key === item.key) {
                            return { ...item, active: true };
                        } else {
                            return { ...item, active: false };
                        }
                    });
                    clickMenuItem(menu);
                "
            >
                <MusicListIcon class="me-2" width="20" height="20" />
                <span class="text-ellipsis">{{ menu.name }}</span>
            </div>
        </div>
    </div>

    <CommonModal title="新建歌单" v-model:visible="addListModalVisible">
        <template #default>
            <input
                @keyup.enter="keyupNmaeInput"
                class="listNameInput py-2 px-3 rounded mb-2"
                v-model="addMusicListObj.name"
                type="text"
                placeholder="请输入新歌单标题"
            />
            <label for="isPrivate" class="d-flex align-items-center fs-5">
                <input class="me-2" type="checkbox" v-model="addMusicListObj.isPrivate" name="isPrivate" id="isPrivate" />
                设置为隐私歌单
            </label>
        </template>
        <template #buttons>
            <div @click="createList" class="okBtn cursor-pointer d-flex justify-content-center align-items-center">
                创建
            </div>
        </template>
    </CommonModal>

    <CommonToast ref="commonModalRef" />
</template>

<script lang="ts">
import { useRouter } from "vue-router";
import { computed, defineComponent, reactive, ref, toRefs, watch } from "vue";
import { createPlayListApi } from "@/api/discover";
import { AxiosResponseProps } from "@/utils/request";
import { useStore } from "vuex";
export default defineComponent({
    setup() {
        const router = useRouter();
        const store = useStore();
        const userId = computed(() => store.state.userInfo.userId);
        const initMenuList = [
            {
                title: "发现音乐",
                key: "fxyy",
                active: true,
                path: "/discoverMusic",
            },
            {
                title: "视频",
                path: "/videos",
                key: "sp",
            },
            {
                title: "朋友",
                key: "py",
            },
            {
                title: "直播",
                key: "zb",
            },
            {
                title: "私人FM",
                key: "srfm",
            },
            // {
            //     title: "我喜欢的音乐",
            //     key: "wxhdyy",
            //     id: 0,
            // },
        ];
        const state = reactive({
            createdCollapsed: false,
            collectedCollapsed: false,
            canMyLikeHover: true,
            addListModalVisible: false,
            addMusicListObj: {
                name: "",
                isPrivate: false,
            },
            commonModalRef: ref(null),
            createdMusicList: computed(() => store.state.createdMusicList.filter(item => item.creator.userId === userId.value)),
            collectedMusicList: computed(() => store.state.createdMusicList.filter(item => item.creator.userId !== userId.value)),
            menuList: [...initMenuList],
        });
        watch(
            () => state.createdMusicList,
            newV => {
                if (newV && newV.length) {
                    state.menuList = [
                        ...initMenuList,
                        ...newV.map(item => ({ ...item, key: item.id, type: "created" })),
                        ...state.collectedMusicList.map(item => ({ ...item, key: item.id, type: "collected" })),
                    ];
                }
            }
        );
        const clickMenuItem = menuItem => {
            if (menuItem.id !== undefined) {
                return router.push({ path: "/createdMusicList", query: { id: menuItem.id } });
            }
            if (menuItem.path) {
                router.push(menuItem.path);
            }
        };
        const createList = () => {
            const { name, isPrivate } = state.addMusicListObj;
            let params: { name: string; privacy?: number } = { name };
            if (isPrivate) params.privacy = 10;
            createPlayListApi(params).then((res: AxiosResponseProps) => {
                if (res.code === 200) {
                    store.dispatch("getCreatedMusicList").then(() => {
                        state.addListModalVisible = false;
                        state.commonModalRef.success("创建歌单成功");
                        state.addMusicListObj.name = "";
                    });
                }
            });
        };
        const getCreatedMusicList = () => {
            store.dispatch("getCreatedMusicList");
        };
        getCreatedMusicList();
        const keyupNmaeInput = e => {
            createList();
        };
        return {
            ...toRefs(state),
            keyupNmaeInput,
            clickMenuItem,
            createList,
            window,
        };
    },
});
</script>

<style scoped lang="scss">
.leftSideBar {
    width: 200px;
    height: calc(100vh - 75px - 60px);
    overflow-y: scroll;
    .hover-menuItem {
        &:hover {
            background-color: #f3f3f3;
        }
    }
    .visitedMenu {
        background-color: #f3f3f3;
    }
    .hover-arrow {
        svg {
            opacity: 0.6;
        }
        &:hover {
            svg {
                opacity: 1;
            }
        }
        .createdCollapsed {
            transform: translateY(-15%) rotate(-90deg) !important;
        }
        .downArrow {
            transition: transform ease 0.3s;
            transform: translateY(-15%);
        }
        .plusIcon {
            filter: invert(1);
            opacity: 1 !important;
            transform: translateY(-15%);
        }
    }
    .heartBeat {
        &:hover {
            background-color: #f3f3f3;
        }
    }
}
.listNameInput {
    outline: none !important;
    width: 100%;
    border: 1px solid #cecece;
    &::placeholder {
        color: #cecece;
    }
}
.okBtn {
    width: 106px;
    height: 38px;
    border-radius: 20px;
    position: absolute;
    left: 50%;
    bottom: 0;
    transform: translateX(-50%);
    color: #fff;
    background-color: $primary;
    &:hover {
        filter: invert(0.08);
    }
}
.primaryTheme {
    .okBtn {
        background-color: $primary;
    }
}
.darkTheme {
    .okBtn {
        background-color: $dark;
    }
}
.freeTheme {
    .okBtn {
        background-color: $free;
    }
}
</style>
