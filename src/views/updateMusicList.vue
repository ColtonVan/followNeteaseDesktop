<template>
    <div class="px-5 py-4">
        <horizontal-nav :navs="navs" />
        <div class="d-flex mt-5">
            <div class="editForm d-flex flex-column align-items-start">
                <label>
                    <span class="labelName">歌单名：</span>
                    <input type="text" class="flex-grow-1" v-model="name" />
                </label>
                <label>
                    <span class="labelName">标签：</span>
                    <div class="d-flex align-items-center position-relative">
                        <div v-for="item in tags" :key="item.id" class="rounded-pill border text-muted px-2 me-2 flex-center">
                            {{ item.name || item }}
                        </div>
                        <div @click="modalVisible = true" class="colorA cursor-pointer" :class="{ 'ms-4': tags.length }">
                            添加标签
                        </div>
                    </div>
                </label>
                <label class="position-relative">
                    <span class="labelName">简介：</span>
                    <div class="textareaOuter w-100 pb-3">
                        <textarea ref="descRef" rows="5" class="flex-grow-1 w-100" maxlength="1000" v-model="desc" />
                    </div>
                    <span class="position-absolute bottom-0 text-muted remainLength">{{ 1000 - desc.length }}</span>
                </label>
                <div class="d-flex opBtns mt-5">
                    <div @click="handleSave" class="opBtn saveBtn rounded-pill text-white">保 存</div>
                    <div @click="$router.back()" class="opBtn cancelBtn border rounded-pill ms-4">取 消</div>
                </div>
            </div>
            <div class="ms-5 ps-5 d-flex flex-column align-items-center">
                <img class="rounded-3 coverImg" width="160" height="160" :src="imgFile" alt="" />
                <div @click="handleEditCover" class="opBtn cancelBtn rounded-pill border mt-4">编辑封面</div>
            </div>
        </div>
    </div>
    <CommonModal
        title="添加标签"
        @confirm="modalConfirm"
        v-model:visible="modalVisible"
        bodyStyle="min-height: 220px"
        bodyClass="w-100 overflow-scroll hideScrollBar"
    >
        <div class="text-black-50 mb-3">选择合适的标签，最多可以选<span class="maxTagSum">3</span>个</div>
        <div class="d-flex justify-content-between w-100 mb-2" v-for="(tags, tagsIndex) in tagList" :key="tagsIndex">
            <div class="tagLabelName text-black-50 flex-grow-1 flex-shrink-0">
                {{ tagLabelNames.find((name, nameIndex) => nameIndex == tagsIndex) }}
            </div>
            <div class="d-flex flex-wrap tags">
                <div class="tagItem mb-2 d-flex justify-content-start" v-for="tag in tags" :key="tag.name">
                    <div
                        @click="clickTagItem(tag)"
                        :class="{ activeTagInner: tag.active }"
                        class="tagInner rounded-pill flex-center text-ellipsis cursor-pointer"
                    >
                        {{ tag.name }}
                    </div>
                </div>
            </div>
        </div>
    </CommonModal>
    <CommonToast ref="commonToast" />
</template>

<script lang="ts">
import HorizontalNav, { NavsProps } from "@/components/viewParts/HorizontalNav.vue";
import { computed, ComputedRef, defineComponent, nextTick, reactive, ref, Ref, toRefs, watch } from "vue";
import { FileSelector } from "@/utils/file";
import { updatePlayListCoverApi, getHighqualityTagsApi, getPlayListDetailApi, updatePlayListApi } from "@/api/playList";
import { useRoute, useRouter } from "vue-router";
import { AxiosResponseProps } from "@/utils/request";
import { useStore } from "vuex";
interface stateProps {
    navs: NavsProps[];
    tags: {}[];
    name: string;
    desc: string;
    imgFile: string;
    formData: FormData;
    tagList: any[];
    modalVisible: boolean;
    tagLabelNames: string[];
    commonToast: Ref;
    mergedTagList: ComputedRef;
    playListDetail: object;
    descRef: Ref;
}
export default defineComponent({
    components: { HorizontalNav },
    setup() {
        const route = useRoute();
        const router = useRouter();
        const store = useStore();
        const state = reactive<stateProps>({
            navs: [
                {
                    title: "编辑歌单信息",
                    active: true,
                },
            ],
            tags: [],
            tagList: [],
            mergedTagList: computed(() => state.tagList.reduce((pre, item) => [...pre, ...item], [])),
            tagLabelNames: ["语种", "风格", "场景", "情感", "主题"],
            name: "",
            desc: "",
            imgFile: "https://p1.music.126.net/jWE3OEZUlwdz0ARvyQ9wWw==/109951165474121408.jpg",
            formData: null,
            modalVisible: false,
            commonToast: ref(null),
            playListDetail: {},
            descRef: ref(null),
        });
        const getPlayListDetail = () => {
            getPlayListDetailApi({ id: route.query.id }).then((res: any) => {
                if (res.code === 200) {
                    state.playListDetail = res.playlist;
                    state.imgFile = state.playListDetail.coverImgUrl;
                    state.name = state.playListDetail.name || "";
                    state.desc = state.playListDetail.description || "";
                    state.tags = state.playListDetail.tags || [];
                }
            });
        };
        let handleEditCover;
        const init = () => {
            getPlayListDetail();
            let fileUploader = new FileSelector();
            handleEditCover = () => {
                fileUploader.select();
            };
            fileUploader.handleCallback((files: FileList) => {
                // if (files[0].size / 1000 / 1024 > 1) return state.commonToast.warn("上传文件不得大于1mb");
                state.formData = new FormData();
                state.formData.append("id", route.query.id as string);
                state.formData.append("imgFile", files[0]);
                const reader = new FileReader();
                reader.readAsDataURL(files[0]);
                reader.onload = (event: Event) => {
                    state.imgFile = (event.target as FileReader).result as string;
                    let img = new Image();
                    img.src = state.imgFile;
                    img.onload = () => {
                        state.formData.append("imgSize", img.width || img.naturalWidth || 300);
                    };
                };
            });
        };
        watch(
            () => route.query,
            newV => {
                init();
                if (newV.desc == "true") {
                    nextTick(() => {
                        state.descRef.focus();
                    });
                }
            },
            {
                immediate: true,
            }
        );
        const handleSave = () => {
            //更新歌单
            const { name, tags, desc } = state;
            if (!name) return state.commonToast.warn("歌单名不能为空");
            updatePlayListApi({ name, tags: tags.map(item => item.name).join(";"), desc, id: route.query.id as string }).then(
                (res: AxiosResponseProps) => {
                    if (res.code === 200) {
                        state.commonToast.success("歌单信息更新成功");
                        //   //上传封面
                        if (!state.formData || !state.formData.get("imgFile")) {
                            init();
                            return store.dispatch("getCreatedMusicList");
                        }
                        updatePlayListCoverApi(state.formData)
                            .then((res: AxiosResponseProps) => {
                                if (res.code === 200) {
                                    init();
                                    store.dispatch("getCreatedMusicList");
                                    state.commonToast.success("歌单封面更新成功");
                                } else {
                                    state.commonToast.success(res.msg || "歌单封面更新失败,可能原因为图片过大");
                                }
                            })
                            .catch(err => {
                                state.commonToast.success(err.msg || "歌单封面更新失败,可能原因为图片过大");
                            });
                    }
                }
            );
        };
        const getHighqualityTags = () => {
            getHighqualityTagsApi().then((res: any) => {
                if (res.code === 200) {
                    state.tagList = res.tags
                        //确认category的个数
                        .reduce((pre2, item2) => (pre2.map(item3 => item3.category).includes(item2.category) ? pre2 : [...pre2, item2]), [])
                        //把category相同的tag放入当前项
                        .map(item4 => res.tags.filter(item5 => item5.category == item4.category));
                }
            });
        };
        getHighqualityTags();
        const modalConfirm = () => {
            state.tags = [...state.mergedTagList.filter(item => item.active)];
            state.modalVisible = false;
        };
        const clickTagItem = tag => {
            if (tag.active) {
                tag.active = false;
            } else {
                if (state.mergedTagList.filter(item => item.active).length < 3) {
                    tag.active = true;
                } else {
                    state.commonToast.warn("最多可选三个标签");
                }
            }
        };
        return {
            ...toRefs(state),
            handleEditCover,
            handleSave,
            modalConfirm,
            clickTagItem,
        };
    },
});
</script>

<style scoped lang="scss">
.editForm {
    width: 500px;
    label {
        display: flex;
        width: 100%;
    }
    label ~ label {
        margin-top: 16px;
    }
    input {
        height: 26px;
        border: 1px solid #ccc;
    }
    textarea {
        resize: none;
        @extend .hideScrollBar;
        border: none;
    }
    .textareaOuter {
        border: 1px solid #ccc;
        border-radius: 2.4px;
    }
    input,
    textarea {
        outline: none;
        border-radius: 2.4px;
    }
    .labelName {
        display: inline-block;
        width: 60px;
        text-align: right;
        padding-top: 4px;
        padding-right: 6px;
        flex-shrink: 0;
    }
    .remainLength {
        right: 6px;
    }
}
.opBtns {
    margin-left: 60px;
}
.opBtn {
    width: 90px;
    height: 34px;
    @extend .flex-center;
    cursor: pointer;
    position: relative;
    &:hover {
        &::before {
            position: absolute;
            border-radius: 50rem;
            content: "";
            width: 100%;
            height: 100%;
            background-color: rgba($color: #000000, $alpha: 0.05);
        }
    }
}
.coverImg {
    object-fit: cover;
}
.tagLabelName {
}
.tags {
    width: 360px;
    .tagItem {
        width: 90px;
        .tagInner {
            white-space: nowrap;
            width: 68px;
            height: 28px;
        }
        .activeTagInner {
            background-color: rgb(245, 245, 245);
            position: relative;
        }
    }
}

.primaryTheme {
    .saveBtn {
        background-color: $primary;
    }
    .maxTagSum,
    .tagItem:hover,
    .activeTagInner {
        color: $primary;
    }
    .activeTagInner {
        &:hover {
            &:before {
                position: absolute;
                content: "×";
                font-size: 18px;
                right: 4px;
                top: 48%;
                transform: translateY(-50%);
                color: $primary;
            }
        }
    }
}
.darkTheme {
    .saveBtn {
        background-color: $dark;
    }
    .maxTagSum,
    .tagItem:hover,
    .activeTagInner {
        color: $primary;
    }
    .activeTagInner {
        &:hover {
            &:before {
                position: absolute;
                content: "×";
                font-size: 18px;
                right: 4px;
                top: 48%;
                transform: translateY(-50%);
                color: $primary;
            }
        }
    }
}
.freeTheme {
    .saveBtn {
        background-color: $free;
    }
    .maxTagSum,
    .tagItem:hover,
    .activeTagInner {
        color: $free;
    }
    .activeTagInner {
        &:hover {
            &:before {
                position: absolute;
                content: "×";
                font-size: 18px;
                right: 4px;
                top: 48%;
                transform: translateY(-50%);
                color: $free;
            }
        }
    }
}
</style>
