<template>
    <div @mouseenter="stopSwiper" @mouseleave="continueSwiper" class="bannerList position-relative mt-2 rounded-7 overflow-hidden">
        <div
            class="changeBannerIcon cursor-pointer position-absolute top-50 translate-middle-y rounded-circle d-flex justify-content-center align-items-center"
            @click="changeBanner('pre')"
        >
            <ArrowLeftIcon width="12" height="12" />
        </div>
        <div
            class="changeBannerIcon cursor-pointer position-absolute top-50 translate-middle-y rounded-circle d-flex justify-content-center align-items-center"
            @click="changeBanner('next')"
        >
            <ArrowRightIcon width="12" height="12" />
        </div>

        <div
            class="bannerItem position-absolute rounded rounded-7"
            :class="{
                firstBanner: bannerIndex === currentActiveIndex,
                secondBanner: bannerIndex === getSecondBanerIndex,
                lastBanner: bannerIndex === getLastBannerIndex,
                'cursor-pointer': currentActiveIndex === bannerIndex,
            }"
            :style="{
                backgroundImage: `url(${banner.imageUrl})`,
            }"
            v-for="(banner, bannerIndex) in banners"
            :key="bannerIndex"
            @click="
                bannerIndex === getSecondBanerIndex
                    ? (currentActiveIndex = getSecondBanerIndex)
                    : bannerIndex === getLastBannerIndex
                    ? (currentActiveIndex = getLastBannerIndex)
                    : false
            "
        ></div>
    </div>
    <div class="w-100 d-flex justify-content-center mt-3" @mouseleave="continueSwiper">
        <span
            v-for="(dot, dotIndex) in banners"
            :key="dotIndex"
            class="swiperDot rounded-circle"
            :class="{
                'ms-3': dotIndex !== 0,
                activeSwiperDot: currentActiveIndex === dotIndex,
            }"
            @mouseenter="
                mouseenterSwiperDot(dotIndex);
                stopSwiper();
            "
        ></span>
    </div>
    <div class="d-flex align-items-center fs-4 fw-bold mt-2 cursor-pointer">
        <span class="me-1">推荐歌单</span>
        <ThinArrowRightIcon width="18" height="18" style="filter: blur()" />
    </div>

    <div class="recommendList px-1 py-2 d-flex justify-content-between flex-wrap">
        <div @click="$router.push('/container/dailyRec')" class="recommentItem mb-4 position-relative dailyBox">
            <div class="recommendItemImg start-0 top-0 position-absolute rounded-4 cursor-pointer overflow-hidden">
                <div class="position-absolute fs-5 w-100 dailyTips text-white p-2">
                    根据您的音乐口味生成每日更新
                </div>
                <div class="position-absolute translate-middle w-50 h-50 top-50 start-50">
                    <div class="nowDay position-absolute start-50 translate-middle text-white">
                        {{ String(nowDay).padStart(2, "0") }}
                    </div>
                    <CalendarIcon width="100%" height="100%" />
                </div>
                <div class="position-absolute rounded-circle hover-play justify-content-center align-items-center">
                    <div class="trigonalPlay"></div>
                </div>
            </div>
            <div class="recTitle position-absolute start-0 bottom-0 w-100 fs-5 text-muted">每日歌曲推荐</div>
        </div>
        <div
            class="recommentItem mb-4 position-relative"
            @click="$router.push({ path: '/container/createdMusicList', query: { id: rec.id } })"
            v-for="(rec, recIndex) in personalizedList"
            :key="recIndex"
        >
            <div
                class="recommendItemImg start-0 top-0 position-absolute rounded-4 cursor-pointer overflow-hidden position-relative"
                :style="{ backgroundImage: `url('${rec.picUrl}')` }"
            >
                <div class="playCountLine position-absolute d-flex align-items-center">
                    <HollowPlayIcon width="12" height="12" />
                    <span class="text-white ms-1 flex-shrink-0">{{ playCount(rec.playCount) }}</span>
                </div>
                <div class="position-absolute rounded-circle hover-play justify-content-center align-items-center">
                    <div class="trigonalPlay"></div>
                </div>
            </div>
            <div class="recTitle position-absolute start-0 bottom-0 w-100 fs-5 text-muted">{{ rec.name }}</div>
        </div>
    </div>
</template>
<script lang="ts">
import { computed, defineComponent, reactive, toRefs } from "vue";
import { getBanners, getPersonalizedApi } from "@/api/discover";
import { playCount } from "@/hooks/useFilters";
export default defineComponent({
    setup() {
        const state = reactive({
            banners: [],
            personalizedList: [],
            currentActiveIndex: 0,
            nowDay: new Date().getDate(),
        });
        //获取轮播
        const getBanners_com = () => {
            return new Promise((resolve, reject) => {
                getBanners().then((res: any) => {
                    if (res.code === 200) {
                        state.banners = res.banners;
                        resolve(res.banners);
                    } else {
                        reject();
                    }
                });
            });
        };
        getBanners_com();
        //开始轮播
        let swiperTimer = null;
        const startSwiper = () => {
            swiperTimer = setInterval(() => {
                if (state.currentActiveIndex < state.banners.length - 1) {
                    state.currentActiveIndex++;
                } else {
                    state.currentActiveIndex = 0;
                }
            }, 5000);
        };
        startSwiper();
        const getPersonalized = () => {
            getPersonalizedApi({ limit: 9 }).then((res: any) => {
                if (res.code === 200) {
                    state.personalizedList = res.result.slice(0, 9);
                }
            });
        };
        getPersonalized();
        const getLastBannerIndex = computed(() => {
            if (state.currentActiveIndex === 0) {
                return state.banners.length - 1;
            } else {
                return state.currentActiveIndex - 1;
            }
        });
        const getSecondBanerIndex = computed(() => {
            if (state.currentActiveIndex === state.banners.length - 1) {
                return 0;
            } else {
                return state.currentActiveIndex + 1;
            }
        });
        const changeBanner = tag => {
            if (tag === "pre") {
                state.currentActiveIndex = state.currentActiveIndex === 0 ? state.banners.length - 1 : state.currentActiveIndex - 1;
            } else if (tag === "next") {
                state.currentActiveIndex = state.currentActiveIndex === state.banners.length - 1 ? 0 : state.currentActiveIndex + 1;
            }
        };
        const stopSwiper = () => {
            clearInterval(swiperTimer);
            swiperTimer = null;
        };
        const continueSwiper = () => {
            if (swiperTimer) {
                clearInterval(swiperTimer);
                swiperTimer = null;
            }
            startSwiper();
        };
        const mouseenterSwiperDot = dotIndex => {
            state.currentActiveIndex = dotIndex;
        };
        return {
            ...toRefs(state),
            getLastBannerIndex,
            getSecondBanerIndex,
            changeBanner,
            stopSwiper,
            continueSwiper,
            mouseenterSwiperDot,
            playCount,
        };
    },
});
</script>

<style lang="scss" scoped>
.bannerList {
    width: 100%;
    $bannerListHeight: calc(400 * 1px * 0.5);
    height: $bannerListHeight;
    .bannerItem {
        $width: calc(1080 * 1px * 0.3);
        $height: calc(400 * 1px * 0.3);
        left: calc(50% - #{$width}/ 2);
        top: calc(50% - #{$height} / 2);
        width: $width;
        height: $height;
        background-repeat: no-repeat;
        background-size: cover;
        transition: all ease 0.6s;
        z-index: 1;
    }
    .firstBanner {
        $width: calc(1080 * 1px * 0.5);
        $height: calc(400 * 1px * 0.5);
        left: calc(50% - #{$width}/ 2);
        top: calc(50% - #{$height} / 2);
        width: $width;
        height: $height;
        transition: all ease 0.6s;
        z-index: 3;
    }
    .secondBanner {
        $width: calc(1080 * 1px * 0.4);
        $height: calc(400 * 1px * 0.4);
        left: calc(100% - #{$width});
        top: calc(#{$bannerListHeight}/ 2 - #{$height}/ 2);
        width: $width;
        height: $height;
        transition: all ease 0.6s;
        z-index: 2;
    }
    .lastBanner {
        $height: calc(400 * 1px * 0.4);
        left: 0;
        top: calc(#{$bannerListHeight}/ 2 - #{$height}/ 2);
        width: calc(1080 * 1px * 0.4);
        height: $height;
        transition: all ease 0.6s;
        z-index: 2;
    }
    .changeBannerIcon {
        background-color: rgba($color: #000000, $alpha: 0.4);
        width: 30px;
        height: 30px;
        display: none !important;
        z-index: 4;
    }
    .changeBannerIcon:first-of-type {
        left: 16px;
    }
    .changeBannerIcon:nth-of-type(2) {
        right: 16px;
    }
    &:hover {
        .changeBannerIcon {
            display: flex !important;
        }
    }
}
.recommendList {
    .recommentItem {
        padding-left: 18%;
        padding-top: calc(18% + 4.5rem);
        // margin-right: 2%;
        .recommendItemImg {
            padding-left: 100%;
            padding-top: 100%;
            background-color: #ccc;
            background-size: cover;
            background-repeat: no-repeat;
            * {
                z-index: 3;
            }
            .playCountLine {
                top: 3px;
                right: 8px;
            }
            .hover-play {
                display: none;
                width: 28px;
                height: 28px;
                right: 6px;
                bottom: 6px;
                opacity: 0;
                background-color: rgba($color: #fff, $alpha: 0.85);
                .trigonalPlay {
                    border-top: calc(8px * 0.8) solid transparent;
                    border-right: calc(8px * 0.8) solid transparent;
                    border-bottom: calc(8px * 0.8) solid transparent;
                    transform: translateX(30%);
                }
            }
            &:after {
                left: 0;
                top: 0;
                content: "";
                width: 100%;
                height: 100%;
                position: absolute;
                background-image: radial-gradient(transparent, rgba($color: #000000, $alpha: 0.1));
                z-index: 2;
            }
            &:hover {
                .hover-play {
                    display: flex;
                    animation: opacityShow 0.6s;
                    animation-fill-mode: forwards;
                }
                @keyframes opacityShow {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }
            }
        }
        .recTitle {
            // min-height: 50px;
            // height: 5%;
            @include ellipsis(2);
            min-height: 4rem;
            bottom: 0;
        }
    }
    .dailyBox {
        position: relative;
        z-index: 1;
        overflow: hidden;
        > * {
            z-index: 2;
        }
        .recommendItemImg {
            background-color: transparent;
            .dailyTips {
                left: 0;
                top: -58px;
                height: 4.5rem;
                box-sizing: border-box;
                background-color: rgba($color: #000000, $alpha: 0.4);
                transition: top ease 0.4s;
                @include ellipsis(2);
            }
            &:hover {
                .dailyTips {
                    top: 0;
                    transition: top ease 0.4s;
                }
            }
            &::before {
                top: 0;
                left: 0;
                z-index: -2;
                content: "";
                position: absolute;
                width: 100%;
                height: 100%;
                background-image: url(https://p2.music.126.net/uTCh9G5LvjQ1z32dBE5_8A==/109951165872244163.jpg);
                background-size: cover;
                filter: blur(10px);
            }
            &::after {
                top: 0;
                left: 0;
                z-index: -1;
                content: "";
                position: absolute;
                width: 100%;
                height: 100%;
                background-image: radial-gradient(transparent, #000);
                opacity: 0.65;
            }
        }
        .nowDay {
            top: 60%;
            font-size: 2.8vw;
        }
    }
}
.swiperDot {
    padding: 3.2px;
    background-color: rgb(211, 211, 211);
}
.primaryTheme {
    .activeSwiperDot {
        background-color: $primary;
    }
    .trigonalPlay {
        border-left: calc(12px * 0.8) solid $primary;
    }
}
.darkTheme {
    .activeSwiperDot {
        background-color: $dark;
    }
    .trigonalPlay {
        border-left: calc(12px * 0.8) solid $dark;
    }
}
.freeTheme {
    .activeSwiperDot {
        background-color: $free;
    }
    .trigonalPlay {
        border-left: calc(12px * 0.8) solid $free;
    }
}
</style>
