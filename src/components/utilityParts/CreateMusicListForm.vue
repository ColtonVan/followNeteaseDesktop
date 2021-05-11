<template>
    <CommonModal title="新建歌单" v-model:visible="addListModalVisible">
        <template #default>
            <input
                @keyup.enter="confirm"
                class="listNameInput py-2 px-3 rounded mb-2"
                v-model="addMusicListObj.name"
                type="text"
                placeholder="请输入新歌单标题"
            />
            <label for="isPrivate" class="d-flex align-items-center fs-5">
                <input class="me-2" type="checkbox" v-model="addMusicListObj.isPrivate" name="isPrivate" id="isPrivate" />
                设置为隐私歌单
            </label>
            <pre>{{ this }}</pre>
        </template>
        <template #buttons>
            <div @click="confirm" class="okBtn cursor-pointer d-flex justify-content-center align-items-center">
                创建
            </div>
        </template>
    </CommonModal>
</template>

<script lang="ts">
import { createPlayListApi } from "@/api/discover";
import store from "@/store";
import { AxiosResponseProps } from "@/utils/request";
import { computed, defineComponent, PropType, reactive, toRefs } from "vue";
export default defineComponent({
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
        formData: {
            type: Object as PropType<{ name: string; isPrivate: boolean }>,
        },
    },
    emits: ["confirm", "update:visible", "update:formData", "complete"],
    setup(props, context) {
        const state = reactive({
            addMusicListObj: computed({
                get: () => props.formData,
                set: newV => context.emit("update:formData", newV),
            }),
            addListModalVisible: computed({
                get: () => props.visible,
                set: newV => context.emit("update:visible", newV),
            })
        });
        const confirm = () => {
            const { name, isPrivate } = state.addMusicListObj as { name: string; isPrivate: boolean };
            let params: { name: string; privacy?: number } = { name };
            if (isPrivate) params.privacy = 10;
            createPlayListApi(params).then((res: AxiosResponseProps) => {
                if (res.code === 200) {
                    store.dispatch("getCreatedMusicList").then((res1: any) => {
                        state.addMusicListObj = { name: "", isPrivate: false };
                        state.addListModalVisible = false;
                        context.emit("complete", res);
                    });
                }
            });
        };
        return {
            ...toRefs(state),
            confirm,
        };
    },
});
</script>

<style scoped lang="scss">
.listNameInput {
    outline: none !important;
    width: 100%;
    border: 1px solid #cecece;
    &::placeholder {
        color: #cecece;
    }
}
.okBtn {
    width: 106px;
    height: 38px;
    border-radius: 20px;
    position: absolute;
    left: 50%;
    bottom: 0;
    transform: translateX(-50%);
    color: #fff;
    background-color: $primary;
    &:hover {
        filter: invert(0.08);
    }
}
.primaryTheme {
    .okBtn {
        background-color: $primary;
    }
}
.darkTheme {
    .okBtn {
        background-color: $dark;
    }
}
.freeTheme {
    .okBtn {
        background-color: $free;
    }
}
</style>
