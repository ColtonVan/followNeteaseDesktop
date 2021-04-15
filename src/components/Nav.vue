<template>
    <div class="nav d-flex justify-content-between align-items-center">
        <div class="leftArea"></div>
        <div class="rightArea d-flex align-items-center mx-3">
            <span class="cursor-pointer">
                <NotLoginIcon width="28" height="28" />
                <span class="text-white ms-3 fs-6">未登录</span>
                <DownArrowIcon class="ms-2" width="12" height="12"/>
            </span>
            <SkinIcon class="ms-5" width="18" height="18" @click.stop="themePanelVisible = !themePanelVisible" />
            <ThemePanel @click.stop v-if="themePanelVisible" />
            <EmailIcon width="18" height="18" />
            <div class="border-end ms-4 opacity-50" style="height:16px;"></div>
            <ToHomeIcon width="19" height="19" />
            <FullScreenIsTrueIcon v-if="isFullScreen" @click="toggleFullScreen" width="18" height="18" />
            <FullScreenIsFalseIcon v-else @click="toggleFullScreen" width="18" height="18" />
            <CloseIcon @click="handleCloseWindow" width="16" height="16" />
        </div>
    </div>
    <CommonModal
        title="关闭提示"
        v-model:visible="modalVisible"
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
            modalVisible: false,
            closeTipsText: "",
        });
        useClickDocument(() => {
            state.themePanelVisible = false;
        });
        const handleCloseWindow = () => {
            state.modalVisible = true;
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
        return {
            toggleFullScreen,
            handleCloseWindow,
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
