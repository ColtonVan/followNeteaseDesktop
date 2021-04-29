<template>
    <div v-if="visible" class="videoGroupPanel position-absolute start-0 shadow rounded-7 p-4 hideScrollBar bg-white">
        <div class="d-flex justify-content-start pb-3 mb-3 border-bottom">
            <div
                :class="{ selected: item.active }"
                @click="
                    groupList = groupList.map(item1 => {
                        if (item1.id === item.id) {
                            return { ...item1, active: !item1.active };
                        } else {
                            return { ...item1, active: false };
                        }
                    });
                    panelVisible = false;
                    $emit('confirm', item);
                "
                v-for="item in groupList.slice(0, 1)"
                :key="item.id"
                class="groupItem cursor-pointer text-dark px-4 py-2 rounded-pill"
            >
                全部视频
            </div>
        </div>
        <div class="d-flex flex-wrap groupList">
            <div
                :class="{ selected: item.active }"
                @click="
                    groupList = groupList.map(item1 => {
                        if (item1.id === item.id) {
                            return { ...item1, active: !item1.active };
                        } else {
                            return { ...item1, active: false };
                        }
                    });
                    panelVisible = false;
                    $emit('confirm', item);
                "
                v-for="item in groupList.slice(1)"
                :key="item.id"
                class="groupItem cursor-pointer text-dark px-4 py-2 rounded-pill mb-3 flex-shrink-0"
            >
                {{ item.name }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, toRefs, watch } from "vue";
import { getGroupListApi } from "@/api/video";
import { AxiosResponseProps } from "@/utils/request";
export default defineComponent({
    props: {
        groupId: {
            type: Number,
            default: 0,
        },
        visible: {
            type: Boolean,
            default: false,
        },
    },
    emits: ["update:groupId", "update:visible", "confirm"],
    setup(props, { emit }) {
        const state = reactive({
            id: computed({
                get: () => props.groupId,
                set: newV => emit("update:groupId", newV),
            }),
            panelVisible: computed({
                get: () => props.visible,
                set: newV => emit("update:visible", newV),
            }),
            groupList: [{ name: "全部视频", id: 0, active: true }],
        });
        watch(
            () => state.id,
            newV => {
                let findItem = state.groupList.find(item => item.id === newV);
                if (findItem) {
                    state.groupList = state.groupList.map(item => {
                        if (item.id === findItem.id) {
                            return { ...item, active: true };
                        } else {
                            return { ...item, active: false };
                        }
                    });
                    emit("confirm", findItem);
                }
            }
        );
        const getGroupList = () => {
            getGroupListApi().then((res: AxiosResponseProps) => {
                if (res.code === 200) {
                    state.groupList = [{ name: "全部视频", id: 0, active: true }].concat(res.data);
                }
            });
        };
        getGroupList();
        return {
            ...toRefs(state),
        };
    },
});
</script>

<style scoped lang="scss">
.videoGroupPanel {
    top: 42px;
    z-index: 9;
    width: 660px;
    height: 500px;
    overflow-y: scroll;
    .groupItem {
        width: 120px;
        text-align: center;
    }
    .groupList {
    }
}
.primaryTheme {
    .groupItem {
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
    .groupItem {
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
    .groupItem {
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
