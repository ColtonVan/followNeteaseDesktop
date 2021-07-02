<template>
    <div class="mb-5">
        <div class="row songRow headRow w-100 ps-5">
            <div
                v-for="(item, index) in columns"
                :key="index"
                :class="`col-${item.span !== undefined ? item.span : 3}`"
                class="p-3 text-black-50 fs-5 songCol"
            >
                {{ item.title }}
            </div>
        </div>
        <div v-if="!dataSource.length" class="w-100 fs-5 text-muted flex-center py-5 border-bottom">
            <!-- <div>暂无数据，快去收藏音乐吧~</div> -->
            <div>{{ emptyText }}</div>
        </div>
        <div
            v-else
            class="row ps-5 songRow w-100"
            :style="{ opacity: data.haveUrl === false ? 0.4 : 1 }"
            v-for="(data, dataIndex) in dataSource"
            :key="dataIndex"
        >
            <div
                v-for="(column, columnIndex) in columns"
                :key="columnIndex"
                @click="clickMusicItem(data)"
                :class="`col-${column.span !== undefined ? column.span : 3}`"
                class="p-3 songCol"
                :title="column.render ? column.render(data[column.dataIndex], data) : data[column.dataIndex]"
            >
                <slot v-if="column.slots && $slots[column.slots.customRender]" :name="column.slots.customRender" v-bind="data" />
                <span v-else>
                    <span v-if="column.render">{{ column.render(data[column.dataIndex], data) }}</span>
                    <span v-else>{{ data[column.dataIndex] }}</span>
                </span>
            </div>
        </div>
    </div>
    <CommonModal v-model:visible="commonModalVisible" @confirm="commonModalVisible = false">
        <div class="text-center">由于版权保护，您所在的地区暂时无法使用。</div>
    </CommonModal>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, reactive, toRefs } from "vue";
import { useStore } from "vuex";
export interface ColumnProps {
    title: string;
    dataIndex?: string;
    render?: (text: any, rowData: object) => string | number;
    span?: number;
    slots?: { customRender: string };
}
export default defineComponent({
    props: {
        columns: {
            type: Array as PropType<ColumnProps[]>,
            default: [],
        },
        dataSource: {
            type: Array as PropType<Partial<{ id: number; name?: string }>[]>,
            default: [],
        },
        emptyText: {
            type: String,
            default: "暂无数据，请浏览其他歌单吧~",
        },
    },
    setup(props) {
        const store = useStore();
        const state = reactive({
            commonModalVisible: false,
            currentPlayList: computed(() => store.state.currentPlayList),
        });
        let clickedColumns = [];
        const clickMusicItem = rowData => {
            if (
                clickedColumns.length &&
                Date.now() - clickedColumns[clickedColumns.length - 1].clickTime < 400 &&
                rowData.id === clickedColumns[clickedColumns.length - 1].id
            ) {
                if (rowData.haveUrl !== false) {
                    store.commit("changeCurrentMusicDetail", rowData);
                    store.commit("changeCurrentPlayList", JSON.parse(JSON.stringify(props.dataSource)));
                    store.dispatch("getCurrentMusicUrlInfo", { id: rowData.id });
                } else {
                    state.commonModalVisible = true;
                }
                return (clickedColumns = []);
            }
            rowData.clickTime = Date.now();
            clickedColumns.push(rowData);
        };
        return {
            ...toRefs(state),
            clickMusicItem,
        };
    },
});
</script>

<style scoped lang="scss">
.headRow {
    .songCol {
        /* text-align: center; */
    }
}
.songRow {
    .songCol {
        box-sizing: border-box;
        @extend .text-ellipsis;
        .hover-icon {
            @extend .cursor-pointer;
            opacity: 0.5;
            &:hover {
                opacity: 1;
            }
        }
    }
    &:hover {
        background-color: rgb(235, 235, 235) !important;
    }
}
.songRow:nth-child(odd) {
    background-color: #f1f1f1;
}
.songRow:nth-child(even) {
    background-color: #fff;
}
.songRow:nth-child(1) {
    background-color: #fff;
}
</style>
