<template>
    <div class="px-5 py-4 h-100 w-100 d-flex flex-column">
        <div class="navBox d-flex align-items-end">
            <span
                class="navItem cursor-pointer d-flex flex-column align-items-center"
                :class="{
                    'fw-bold': nav.active,
                    'fs-4': nav.active,
                    'fs-5': !nav.active,
                    activeNav: nav.active,
                }"
                @click="clickNavItem(nav, navIndex)"
                v-for="(nav, navIndex) in navs"
                :key="navIndex"
            >
                <div class="navTitle pb-1 d-flex align-items-start">{{ nav.title }}</div>
                <div class="activedNavBorder" v-if="nav.active"></div>
            </span>
        </div>

        <div class="flex-grow-1 overflow-scroll hideScrollBar">
            <div @mouseenter="stopSwiper" @mouseleave="continueSwiper" class="bannerList position-relative mt-2">
                <div
                    class="changeBannerIcon cursor-pointer position-absolute top-50 translate-middle-y rounded-circle d-flex justify-content-center align-items-center"
                    style="z-index: 4"
                    @click="changeBanner('pre')"
                >
                    <ArrowLeftIcon width="12" height="12" />
                </div>
                <div
                    class="changeBannerIcon cursor-pointer position-absolute top-50 translate-middle-y rounded-circle d-flex justify-content-center align-items-center"
                    style="z-index: 4"
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
                    :class="{ 'ms-3': dotIndex !== 0, activeSwiperDot: currentActiveIndex === dotIndex }"
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

            <div class="recommendList px-1 py-2 d-flex flex-wrap justify-content-between">
                <div class="recommendItem mb-3 rounded-2" v-for="(rec,recIndex) in 10"></div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { computed, defineComponent, reactive, toRefs } from "vue";
import { getBanners } from "@/api/discover";
export default defineComponent({
    setup() {
        const state = reactive({
            banners: [],
            navs: [
                {
                    title: "个性推荐",
                    active: true,
                },
                {
                    title: "歌单",
                },
                {
                    title: "主播电台",
                },
                {
                    title: "排行榜",
                },
                {
                    title: "歌手",
                },
                {
                    title: "最新音乐",
                },
            ],
            currentActiveIndex: 0,
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
        //开始轮播
        let swiperTimer = null;
        const startSwiper = () => {
            getBanners_com().then(() => {
                swiperTimer = setInterval(() => {
                    if (state.currentActiveIndex < state.banners.length - 1) {
                        state.currentActiveIndex++;
                    } else {
                        state.currentActiveIndex = 0;
                    }
                }, 5000);
            });
        };
        startSwiper();
        //点击导航标题
        const clickNavItem = (nav, navIndex) => {
            state.navs = state.navs.map((item, index) => {
                if (index == navIndex) {
                    return {
                        ...item,
                        active: true,
                    };
                } else {
                    return {
                        ...item,
                        active: false,
                    };
                }
            });
        };
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
                state.currentActiveIndex =
                    state.currentActiveIndex === 0 ? state.banners.length - 1 : state.currentActiveIndex - 1;
            } else if (tag === "next") {
                state.currentActiveIndex =
                    state.currentActiveIndex === state.banners.length - 1 ? 0 : state.currentActiveIndex + 1;
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
            clickNavItem,
            getLastBannerIndex,
            getSecondBanerIndex,
            changeBanner,
            stopSwiper,
            continueSwiper,
            mouseenterSwiperDot,
        };
    },
});
</script>

<style scoped lang="scss">
.navBox {
    .navItem {
        min-width: 60px;
        height: 38px;
        .navTitle {
            transition: font-size ease 0.1s;
        }
        .activedNavBorder {
            height: 3px;
            width: 80%;
        }
    }
    .navItem ~ .navItem {
        margin-left: 16px;
    }
}
.bannerList {
    width: 100%;
    $bannerListHeight: calc(400 * 0.07vw * 0.5);
    height: $bannerListHeight;
    .bannerItem {
        $width: calc(1080 * 0.07vw * 0.3);
        $height: calc(400 * 0.07vw * 0.3);
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
        $width: calc(1080 * 0.07vw * 0.5);
        $height: calc(400 * 0.07vw * 0.5);
        left: calc(50% - #{$width}/ 2);
        top: calc(50% - #{$height} / 2);
        width: $width;
        height: $height;
        transition: all ease 0.6s;
        z-index: 3;
    }
    .secondBanner {
        $width: calc(1080 * 0.07vw * 0.4);
        $height: calc(400 * 0.07vw * 0.4);
        left: calc(100% - #{$width});
        top: calc(#{$bannerListHeight}/ 2 - #{$height}/ 2);
        width: $width;
        height: $height;
        transition: all ease 0.6s;
        z-index: 2;
    }
    .lastBanner {
        $height: calc(400 * 0.07vw * 0.4);
        left: 0;
        top: calc(#{$bannerListHeight}/ 2 - #{$height}/ 2);
        width: calc(1080 * 0.07vw * 0.4);
        height: $height;
        transition: all ease 0.6s;
        z-index: 2;
    }
    .changeBannerIcon {
        background-color: rgba($color: #000000, $alpha: 0.4);
        width: 30px;
        height: 30px;
        display: none !important;
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
.recommendList{
	.recommendItem{
		width: 14vw;
		height: 14vw;
		background-color: #ccc;
	}
}
.swiperDot {
    padding: 3.2px;
    background-color: rgb(211, 211, 211);
}
.primaryTheme {
    .activedNavBorder,
    .activeSwiperDot {
        background-color: $primary;
    }
}
.darkTheme {
    .activedNavBorder,
    .activeSwiperDot {
        background-color: $dark;
    }
}
.freeTheme {
    .activedNavBorder,
    .activeSwiperDot {
        background-color: $free;
    }
}
</style>
