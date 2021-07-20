<template>
      <div
            @click.self="clickNav"
            id="nav"
            :class="{ mainNav: type === '' }"
            class="nav d-flex w-100 flex-shrink-0 flex-nowrap justify-content-between align-items-center"
      >
            <div class="leftArea d-flex align-items-center h-100">
                  <div v-if="type === ''" class="logo ms-4 cursor-pointer me-5"></div>
                  <div v-else class="dropDownOuter h-100 pe-4 me-5">
                        <div class="dropDown flex-center cursor-pointer ms-2" @click="$emit('ondrop')">
                              <arrow-left-icon class="rotate--90" color="#333" width="20px" height="20px" />
                        </div>
                  </div>
                  <div class="d-flex flex-center ms-5 me-5">
                        <div
                              @click="type === '' ? routeBack() : $emit('ondrop')"
                              class="rounded-circle routerBackIcon me-3 flex-center"
                              :class="{ cantBack: $store.state.routeFromList.length <= 1 }"
                              title="向前返回"
                        >
                              <ArrowLeftIcon title="向前返回" width="11" height="11" />
                        </div>
                        <div
                              @click="type === '' ? $router.forward() : $emit('ondrop')"
                              class="rounded-circle routerBackIcon flex-center"
                              :class="{ cantBack: !hasReturned }"
                              title="向后返回"
                        >
                              <ArrowRightIcon title="向后返回" width="11" height="11" />
                        </div>
                  </div>
                  <div @click.stop class="flex-center rounded-pill searchBox px-3 position-relative">
                        <SearchIcon width="15" height="15" />
                        <input
                              placeholder="搜索"
                              onfocus="this.placeholder=''"
                              @focus="searchHistoryVisible = true"
                              @keyup="SearchKeywordKeyup"
                              v-model="searchKeyword"
                              onblur="this.placeholder='搜索'"
                              class="searchInput rounded-pill text-white ms-1"
                              type="text"
                        />
                        <SearchHistoryPanel
                              @unshiftKeyword="unshiftKeyword"
                              v-model="searchHistoryVisible"
                              v-model:keyword="searchKeyword"
                              v-if="searchHistoryVisible && !searchKeyword.length"
                        />
                        <!-- <pre>{{searchHistoryVisible && searchKeyword.length}}</pre> -->
                        <SearchResultList
                              v-model="searchHistoryVisible"
                              v-if="searchHistoryVisible && searchKeyword.length"
                              :keyword="searchKeyword"
                              @unshiftKeyword="unshiftKeyword(searchKeyword)"
                        />
                  </div>
            </div>
            <div class="rightArea d-flex align-items-center mx-3">
                  <span v-if="type === ''">
                        <span
                              v-if="userInfo && userInfo.nickname"
                              @click.stop="userInfoModalVisible = !userInfoModalVisible"
                              class="position-relative"
                        >
                              <img :src="userInfo.avatarUrl" class="rounded-circle cursor-pointer" width="28" alt="" />
                              <span class="hover-opacity text-white ms-3 fs-6 cursor-pointer">{{ userInfo.nickname }}</span>
                              <DownArrowIcon class="ms-2 hover-opacity cursor-pointer" width="12" height="12" />
                              <UserInfoModal v-model:visible="userInfoModalVisible" />
                        </span>
                        <span v-else @click="loginModalVisible = !loginModalVisible" class="cursor-pointer hover-opacity position-relative">
                              <NotLoginIcon width="28" height="28" />
                              <span class="text-white ms-3 fs-6">未登录</span>
                              <DownArrowIcon class="ms-2" width="12" height="12" />
                        </span>
                  </span>

                  <span v-if="type === ''" class="position-relative">
                        <SkinIcon class="ms-5" width="18" height="18" @click.stop="themePanelVisible = !themePanelVisible" />
                        <ThemePanel @click.stop v-if="themePanelVisible" />
                  </span>
                  <EmailIcon class="ms-4" width="18" height="18" />
                  <div class="border-end ms-4 opacity-50" style="height:16px;"></div>
                  <ToHomeIcon @click="type === '' ? $router.push('/') : $emit('ondrop')" width="19" height="19" />
                  <FullScreenIsTrueIcon v-if="isFullScreen" @click="toggleFullScreen" width="18" height="18" />
                  <FullScreenIsFalseIcon v-else @click="toggleFullScreen" width="18" height="18" />
                  <CloseIcon @click="handleCloseWindow" width="16" height="16" />
            </div>
            <LoginModal v-model:visible="loginModalVisible" v-if="loginModalVisible" />
            <CommonModal
                  title="关闭提示"
                  v-model:visible="closeModalVisible"
                  bodyClass="text-center"
                  @confirm="
                        window.opener = null;
                        window.open('', '_self');
                        window.close();
                  "
            >
                  <div class="closeTips" v-html="closeTipsText" />
            </CommonModal>
      </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, toRefs, watch } from "vue";
import useFullScrenn from "@/hooks/useFullScreen";
import useClickDocument, { useClickOnce } from "@/hooks/useClickDocument";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
const searchHistoryKey = "searchHistory";
export default defineComponent({
      props: {
            type: { type: String, default: "" },
      },
      setup() {
            const store = useStore();
            const router = useRouter();
            let { toggleFullScreen } = useFullScrenn();
            const state = reactive({
                  isFullScreen: computed(() => store.state.fullScreen),
                  themePanelVisible: false,
                  closeModalVisible: false,
                  loginModalVisible: computed({
                        get: () => store.state.loginModalVisible,
                        set: newV => store.commit("changeLoginModalVisible", newV),
                  }),
                  userInfoModalVisible: false,
                  searchHistoryVisible: false,
                  closeTipsText: "",
                  userInfo: computed(() => store.state.userInfo),
                  isClickOnce: false,
                  searchKeyword: "",
                  hasReturned: false,
            });
            store.dispatch("getUserInfo");
            useClickDocument(() => {
                  state.themePanelVisible = false;
                  state.userInfoModalVisible = false;
                  state.isClickOnce ? (state.searchHistoryVisible = false) : false;
            });
            useClickOnce(
                  () => {
                        state.isClickOnce = true;
                  },
                  () => {
                        state.isClickOnce = false;
                  }
            );
            const handleCloseWindow = () => {
                  state.closeModalVisible = true;
                  if (window.navigator.userAgent.includes("Firefox")) {
                        state.closeTipsText =
                              "<div>火狐不支持脚本直接关闭,若要关闭请根据如下设置：</div>" +
                              "<ul style='list-style: decimal;'><li>在Firefox输入网址栏中输入about:config，然后按键盘Enter进入</li>" +
                              "<li>页面显示可能使质量保证失效。我们点击：我保证小心。</li>" +
                              "<li>在搜索栏中搜索dom.allow_scripts_to_close_windows，找到相关的设置，右击点击切换，把选项从“false”转为“ture”</li>";
                  } else {
                        state.closeTipsText = "确定要关闭吗?";
                  }
            };
            let clickedArr: number[] = [];
            const clickNav = () => {
                  if (clickedArr.length === 2) {
                        clickedArr.splice(0, 1);
                  }
                  clickedArr.push(Date.now());
                  if (clickedArr[1] - clickedArr[0] < 500) {
                        toggleFullScreen();
                  }
            };
            const unshiftKeyword = (searchKeyword: string) => {
                  console.log(searchKeyword);
                  if (!searchKeyword) return;
                  let searchHistory = localStorage[searchHistoryKey] ? JSON.parse(localStorage[searchHistoryKey]) : [];
                  for (let i = 0; i < searchHistory.length; i++) {
                        if (searchHistory[i].title === state.searchKeyword) {
                              searchHistory.splice(i, 1);
                              i--;
                        }
                  }
                  searchHistory.unshift({ title: state.searchKeyword });
                  localStorage[searchHistoryKey] = JSON.stringify(searchHistory);
            };
            const SearchKeywordKeyup = e => {
                  if (e.keyCode === 13) {
                        unshiftKeyword(state.searchKeyword);
                        router.push({ path: "/container/searchResultDetail", query: { keyword: state.searchKeyword } });
                        state.searchHistoryVisible = false;
                  }
            };
            const routeBack = () => {
                  state.hasReturned = true;
                  router.back();
            };
            return {
                  SearchKeywordKeyup,
                  toggleFullScreen,
                  handleCloseWindow,
                  clickNav,
                  window,
                  routeBack,
                  unshiftKeyword,
                  ...toRefs(state),
            };
      },
});
</script>

<style scoped lang="scss">
.nav {
      height: 60px;
      flex-shrink: 0;
      .leftArea {
            .logo {
                  background-image: url(../../assets/img/topbar.png);
                  background-repeat: no-repeat;
                  background-position: 0 -12.5px;
                  width: 170px;
                  height: 45px;
                  transform: scale(0.88);
            }
            .dropDownOuter {
                  width: 170px;
                  height: 45px;
                  .dropDown {
                        width: 60px;
                        height: 60px;
                  }
            }
            .routerBackIcon {
                  width: 25px;
                  height: 25px;
                  background-color: rgba($color: #000000, $alpha: 0.12);
                  cursor: pointer;
            }
            .cantBack {
                  cursor: auto;
                  background-color: rgba($color: #000000, $alpha: 0.06);
                  svg {
                        opacity: 0.3;
                  }
            }
            .searchBox {
                  background-color: rgba($color: #000000, $alpha: 0.04);
                  height: 32px;
            }
            .searchInput {
                  height: 26px;
                  outline: none !important;
                  border: none;
                  background-color: transparent;
                  &::placeholder {
                        color: rgba($color: #ffffff, $alpha: 0.35);
                  }
            }
      }
      .rightArea {
            position: relative;
            flex-shrink: 0;
            svg {
                  opacity: 0.86;
                  @extend .cursor-pointer;
                  &:hover {
                        opacity: 1;
                  }
            }
            svg ~ svg {
                  margin-left: 18px;
            }
      }
}
.closeTips {
      color: rgb(112, 112, 112);
      font-size: 14px;
      line-height: 2;
      @extend .canSelect;
      :deep > div:first-child {
            font-weight: bold;
      }
      :deep > ul {
            text-align: left;
      }
}
.primaryTheme {
      .mainNav {
            background-color: $primary;
      }
}
.darkTheme {
      .mainNav {
            background-color: $dark;
      }
}
.freeTheme {
      .mainNav {
            background-color: $free;
      }
}
</style>
