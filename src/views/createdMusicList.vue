<template>
    <div class="pb-5 d-flex">
        <img :src="playListDetail.coverImgUrl" width="190" class="rounded-5 me-5" alt="" />
        <div>
            <div class="d-flex align-items-center">
                <div class="MusicListTag rounded flex-center me-2">歌单</div>
                <div class="fs-3 fw-bold canSelect">{{ playListDetail.name }}</div>
            </div>
            <div class="d-flex align-items-center mt-3">
                <img width="35" class="rounded-pill me-3 cursor-pointer" :src="playListDetail.creator?.avatarUrl" alt="" />
                <a class="me-3 cursor-pointer">{{ playListDetail.creator?.nickname }}</a>
                <span class="text-muted">{{ YYYYMMDD(playListDetail.createTime) }}创建</span>
            </div>
            <div class="mt-4">
                <PlayAllListBtn />
            </div>
            <div class="mt-4">
                <span class="me-3"
                    >歌曲：<span class="text-black-50">{{ playListDetail.trackCount }}</span></span
                >
                <span
                    >播放：<span class="text-black-50">{{ playListDetail.playCount }}</span></span
                >
            </div>
        </div>
    </div>
    <HorizontalNav v-model:navs="navs" class="pb-2" />
    <MusicList v-if="navs.find(item => item.active).key === 0" :columns="columns" :dataSource="playListDetail.tracks" />
    
</template>

<script lang="ts">
import { computed, defineComponent, reactive, toRefs, watch, watchEffect } from "vue";
import { getPlayListDetailApi } from "@/api/playList";
import { AxiosResponseProps } from "@/utils/request";
import { useRoute } from "vue-router";
import { playTime, YYYYMMDD } from "@/hooks/useFilters";
export default defineComponent({
    setup() {
        const route = useRoute();
        const state = reactive({
            columns: [
                {
                    title: "音乐标题",
                    dataIndex: "name",
                },
                {
                    title: "歌手",
                    dataIndex: "ar",
                    render: text => {
                        return text.map(item => item.name).join("、");
                    },
                },
                {
                    title: "专辑",
                    dataIndex: "al",
                    render: text => {
                        return text.name;
                    },
                },
                {
                    title: "时长",
                    dataIndex: "dt",
                    render: text => {
                        return playTime(text);
                    },
                },
            ],
            playListDetail: {},
            navs: [
                {
                    title: "歌曲列表",
                    active: true,
                    key: 0,
                },
                {
                    title: computed(() => `评论(${state.playListDetail.commentCount})`),
                    key: 1,
                },
                {
                    title: "收藏者",
                    key: 2,
                },
            ],
        });
        const getPlayListDetail = id => {
            getPlayListDetailApi({ id, t: Date.now() }).then((res: any) => {
                if (res.code === 200) {
                    state.playListDetail = res.playlist;
                }
            });
        };
        watch(
            () => route.query.id,
            newV => {
                getPlayListDetail(newV);
            },
            {
                immediate: true,
            }
        );
        return {
            ...toRefs(state),
            YYYYMMDD,
        };
    },
});
</script>

<style scoped lang="scss">
.MusicListTag {
    height: 18px;
    width: 32px;
}
.primaryTheme {
    .MusicListTag {
        border: 1px solid $primary;
        color: $primary;
    }
}
.darkTheme {
    .MusicListTag {
        border: 1px solid $dark;
        color: $dark;
    }
}
.freeTheme {
    .MusicListTag {
        border: 1px solid $free;
        color: $free;
    }
}
</style>
