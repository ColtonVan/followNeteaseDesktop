<template>
    <div class="searchHistoryPanel rounded-6 shadow position-absolute start-50 translate-middle-x bg-white">
        <div class="pt-3 px-4" v-if="historyList.length">
            <div class="title d-flex align-items-center justify-content-between">
                <div class="d-flex align-items-center">
                    <span class="fs-6 text-muted">搜索历史</span>
                    <DeleteIcon @click="deleteHistory" class="hover-opacity opacity-50 ms-3 deleteIcon" width="15" height="15" />
                </div>
                <div class="cursor-pointer" @click="spreadList = !spreadList">
                    {{ spreadList ? "收起" : "查看全部" }}
                </div>
            </div>
            <div class="historyList d-flex align-items-start flex-wrap mt-2" :class="{ spreadList }">
                <div
                    v-for="(item, index) in historyList"
                    :key="index"
                    class="rounded-pill px-3 py-1 mb-3 border text-muted historyItem cursor-pointer flex-center position-relative"
                >
                    <span>{{ item.title }}</span>
                    <CloseIcon
                        @click="removeHistoryItem(item, index)"
                        class="ms-2 closeIcon opacity-75 position-absolute top-50 translate-middle-y"
                        width="10"
                        height="10"
                    />
                </div>
            </div>
        </div>
        <div class="fs-6 text-muted mt-3 mb-4 ps-4">热搜榜</div>
        <LoadingComponent v-if="isLoading" />
        <div
            v-else
            :class="{ frontHotItem: [0, 1, 2].includes(index) }"
            class="hotItem py-2 d-flex align-items-center cursor-pointer"
            v-for="(item, index) in hotSearchList"
            @click="toSearchResultDetail"
            :key="index"
        >
            <div class="flex-center fs-5 fw-bold">{{ index + 1 }}</div>
            <div class="d-flex flex-column">
                <div class="d-flex align-items-center">
                    <span class="me-2 searchWord">{{ item.searchWord }}</span>
                    <img v-if="item.iconUrl" class="hotIcon" :src="item.iconUrl" alt="" />
                    <span class="text-black-50 ms-2">{{ item.score }}</span>
                </div>
                <div class="text-muted">
                    {{ item.content }}
                </div>
            </div>
        </div>
    </div>

    <CommonModal v-model:visible="deleteHistoryModalVisible" title="确认删除历史记录？" @confirm="confirmDeleteHistory" />
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, watch } from "vue";
import { getSearchHotDetail as getSearchHotDetailApi } from "@/api/search";
import { AxiosResponseProps } from "@/utils/request";
import { useRouter } from "vue-router";
const searchHistoryKey = "searchHistory";
export default defineComponent({
    props: {
        modelValue: {
            type: Boolean,
            required: true,
        },
        keyword: {
            type: String,
            required: true,
        },
    },
    setup(props) {
        const router = useRouter();
        const state = reactive({
            historyList: [],
            spreadList: false,
            hotSearchList: [],
            deleteHistoryModalVisible: false,
            isLoading: false,
        });
        const getHistory = () => {
            state.historyList = localStorage[searchHistoryKey] ? JSON.parse(localStorage[searchHistoryKey]) : [];
        };
        watch(
            () => props.modelValue,
            newV => {
                getHistory();
            },
            {
                immediate: true,
            }
        );
        const removeHistoryItem = (item, index) => {
            state.historyList.splice(index, 1);
            localStorage[searchHistoryKey] = JSON.stringify(state.historyList);
        };
        const getSearchHotDetail = () => {
            state.isLoading = true;
            getSearchHotDetailApi().then((res: AxiosResponseProps) => {
                state.isLoading = false;
                if (res.code === 200) {
                    state.hotSearchList = res.data;
                }
            });
        };
        getSearchHotDetail();
        const deleteHistory = () => {
            state.deleteHistoryModalVisible = true;
        };
        const confirmDeleteHistory = () => {
            state.deleteHistoryModalVisible = false;
            localStorage[searchHistoryKey] = "";
            getHistory();
        };
        const toSearchResultDetail = () => {
            router.push({ path: "/searchResultDetail", query: { keyword: props.keyword as string } });
        };
        return {
            ...toRefs(state),
            removeHistoryItem,
            deleteHistory,
            confirmDeleteHistory,
            toSearchResultDetail,
        };
    },
});
</script>

<style scoped lang="scss">
.searchHistoryPanel {
    top: 32px;
    width: 350px;
    height: 450px;
    overflow-y: scroll;
    z-index: 10;
    @extend .hideScrollBar;
    animation: startAni 0.3s;
    @keyframes startAni {
        from {
            height: 420px;
        }
        to {
            height: 450px;
        }
    }
    .title {
        height: 25px;
        .deleteIcon {
            transform: translateY(-2%);
        }
    }
    .historyList {
        min-height: 70px;
        max-height: 70px;
        overflow: hidden;
        transition: max-height 0.4s;
    }
    .spreadList {
        max-height: 160px;
        transition: max-height 0.4s;
    }
    .historyItem {
        .closeIcon {
            display: none;
            filter: invert(1);
            right: 2px;
        }
        &:hover {
            background-color: #f1f1f1;
            .closeIcon {
                display: inline-block !important;
            }
        }
    }
    .historyItem + .historyItem {
        margin-left: 10px;
    }
    .hotItem {
        > div:first-child {
            width: 42px;
            height: 42px;
        }
        .hotIcon {
            height: 12px;
        }
        &:hover {
            background-color: rgba($color: #000000, $alpha: 0.07);
        }
    }
    .frontHotItem {
        > div:first-child {
            color: $primary;
        }
        .searchWord {
            font-weight: bold;
        }
    }
}
</style>
