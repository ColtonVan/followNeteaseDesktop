<template>
  <div class="p-5 h-100 w-100">
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
        <div class="navTitle pb-1">{{ nav.title }}</div>
        <div class="activedNavBorder" v-if="nav.active"></div>
      </span>
    </div>

    <div class="bannerList position-relative">
      <div
        class="changeBannerIcon position-absolute top-50 translate-middle-y rounded-circle d-flex justify-content-center align-items-center"
        style="z-index: 4"
      >
        <ArrowLeftIcon width="12" height="12" />
      </div>
      <div
        class="changeBannerIcon position-absolute top-50 translate-middle-y rounded-circle d-flex justify-content-center align-items-center"
        style="z-index: 4"
      >
        <ArrowRightIcon width="12" height="12" />
      </div>

      <div
        class="bannerItem position-absolute rounded rounded-7"
        :class="{
          firstBanner: bannerIndex === currentActiveIndex,
          secondBanner: bannerIndex === getSecondBanerIndex,
          lastBanner: bannerIndex === getLastBannerIndex,
        }"
        :style="{
          backgroundImage: `url(${banner.imageUrl})`,
        }"
        v-for="(banner, bannerIndex) in banners"
        :key="bannerIndex"
      ></div>
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
    const startSwiper = () => {
      getBanners_com().then(() => {
        setInterval(() => {
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
    return {
      ...toRefs(state),
      clickNavItem,
      getLastBannerIndex,
      getSecondBanerIndex,
    };
  },
});
</script>

<style scoped lang="scss">
.navBox {
  .navItem {
    min-width: 60px;
    height: 50px;
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
  }
  .changeBannerIcon:first-of-type {
    left: 10px;
  }
  .changeBannerIcon:nth-of-type(2) {
    right: 0px;
  }
}
.primaryTheme {
  .activedNavBorder {
    background-color: $primary;
  }
}
.darkTheme {
  .activedNavBorder {
    background-color: $dark;
  }
}
.freeTheme {
  .activedNavBorder {
    background-color: $free;
  }
}
</style>
