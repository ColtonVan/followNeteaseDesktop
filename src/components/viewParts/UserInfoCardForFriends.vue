<template>
    <div class="userInfoBox w-100 pt-4 pb-4 px-3 d-flex flex-column justify-content-between">
        <div class="d-flex align-items-center">
            <img class="me-2 rounded-circle border" width="62.5" height="62.5" :src="userInfo.avatarUrl" alt="" />
            <div class="flex-grow-0 w-0 text-ellipsis">
                <div class="d-flex align-items-center mb-1">
                    <span class="me-1 hover-opacity">{{ userInfo.nickname }}</span>
                    <MaleIcon v-if="userInfo.gender === 1" width="16" height="16" />
                    <FemaleIcon v-if="userInfo.gender === 2" width="16" height="16" />
                </div>
                <div class="text-ellipsis w-100 text-black-50">{{ userInfo.signature }}</div>
            </div>
        </div>
        <div class="d-flex">
            <div class="flex-grow-1 hover-opacity flex-center flex-column">
                <div class="mb-2 fs-5">{{ userDetail?.profile?.eventCount || 0 }}</div>
                <div>动态</div>
            </div>
            <div class="border-start flex-center flex-column border-end flex-grow-1 hover-opacity">
                <div class="mb-2 fs-5">{{ userDetail?.profile?.follows || 0 }}</div>
                <div>关注</div>
            </div>
            <div class="flex-grow-1 hover-opacity flex-center flex-column">
                <div class="mb-2 fs-5">{{ userDetail?.profile?.followeds || 0 }}</div>
                <div>粉丝</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import store from "@/store";
import { computed, defineComponent, reactive, toRefs } from "vue";
export default defineComponent({
    setup() {
        const state = reactive({
            userInfo: computed(() => store.state.userInfo),
            userDetail: computed(() => store.state.userDetail),
        });
        store.dispatch("getUserDetail");
        return {
            ...toRefs(state),
        };
    },
});
</script>

<style scoped lang="scss">
.userInfoBox {
    background-color: #f5f5f7;
    height: 165px;
}
</style>
