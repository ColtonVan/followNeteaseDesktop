<template>
    <div
        v-if="visible && userDetail.profile.eventCount !== undefined"
        @click.stop
        class="userInfoModal shadow position-absolute start-50 translate-middle-x rounded d-flex flex-column align-items-center"
    >
        <div class="w-100 d-flex justify-content-evenly pt-4 pb-4">
            <div class="text-center cursor-pointer">
                <div class="fs-4 fw-bolder">{{ userDetail.profile.eventCount }}</div>
                <div class="text-muted">
                    动态
                </div>
            </div>
            <div class="text-center cursor-pointer">
                <div class="fs-4 fw-bolder">{{ userDetail.profile.follows }}</div>
                <div class="text-muted">
                    关注
                </div>
            </div>
            <div class="text-center cursor-pointer">
                <div class="fs-4 fw-bolder">{{ userDetail.profile.followeds }}</div>
                <div class="text-muted">
                    粉丝
                </div>
            </div>
        </div>
        <div
            class="SignInBox lineHover mb-3 cursor-pointer text-center border rounded-pill px-3 py-1 fs-5 d-flex align-item-center"
        >
            <SignInIcon class="me-1" width="20px" height="20px" />
            <span>签到</span>
        </div>
        <div class="splitLine w-100 border-bottom my-1"></div>
        <div class="lineHover cursor-pointer w-100 px-4 py-3 d-flex justify-content-between align-items-center">
            <div><LevelIcon width="20px" height="20px" class="me-2" /><span>等级</span></div>
            <div class="text-muted"><span class="fst-italic me-1">Lv.</span><span>8</span></div>
        </div>
        <div class="lineHover cursor-pointer w-100 px-4 py-3 d-flex justify-content-between align-items-center">
            <div><UserInfoIcon width="20px" height="20px" class="me-2" />个人信息设置</div>
            <ArrowRightIcon class="opacity-75" width="15px" height="15px" />
        </div>
        <div class="splitLine w-100 border-bottom my-1"></div>
        <div
            @click="handleLogout"
            class="lineHover cursor-pointer w-100 px-4 py-3 d-flex justify-content-between align-items-center"
        >
            <div><LogoutIcon width="20px" height="20px" class="me-2" /><span>退出登录</span></div>
        </div>
    </div>
</template>

<script lang="ts">
import { useStore } from "vuex";
import { computed, defineComponent, reactive, toRefs, watch } from "vue";

export default defineComponent({
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
    },
    setup(props, { emit }) {
        const store = useStore();
        watch(
            () => props.visible,
            newV => {
                if (newV) {
                    store.dispatch("getUserDetail");
                }
            }
        );
        const state = reactive({
            userDetail: computed(() => store.state.userDetail),
            visible: computed({
                get: () => props.visible,
                set: newV => emit("update:visible", newV),
            }),
        });
        const handleLogout = () => {
            store.dispatch("logout");
        };
        return {
            ...toRefs(state),
            handleLogout,
        };
    },
});
</script>

<style lang="scss" scoped>
.userInfoModal {
    width: 285px;
    height: 378px;
    top: 44px;
    z-index: 997;
    background-color: #fff;
    .lineHover {
        &:hover {
            background-color: rgba(#000, 0.05);
        }
    }
    .SignInBox {
    }
    .splitLine {
    }
}
</style>
