<template>
    <div @click.self="clickNav" id="nav" class="nav d-flex w-100 flex-shrink-0 flex-nowrap justify-content-between align-items-center">
        <div class="leftArea d-flex align-items-center">
            <div class="logo ms-4 cursor-pointer me-5"></div>
            <div class="d-flex flex-center ms-5 me-5">
                <div
                    @click="routeBack"
                    class="rounded-circle routerBackIcon me-3 flex-center"
                    :class="{ cantBack: $store.state.routeFromList.length <= 1 }"
                    title="向前返回"
                >
                    <ArrowLeftIcon title="向前返回" width="11" height="11" />
                </div>
                <div
                    @click="$router.forward()"
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
                <SearchHistoryPanel v-if="searchHistoryVisible" />
            </div>
        </div>
        <div class="rightArea d-flex align-items-center mx-3">
            <span v-if="userInfo && userInfo.nickname" @click.stop="userInfoModalVisible = !userInfoModalVisible" class="position-relative">
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
            <span class="position-relative">
                <SkinIcon class="ms-5" width="18" height="18" @click.stop="themePanelVisible = !themePanelVisible" />
                <ThemePanel @click.stop v-if="themePanelVisible" />
            </span>
            <EmailIcon class="ms-4" width="18" height="18" />
            <div class="border-end ms-4 opacity-50" style="height:16px;"></div>
            <ToHomeIcon @click="$router.push('/')" width="19" height="19" />
            <FullScreenIsTrueIcon v-if="isFullScreen" @click="toggleFullScreen" width="18" height="18" />
            <FullScreenIsFalseIcon v-else @click="toggleFullScreen" width="18" height="18" />
            <CloseIcon @click="handleCloseWindow" width="16" height="16" />
        </div>
    </div>
    <LoginModal v-model:visible="loginModalVisible" />
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
</template>

<script lang="ts">
import { computed, defineComponent, reactive, toRefs, watch } from "vue";
import useFullScrenn from "@/hooks/useFullScreen";
import useClickDocument, { useClickDom, useClickOnce } from "@/hooks/useClickDocument";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
const searchHistoryKey = "searchHistory";
export default defineComponent({
    setup() {
        const store = useStore();
        const router = useRouter();
        let { toggleFullScreen } = useFullScrenn();
        const state = reactive({
            isFullScreen: computed(() => store.state.fullScreen),
            themePanelVisible: false,
            closeModalVisible: false,
            loginModalVisible: false,
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
        const SearchKeywordKeyup = e => {
            if (e.keyCode === 13) {
                if (localStorage[searchHistoryKey]) {
                    let searchHistory = JSON.parse(localStorage[searchHistoryKey]);
                    searchHistory.push({ title: state.searchKeyword });
                    localStorage[searchHistoryKey] = JSON.stringify(searchHistory);
                }
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
    .nav {
        background-color: $primary;
    }
}
.darkTheme {
    .nav {
        background-color: $dark;
    }
}
.freeTheme {
    .nav {
        background-color: $free;
    }
}
</style>
