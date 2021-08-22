<template>
      <div ref="loginModalRef" class="loginModal shadow">
            <CloseIcon @click="modalVisible = false" class="cursor-pointer closeSvg" width="19px" height="19px" />
            <div v-if="loginMethod == 'QR'" class="pt-5 d-flex flex-column align-items-center">
                  <div class="fs-2 mt-3 mb-3 pt-5 text-center">扫码登陆</div>
                  <div v-if="qrStatus === 802" class="mt-3">
                        <img width="320" :src="require('@/assets/img/scanQrSuccess.png')" alt="" />
                        <div class="text-center text-muted mt-4 fs-5">扫描成功</div>
                        <div class="text-center mt-5 fs-5">请在手机上确认登录</div>
                  </div>
                  <div v-else class="hoverQrBox position-relative" :class="{ aniHoverQrBox: qrStatus !== 800 }">
                        <div
                              class="scanImg bg-base position-absolute start-0 top-0"
                              style="width: 126px;height: 221px;"
                              :style="{
                                    backgroundImage: `url(https://s2.music.126.net/style/web2/img/qr_guide.png?c36b42a2f160ec1685bb1cbdbb80f627)`,
                              }"
                        ></div>
                        <div class="qrBoxOuter d-flex flex-column align-items-center">
                              <div class="qrBox position-relative">
                                    <img class="w-100" :src="qrCode" alt="" />
                                    <div
                                          v-if="qrStatus === 800"
                                          class="mask fs-5 text-white position-absolute top-50 start-50 translate-middle d-flex flex-column justify-content-center align-items-center"
                                    >
                                          <div>二维码已失效</div>
                                          <div @click="getQrCode" class="cursor-pointer px-3 py-1 mt-3 rounded bg-info">点击刷新</div>
                                    </div>
                              </div>
                              <div class="loginTips fs-5 mb-5 pb-3 mt-2 text-center">
                                    使用
                                    <a href="https://music.163.com/#/download" target="_blank">网易云音乐APP</a>
                                    扫码登陆
                              </div>
                        </div>
                  </div>
                  <div @click="loginMethod = 'account'" class="cursor-pointer pt-5 mt-5 text-muted">选择其他登录模式 ></div>
            </div>
            <div v-if="loginMethod == 'account'" class="d-flex flex-column h-100 accountMethod position-relative">
                  <div class="qrdemo position-absolute bg-base" :style="{ backgroundImage: `url(${require('@/assets/img/qrdemo.png')})` }" />
                  <div
                        class="loginInAccountBg position-relative bg-base"
                        :style="{ backgroundImage: `url(${require('@/assets/img/loginInAccountBg.png')})` }"
                  >
                        <div @click="loginMethod = 'QR'" class="hoverTipArea cursor-pointer position-absolute start-0 top-0"></div>
                        <div class="scanTips position-absolute">扫码登录更安全</div>
                  </div>

                  <div class="flex-grow-1 bg-white">
                        <div class="px-5 mx-2 pb-5 accountForm">
                              <div class="border d-flex mobileRow d-flex position-relative">
                                    <div class="border-end flex-center" @click.stop="showCountriesSelector = !showCountriesSelector">
                                          <phone-icon color="#969696" width="17" height="17" />
                                          <span class="text-center">+{{ currentCountry.code }}</span>
                                          <down-arrow-icon color="#ccc" width="14" height="14" />
                                    </div>
                                    <input class="flex-grow-1 h-100" type="text" placeholder="请输手机号" v-model="loginForm.phone" />
                                    <div
                                          v-if="showCountriesSelector"
                                          class="countriesSelector overflow-scroll hideScrollBar position-absolute start-0 w-100 border-bottom border-start border-end"
                                    >
                                          <div
                                                v-for="(item, index) in countriesCodeList"
                                                :key="index"
                                                class="d-flex justify-content-between align-items-center countryItem px-3 py-2"
                                                @click="
                                                      currentCountry = item;
                                                      showCountriesSelector = false;
                                                "
                                          >
                                                <div>{{ item.zh }}</div>
                                                <div>+{{ item.code }}</div>
                                          </div>
                                    </div>
                              </div>
                              <div class="border border-top-0 passwordRow d-flex">
                                    <div class="flex-center">
                                          <lock-icon width="18" height="18" color="#969696" />
                                    </div>
                                    <input class="flex-grow-1" type="password" placeholder="请输入密码" v-model="loginForm.password" />
                              </div>
                              <div @click="handleLogin" class="loginBtn cursor-pointer flex-center text-white mt-5 rounded-4 position-relative">
                                    登录
                              </div>
                        </div>
                        <div class="px-4 pt-5 mt-5 flex-center">
                              <label class="d-flex align-items-center">
                                    <input v-model="agreementsChecked" type="checkbox" />
                                    <span class="text-muted ms-2">同意</span>
                                    <span v-for="item in agreements" :key="item.url" @click="window.open(item.url)" class="colorA cursor-pointer"
                                          >《{{ item.name }}》</span
                                    >
                              </label>
                        </div>
                  </div>
            </div>
      </div>
      <common-toast ref="commonToast" />
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, onUnmounted, reactive, ref, toRefs, watch } from "vue";
import { getQrKey, createLoginQr, checkQrStatus } from "@/api/login";
import { AxiosResponseProps } from "@/utils/request";
import { useStore } from "vuex";
import useDragMove from "@/hooks/useDragMove";
import { getCountriesCodeListApi } from "@/api/common";
import { loginByPassword } from "@/api/login";
import jsMd5 from "js-md5";
import clickDomument from "@/hooks/useClickDocument"
let preCheckTime = 0;
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
                  codeKey: "",
                  agreements: [
                        {
                              name: "服务条款",
                              url: "https://st.music.163.com/official-terms/service",
                        },
                        {
                              name: "隐私政策",
                              url: "https://st.music.163.com/official-terms/privacy",
                        },
                        {
                              name: "儿童隐私政策",
                              url: "https://st.music.163.com/official-terms/children",
                        },
                  ],
                  loginMethod: "QR",
                  agreementsChecked: false,
                  commonToast: ref(null),
                  countriesCodeList: [],
                  loginForm: {
                        phone: "",
                        password: "",
                  },
                  showCountriesSelector: false,
                  currentCountry: { code: 86, zh: "中国" },
            });
            const loginModalRef = ref(null);
            const getQrCode = async () => {
                  state.codeKey = (await getQrKey()).data.unikey;
                  state.qrCode = (await createLoginQr({ key: state.codeKey, qrimg: true, timeStamp: Date.now() })).data.qrimg;
            };
            const getCountriesCodeList = () => {
                  getCountriesCodeListApi().then((res: AxiosResponseProps) => {
                        state.countriesCodeList = res.data.reduce((pre, item) => [...pre, ...item.countryList], []);
                  });
            };
            getCountriesCodeList();
            let timer: any = null;
            const completeLogin = () => {
                  store.dispatch("getUserInfo");
                  state.modalVisible = false;
                  state.qrStatus = 801;
                  clearInterval(timer);
                  timer = null;
            };

            const checkCodeInterval = () => {
                  if (preCheckTime && Date.now() - preCheckTime < 10) return; //不允许连续调用两次
                  preCheckTime = Date.now();
                  timer = setInterval(async () => {
                        state.qrStatus = ((await checkQrStatus({
                              key: state.codeKey,
                              timeStamp: Date.now(),
                        })) as AxiosResponseProps).code;
                  }, 1200);
            };
            const operationByGetQr = () => {
                  watch(
                        () => state.qrStatus,
                        newV => {
                              if (newV === 803) {
                                    completeLogin();
                              }
                        }
                  );
                  state.loginMethod = "QR";
                  useDragMove(loginModalRef);
                  getQrCode();
                  checkCodeInterval();
                  onUnmounted(() => {
                        clearInterval(timer);
                  });
                  watch(
                        () => state.loginMethod,
                        newV => {
                              if (newV == "QR") {
                                    checkCodeInterval();
                              } else {
                                    clearInterval(timer);
                              }
                        }
                  );
            };
            operationByGetQr();
            const handleLogin = () => {
                  if (!state.agreementsChecked) {
                        return state.commonToast.warn("请先勾选同意《服务条款》、《隐私政策》、《儿童隐私政策》");
                  }
                  let mobileReg = /^1\w{10}$/;
                  const loginForm = state.loginForm;
                  if (!mobileReg.test(loginForm.phone)) {
                        return state.commonToast.warn("请输入符合格式的手机号");
                  }
                  if (!loginForm.password) {
                        return state.commonToast.warn("密码不能为空");
                  }
                  let md5_password = jsMd5(loginForm.password);
                  const { phone } = state.loginForm;
                  loginByPassword({ phone, md5_password, countrycode: state.currentCountry.code }).then((res: any) => {
                        //md5加密登录，更安全
                        if (res.code === 200) {
                              state.commonToast.success("登陆成功");
                              completeLogin();
                        } else {
                              state.commonToast.error(res.msg || "登陆失败，请稍后重试");
                        }
                  }).catch(err=>{
                        state.commonToast.error(err.msg || "登陆失败，请稍后重试");
                  })
            };
            clickDomument(()=>{
                  state.showCountriesSelector = false;
            })
            return {
                  ...toRefs(state),
                  loginModalRef,
                  getQrCode,
                  window,
                  handleLogin,
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
      top: 42vh;
      transform: translate(-50%, -50%);
      z-index: 998;
      background-color: #fff;
      > svg:first-child {
            position: absolute;
            top: 9px;
            right: 9px;
            filter: invert(0.5);
            z-index: 3;
      }
      .aniHoverQrBox {
            .qrBoxOuter {
                  .loginTips {
                        width: 220px;
                  }
            }
            &:hover {
                  .scanImg {
                        opacity: 1;
                        transform: translate(-70px, 10px);
                        transition: all ease 0.5s;
                  }
                  .qrBoxOuter {
                        width: 155px;
                        transform: translate(75px, 20px);
                        transition: all ease 0.5s;
                  }
                  .loginTips {
                        width: 155px;
                  }
            }
      }
      .hoverQrBox {
            .scanImg {
                  opacity: 0;
                  transition: all ease 0.5s;
            }
            .qrBoxOuter {
                  width: 220px;
                  height: 220px;
                  transition: all ease 0.5s;
                  .qrBox {
                        .mask {
                              background-color: rgba($color: #000000, $alpha: 0.8);
                              width: 86%;
                              height: 86%;
                        }
                  }
            }
      }
      .accountMethod {
            background-color: #f3f4f6;
            .qrdemo {
                  left: 8px;
                  top: 8px;
                  width: 60px;
                  height: 60px;
            }
            .loginInAccountBg {
                  width: 350px;
                  height: 195px;
                  z-index: 2;
                  .hoverTipArea {
                        width: 60px;
                        height: 60px;
                  }
                  .scanTips {
                        top: 18px;
                        left: 65px;
                        color: #fff;
                  }
            }
            .accountForm {
                  > div:first-child,
                  > div:nth-child(2) {
                        height: 38px;
                  }
                  input {
                        outline: none;
                        border: none;
                        padding-left: 7px;
                  }
                  .mobileRow {
                        > div:first-child {
                              width: 75px;
                              > span:nth-of-type(1) {
                                    display: inline-block;
                                    width: 34px;
                              }
                        }
                        .countriesSelector {
                              background-color: #fff;
                              z-index: 2;
                              top: 38px;
                              height: 200px;
                              .countryItem {
                                    &:hover {
                                          background-color: rgba($color: #ccc, $alpha: 0.4);
                                    }
                              }
                        }
                  }
                  .passwordRow {
                        > div:first-child {
                              width: 28px;
                        }
                  }
                  .loginBtn {
                        height: 38px;
                        &:hover {
                              &::before {
                                    @extend .flex-center;
                                    content: "登录";
                                    position: absolute;
                                    width: 100%;
                                    height: 100%;
                                    background-color: rgba($color: #000000, $alpha: 0.2);
                              }
                        }
                  }
            }
      }
}
.primaryTheme {
      .loginBtn {
            background-color: $primary;
      }
}
.darkTheme {
      .loginBtn {
            background-color: $dark;
      }
}
.freeTheme {
      .loginBtn {
            background-color: $free;
      }
}
</style>
