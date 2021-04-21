<template>
    <div @click.self="clickNav" class="nav d-flex justify-content-between align-items-center">
        <div class="leftArea">
            <div class="logo ms-4 cursor-pointer"></div>
        </div>
        <div class="rightArea d-flex align-items-center mx-3">
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
            <span
                v-else
                @click="loginModalVisible = !loginModalVisible"
                class="cursor-pointer hover-opacity position-relative"
            >
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
            <ToHomeIcon width="19" height="19" />
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
import { computed, defineComponent, reactive, toRefs } from "vue";
import useFullScrenn from "@/hooks/useFullScreen";
import useClickDocument from "@/hooks/useClickDocument";
import { useStore } from "vuex";
export default defineComponent({
    setup() {
        const store = useStore();
        let { toggleFullScreen } = useFullScrenn();
        const state = reactive({
            isFullScreen: computed(() => store.state.fullScreen),
            themePanelVisible: false,
            closeModalVisible: false,
            loginModalVisible: false,
            userInfoModalVisible: false,
            closeTipsText: "",
            userInfo: computed(() => store.state.userInfo),
        });
        store.dispatch("getUserInfo");
        useClickDocument(() => {
            state.themePanelVisible = false;
            state.userInfoModalVisible = false;
        });
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
        return {
            toggleFullScreen,
            handleCloseWindow,
            clickNav,
            window,
            ...toRefs(state),
        };
    },
});
</script>

<style scoped lang="scss">
.nav {
    height: 60px;
    width: 100vw;
    flex-shrink: 0;
    .leftArea {
        .logo {
            background-image: url(../assets/img/topbar.png);
            background-repeat: no-repeat;
            background-position: 0 -12.5px;
            width: 170px;
            height: 45px;
            transform: scale(0.88);
        }
    }
    .rightArea {
        position: relative;
        /* margin-right: 200px !important; */
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
    ::v-deep > div:first-child {
        font-weight: bold;
    }
    ::v-deep > ul {
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
