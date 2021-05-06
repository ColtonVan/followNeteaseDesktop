<template>
    <div class="mb-5">
        <div class="row songRow headRow w-100">
            <div v-for="(item, index) in columns" :key="index" class="col-3 p-3 text-black-50 fs-5 songCol">{{ item.title }}</div>
        </div>
        <div v-if="!dataSource.length" class="w-100 fs-5 text-muted flex-center py-5 border-bottom">
            <div>暂无数据，快去收藏音乐吧~</div>
        </div>
        <div v-else class="row ps-5 songRow w-100" v-for="(data, dataIndex) in dataSource" :key="dataIndex">
            <div
                v-for="(column, columnIndex) in columns"
                :key="columnIndex"
                class="col-3 p-3 songCol"
                :class="`col-${column.span !== undefined ? column.span : 3}`"
            >
                <span v-if="column.render">{{ column.render(data[column.dataIndex], data) }}</span>
                <span v-else>{{ data[column.dataIndex] }}</span>
                <!-- <pre>{{data}}</pre>
                <pre>{{column.dataIndex}}</pre> -->
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
export default defineComponent({
    props: {
        columns: {
            type: Array as PropType<{ title: string; dataIndex?: string; span?: number; render?: (text: any, recF: any) => any }[]>,
            default: [],
        },
        dataSource: {
            type: Array as PropType<{}[]>,
            default: [],
        },
    },
    setup() {
        
    },
});
</script>

<style scoped lang="scss">
.headRow {
    .songCol {
        text-align: center;
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