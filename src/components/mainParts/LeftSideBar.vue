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
                        <PlusIcon
                              @click.stop="loginStatus === true ? (addListModalVisible = true) : $store.commit('changeLoginModalVisible', true)"
                              width="15"
                              height="15"
                              class="plusIcon me-5"
                        />
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
                        v-for="menu in menuList.filter(item => item.type === 'created').slice(1)"
                        :key="menu.key"
                        :class="{ visitedMenu: menu.active || menu.contextMenuActive, 'hover-menuItem': canMyLikeHover }"
                        :title="menu.name"
                        @contextmenu="handleMusicListContextMenu($event, menu)"
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
                        <MusicListIcon v-if="menu.privacy === 0" class="me-2 flex-shrink-0" width="20" height="20" />
                        <ListLockIcon v-if="menu.privacy === 10" class="me-2 flex-shrink-0" width="17" height="17" />
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
                        :class="{ visitedMenu: menu.active || menu.contextMenuActive, 'hover-menuItem': canMyLikeHover }"
                        :title="menu.name"
                        @contextmenu="handleMusicListContextMenu($event, menu, ['editInfo'])"
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
                        <MusicListIcon class="me-2 flex-shrink-0" width="20" height="20" />
                        <span class="text-ellipsis">{{ menu.name }}</span>
                  </div>
            </div>

            <div
                  v-if="showContextMenu"
                  :style="{
                        [contextIsUp ? 'bottom' : 'top']: `${contextIsUp ? documentClientHeight - contextMenuPageY : contextMenuPageY}px`,
                        left: `${contextMenuPageX}px`,
                  }"
                  class="contextMenu d-flex flex-column position-fixed rounded-1"
            >
                  <div
                        v-for="item in contextMenuList.filter(item1 => !forbidMenuList.includes(item1.operation))"
                        :key="item.operation"
                        @click="clickContextMenu(item.operation)"
                  >
                        <PlayOutlinedIcon v-if="item.operation == 'play'" color="#000" :width="item.iconWidth" :height="item.iconHeight" />
                        <DownloadMusicIcon v-if="item.operation == 'downloadAll'" color="#000" :width="item.iconWidth" :height="item.iconHeight" />
                        <LinkIcon v-if="item.operation == 'copyLink'" color="#000" :width="item.iconWidth" :height="item.iconHeight" />
                        <EditOutlinedIcon v-if="item.operation == 'editInfo'" color="#000" :width="item.iconWidth" :height="item.iconHeight" />
                        <DeleteIcon v-if="item.operation == 'delete'" color="#000" :width="item.iconWidth" :height="item.iconHeight" />
                        <span>{{ item.name }}</span>
                  </div>
            </div>
      </div>

      <CreateMusicListForm v-model:visible="addListModalVisible" v-model:formData="addMusicListObj" @complete="completeCreate" />

      <CommonToast ref="commonToastRef" />

      <common-modal @confirm="confirmCommonModal" v-model:visible="showCommonModal">
            <div class="text-center fs-5">确定删除该歌单？</div>
      </common-modal>
</template>

<script lang="ts">
import { useRouter } from "vue-router";
import { computed, defineComponent, reactive, ref, toRefs, watch } from "vue";
import { AxiosResponseProps } from "@/utils/request";
import { useStore } from "vuex";
import useClickDocument from "@/hooks/useClickDocument";
import { getDoucmentHeight } from "@/utils/document";
import { deletePlayList } from "@/api/playList";
import { copyValue } from "@/utils/document";
export default defineComponent({
      setup() {
            const router = useRouter();
            const store = useStore();
            const userId = computed(() => store.state.userInfo.userId);
            const initMenuList: { title: string; key?: string; active?: boolean; contextMenuActive?: boolean; path?: string; id?: number }[] = [
                  {
                        title: "发现音乐",
                        key: "fxyy",
                        active: true,
                        path: "/container/discoverMusic",
                  },
                  {
                        title: "视频",
                        path: "/container/videos",
                        key: "sp",
                  },
                  {
                        title: "朋友",
                        key: "py",
                        path: "/container/friends",
                  },
                  {
                        title: "直播",
                        key: "zb",
                  },
                  {
                        title: "私人FM",
                        key: "srfm",
                  },
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
                  commonToastRef: ref(null),
                  createdMusicList: computed(() => store.state.createdMusicList.filter(item => item.creator.userId === userId.value)),
                  collectedMusicList: computed(() => store.state.createdMusicList.filter(item => item.creator.userId !== userId.value)),
                  menuList: [...initMenuList],
                  contextMenuPageX: 0,
                  contextMenuPageY: 0,
                  showContextMenu: false,
                  contextIsUp: true,
                  documentClientHeight: 0,
                  contextMenuMuisicListItem: { id: null },
                  showCommonModal: false,
                  forbidMenuList: [],
                  contextMenuList: [
                        {
                              operation: "play",
                              name: "播放",
                              iconWidth: "21",
                              iconHeight: "21",
                        },
                        {
                              operation: "downloadAll",
                              name: "下载全部",
                              iconWidth: "18",
                              iconHeight: "18",
                        },
                        {
                              operation: "copyLink",
                              name: "复制链接",
                              iconWidth: "18",
                              iconHeight: "18",
                        },
                        {
                              operation: "editInfo",
                              name: "编辑歌单信息",
                              iconWidth: "16",
                              iconHeight: "16",
                        },
                        {
                              operation: "delete",
                              name: "删除歌单",
                              iconWidth: "16",
                              iconHeight: "16",
                        },
                  ],
            });
            watch(
                  () => state.createdMusicList,
                  newV => {
                        if (newV instanceof Array) {
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
                        return router.push({ path: "/container/createdMusicList", query: { id: menuItem.id } });
                  }
                  if (menuItem.path) {
                        router.push(menuItem.path);
                  }
            };
            const getCreatedMusicList = () => {
                  store.dispatch("getCreatedMusicList");
            };
            getCreatedMusicList();
            watch(
                  () => store.getters.getLoginStatus,
                  status => {
                        getCreatedMusicList();
                  }
            );
            const completeCreate = () => {
                  state.commonToastRef.success("创建歌单成功");
            };
            const stopDefaultEvent = event => {
                  state.showContextMenu = true;
                  event.preventDefault ? event.preventDefault() : (event.returnValue = false); //阻止默认行为
                  event.cancelBubble ? (event.cancelBubble = true) : event.stopPropagation; //阻止冒泡
                  state.contextMenuPageX = event.pageX;
                  state.contextMenuPageY = event.pageY;
                  state.documentClientHeight = getDoucmentHeight();
                  if (event.pageY > state.documentClientHeight / 2) {
                        state.contextIsUp = true;
                  } else {
                        state.contextIsUp = false;
                  }
            };
            const handleMusicListContextMenu = (event, menuItem, forbidMenuList) => {
                  if (forbidMenuList && forbidMenuList.length) {
                        state.forbidMenuList = forbidMenuList;
                  } else {
                        state.forbidMenuList = [];
                  }
                  state.menuList = state.menuList.map(item => ({ ...item, contextMenuActive: false }));
                  state.menuList.find(item => item.id == menuItem.id).contextMenuActive = true;
                  stopDefaultEvent(event);
                  state.contextMenuMuisicListItem = menuItem;
            };
            useClickDocument(() => {
                  state.showContextMenu = false;
                  state.menuList = state.menuList.map(item => ({ ...item, contextMenuActive: false }));
            });
            const clickContextMenu = type => {
                  switch (type) {
                        case "play":
                              router.push({
                                    path: "/container/createdMusicList",
                                    query: { id: state.contextMenuMuisicListItem.id, immediate: "true" },
                              });
                              break;
                        case "downloadAll":
                              router.push({
                                    path: "/container/createdMusicList",
                                    query: { id: state.contextMenuMuisicListItem.id, download: "true" },
                              });
                              break;
                        case "copyLink":
                              let musicListId = state.contextMenuMuisicListItem.id;
                              let userId = store.state.userInfo.userId;
                              copyValue(`http://music.163.com/playlist?id=${musicListId}&userid=${userId}`);
                              state.commonToastRef.success("链接复制成功");
                              break;
                        case "editInfo":
                              router.push({ path: "/container/updateMusicList", query: { id: state.contextMenuMuisicListItem.id } });
                              break;
                        case "delete":
                              state.showCommonModal = true;
                              break;
                  }
                  state.showContextMenu = false;
            };
            const confirmCommonModal = () => {
                  deletePlayList({ id: state.contextMenuMuisicListItem.id }).then(async (res: AxiosResponseProps) => {
                        if (res.code === 200) {
                              await store.dispatch("getCreatedMusicList");
                              state.commonToastRef.success("删除成功");
                        } else {
                              state.commonToastRef.error(res.msg || "删除失败，请稍后重试");
                        }
                  });
                  state.showCommonModal = false;
            };
            return {
                  ...toRefs(state),
                  clickMenuItem,
                  completeCreate,
                  window,
                  handleMusicListContextMenu,
                  clickContextMenu,
                  confirmCommonModal,
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
      .contextMenu {
            background-color: #fafafc;
            width: 180px;
            box-shadow: 0 0 4px 3px rgba($color: #000000, $alpha: 0.1);
            z-index: 999;
            border: 1px solid #dddddd;
            > div {
                  height: 37px;
                  display: flex;
                  align-items: center;
                  box-sizing: border-box;
                  padding: 0 15px;
                  font-size: 13px;
                  flex-shrink: 0;
                  > span:nth-of-type(1) {
                        margin-left: 12px;
                  }
                  &:hover {
                        background-color: #dadada;
                  }
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
</style>
