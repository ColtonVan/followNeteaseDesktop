<template>
    <div class="h-100 w-100 d-flex flex-column">
        <HorizontalNav v-model:navs="navs" />
        <div class="flex-grow-1 overflow-scroll hideScrollBar">
            <div class="container">
                <div class="row d-flex flex-column align-items-center">
                    <div class="col-xxl-10 containerCol">
                        <router-view></router-view>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs } from "vue";
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
        });
        return {
            ...toRefs(state),
        };
    },
});
</script>

<style scoped lang="scss"></style>
