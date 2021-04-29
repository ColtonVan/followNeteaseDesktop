<template>
    <div class="videoList w-100 d-flex flex-wrap justify-content-between">
        <div
            @mouseenter="item.showPre = true"
            @mouseleave="item.showPre = false"
            class="videoItem overflow-hidden rounded-5 mb-4 position-relative cursor-pointer"
            v-for="(item, index) in groupList"
            :key="index"
        >
            <img v-if="item.showPre && item.data.previewUrl" class="position-absolute top-0 start-0" :src="item.data.previewUrl" alt="" />
            <img
                v-show="!(item.showPre && item.data.previewUrl)"
                class="position-absolute top-0 start-0"
                :src="item.data.coverUrl"
                alt=""
            />
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, toRefs } from "vue";
import { getGroupVideoApi, getAllGroupVideoApi } from "@/api/video";
import { AxiosResponseProps } from "@/utils/request";
export default defineComponent({
    props: {
        id: {
            type: Number,
            default: 0,
        },
    },
    setup(props, { emit }) {
        const state = reactive({
            groupId: computed({
                get: () => props.id,
                set: newV => emit("update:id", newV),
            }),
            groupList: [],
        });
        const getGroupVideo = () => {
            let apiFun = getGroupVideoApi;
            let parmas: any = { id: state.groupId };
            if (state.groupId === 0) {
                apiFun = getAllGroupVideoApi;
                parmas = {};
            }
            apiFun(parmas).then((res: any) => {
                if (res.code === 200) {
                    state.groupList = res.datas;
                }
            });
        };
        getGroupVideo();
        return {
            ...toRefs(state),
        };
    },
});
</script>

<style scoped lang="scss">
.videoList {
    .videoItem {
        padding-left: 22%;
        padding-top: 12%;
        width: 0;
        height: 0;
        > img {
            width: 100%;
            height: 100%;
        }
        > img:nth-child(2) {
            // display: none;
        }
        &:hover {
            > img:nth-child(2) {
                // display: inline-block;
            }
        }
    }
}
</style>
