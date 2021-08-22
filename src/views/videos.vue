<template>
    <div class="videos w-100 h-100 d-flex flex-column px-5 py-4">
        <HorizontalNav v-model:navs="navs" />
        <div class="d-flex justify-content-between align-align-items-center w-100 position-relative">
            <div
                @click.stop="groupVisible = !groupVisible"
                class="rounded-pill border px-3 py-2 me-5 cursor-pointer my-2 flex-shrink-0 currentGroup text-center"
            >
                <span class="text-muted">{{ groupList.find(item => item.id === groupId).name }}</span>
                <ArrowRightIcon width="12" height="12" class="filter-invert-1 opacity-25 translate-y--10 ms-1" />
            </div>
            <VideoGroupPanel @confirm="confirmGroup" @click.stop v-model:groupId="groupId" v-model:visible="groupVisible" />
            <div class="videoCats d-flex align-items-center justify-content-end text-ellipsis">
                <span
                    @click="groupId = item.id"
                    :class="{ selected: item.id === groupId }"
                    v-for="item in categoryList"
                    :key="item.id"
                    class="videoCat rounded-pill px-3 py-1 hover-opacity text-secondary"
                    >{{ item.name }}</span
                >
            </div>
        </div>
        <div class="flex-grow-1">
            <div class="container h-100">
                <div class="h-100 row d-flex flex-column align-items-center">
                    <div class="h-100 col-xxl-10 containerCol">
                        <VideoList style="max-height: calc(100vh - 75px - 60px - 38px - 40px - 3.3rem);" class="pt-5" v-model:id="groupId" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from "vue";
import { getCategoryListApi, getGroupListApi } from "@/api/video";
import { AxiosResponseProps } from "@/utils/request";
import useClickDocument from "@/hooks/useClickDocument";
export default defineComponent({
    setup() {
        const state = reactive({
            navs: [
                {
                    title: "视频",
                    active: true,
                },
                {
                    title: "MV",
                },
            ],
            categoryList: [],
            groupId: 0,
            groupVisible: false,
            groupList: [{ name: "全部视频", id: 0 }],
        });
        state.navs = state.navs.map((item, index) => ({ ...item, key: index }));
        const getCategoryListAndGroupList = () => {
            getCategoryListApi().then((res: AxiosResponseProps) => {
                if (res.code === 200) {
                    state.categoryList = res.data;
                }
            });
            getGroupListApi().then((res: AxiosResponseProps) => {
                if (res.code === 200) {
                    state.groupList = [{ name: "全部视频", id: 0 }].concat(res.data);
                }
            });
        };
        getCategoryListAndGroupList();
        useClickDocument(() => {
            state.groupVisible = false;
        });
        const confirmGroup = item => {
            state.groupId = item.id;
        };
        return {
            ...toRefs(state),
            confirmGroup,
        };
    },
});
</script>

<style scoped lang="scss">
.videos {
    .currentGroup {
        min-width: 90px;
        max-width: 120px;
    }
    .videoCats {
        width: 80%;
        .videoCat + .videoCat {
            margin-left: 7px;
        }
    }
}
.primaryTheme {
    .videoCat {
        &:hover {
            color: $primary !important;
        }
    }
    .selected {
        color: $primary !important;
        background-color: rgba($color: $primary, $alpha: 0.1);
    }
}
.darkTheme {
    .videoCat {
        &:hover {
            color: $dark !important;
        }
    }
    .selected {
        color: $dark !important;
        background-color: rgba($color: $dark, $alpha: 0.1);
    }
}
.freeTheme {
    .videoCat {
        &:hover {
            color: $free !important;
        }
    }
    .selected {
        color: $free !important;
        background-color: rgba($color: $free, $alpha: 0.1);
    }
}
</style>
