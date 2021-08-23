<template>
    <div class="h-100 w-100 d-flex flex-column px-5 py-4">
        <HorizontalNav v-model:navs="navs" />
        <div id="discoverMusicList" class="flex-grow-1 overflow-scroll hideScrollBar position-relative">
            <div class="container">
                <div class="row d-flex flex-column align-items-center">
                    <div class="col-xxl-10 containerCol">
                        <router-view></router-view>
                    </div>
                </div>
            </div>
            <CustomScrollBar v-if="!isLoading" listId="discoverMusicList" />
        </div>
    </div>
</template>
<script lang="ts">
import store from "@/store";
import { computed, defineComponent, reactive, toRefs } from "vue";
export default defineComponent({
    setup() {
        const state = reactive({
            navs: [
                {
                    title: "个性推荐",
                    active: true,
                    path: "/container/discoverMusic/personalizedRec",
                },
                {
                    title: "歌单",
                    path: "",
                },
                {
                    title: "主播电台",
                    path: "",
                },
                {
                    title: "排行榜",
                    path: "",
                },
                {
                    title: "歌手",
                    path: "",
                },
                {
                    title: "最新音乐",
                    path: "",
                },
            ],
            isLoading: computed(() => store.state.isLoading),
        });
        return {
            ...toRefs(state),
        };
    },
});
</script>

<style scoped lang="scss"></style>
