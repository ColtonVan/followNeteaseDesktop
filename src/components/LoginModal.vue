<template>
    <teleport to="body" v-if="modalVisible">
        <div class="loginModal shadow">
            <CloseIcon @click="modalVisible = false" class="cursor-pointer" width="19px" height="19px" />
            <div class="pt-5 d-flex flex-column align-items-center">
                <div class="fs-2 mt-3 mb-3 pt-5 text-center">扫码登陆</div>
                <div v-if="qrStatus === 801" class="d-flex flex-column align-items-center">
                    <div class="qrBox position-relative">
                        <img width="180" :src="qrCode" alt="" />
                        <div
                            v-if="qrStatus === 800"
                            class="mask fs-5 text-white position-absolute top-50 start-50 translate-middle d-flex flex-column justify-content-center align-items-center"
                        >
                            <div>二维码已失效</div>
                            <div class="cursor-pointer px-3 py-1 mt-3 rounded bg-info">点击刷新</div>
                        </div>
                    </div>
                    <div class="fs-5 mb-5 pb-3">
                        使用
                        <a href="https://music.163.com/#/download" target="_blank">网易云音乐APP</a>
                        扫码登陆
                    </div>
                    <div class="cursor-pointer pt-5 mt-5 text-muted">选择其他登录模式 ></div>
                </div>
                <div v-if="qrStatus === 802" class="mt-3">
                    <img width="320" :src="require('@/assets/img/scanQrSuccess.png')" alt="" />
                    <div class="text-center text-muted mt-4 fs-5">扫描成功</div>
                    <div class="text-center mt-5 fs-5">请在手机上确认登录</div>
                </div>
            </div>
        </div>
    </teleport>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, toRefs, watch } from "vue";
import { getQrKey, createLoginQr, checkQrStatus } from "@/api/login";
import { AxiosResponseProps } from "@/utils/request";
import { useStore } from "vuex";
export default defineComponent({
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
    },
    setup(props, { emit }) {
        const store = useStore();
        const state = reactive<any>({
            modalVisible: computed({
                get: () => props.visible,
                set: newV => emit("update:visible", newV),
            }),
            qrCode: "",
            qrStatus: 801, //800为二维码过期,801为等待扫码,802为待确认,803为授权登录成功(803状态码下会返回cookies)
        });
        const operationByGetQr = () => {
            let timer: any = null;
            watch(
                () => state.qrStatus,
                newV => {
                    if (newV === 803) {
                        store.dispatch("getUserInfo");
                        emit("update:visible", false);
                        state.qrStatus = 801;
                        clearInterval(timer);
                        timer = null;
                    }
                }
            );
            watch(
                () => props.visible,
                async newV => {
                    if (newV === true) {
                        if (timer) {
                            clearInterval(timer);
                        }
                        let key = (await getQrKey()).data.unikey;
                        state.qrCode = (await createLoginQr({ key, qrimg: true, timeStamp: Date.now() })).data.qrimg;
                        timer = setInterval(async () => {
                            state.qrStatus = ((await checkQrStatus({
                                key,
                                timeStamp: Date.now(),
                            })) as AxiosResponseProps).code;
                        }, 1200);
                    } else {
                        clearInterval(timer);
                        timer = null;
                    }
                }
            );
        };
        operationByGetQr();
        return {
            ...toRefs(state),
        };
    },
});
</script>

<style scoped lang="scss">
.loginModal {
    position: absolute;
    width: 350px;
    height: 530px;
    left: 50vw;
    top: 10vh;
    transform: translateX(-50%);
    z-index: 998;
    background-color: #fff;
    > svg:first-child {
        position: absolute;
        top: 9px;
        right: 9px;
        filter: invert(0.5);
    }
    .qrBox {
        width: 180px;
        height: 180px;
        .mask {
            background-color: rgba($color: #000000, $alpha: 0.8);
            width: 86%;
            height: 86%;
        }
    }
}
</style>
