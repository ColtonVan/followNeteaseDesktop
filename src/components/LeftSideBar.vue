<template>
    <div class="leftSideBar border-end ps-3 pe-1 pt-2 fs-5 flex-shrink-0">
        <div
            class="mt-1 p-2 cursor-pointer rounded hover-menuItem"
            :class="{ visitedMenu: menu1.active, 'fw-bold': menu1.active }"
            @click="
                menus1 = menus1.map((item, index) => {
                    if (menu1.key === item.key) {
                        return { ...item, active: true };
                    } else {
                        return { ...item, active: false };
                    }
                })
            "
            v-for="(menu1, menu1Index) in menus1.slice(0, menus1.length - 1)"
            :key="menu1.key"
        >
            {{ menu1.title }}
        </div>
        <div @click="collapsed = !collapsed" class="hover-arrow cursor-pointer text-black-50 fs-6 ps-2 py-3">
            <span class="me-2">我喜欢的音乐</span>
            <DownArrowIcon :class="{ collapsed }" class="downArrow" color="rgba(0, 0, 0, 0.5)" width="10px" height="10px" />
        </div>
        <div v-if="!collapsed">
            <div
                class="mt-1 p-2 cursor-pointer rounded likedMusic d-flex align-items-center"
                v-for="(menu1, menu1Index) in menus1.slice(menus1.length - 1, menus1.length)"
                :key="menu1.key"
                :class="{ visitedMenu: menu1.active, 'hover-menuItem': canMyLikeHover }"
                @click="
                    menus1 = menus1.map((item, index) => {
                        if (menu1.key === item.key) {
                            return { ...item, active: true };
                        } else {
                            return { ...item, active: false };
                        }
                    })
                "
            >
                <LikedIcon class="me-2" width="15px" height="15px" />
                <span>{{ menu1.title }}</span>
                <div
                    class="heartBeat rounded-pill py-1 px-3 border ms-2 d-flex align-items-center"
                    @mouseover="canMyLikeHover = false"
                    @mouseout="canMyLikeHover = true"
                >
                    <HeartBeatIcon width="20px" height="20px" />
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
            menus1: [
                {
                    title: "发现音乐",
                    key: "fxyy",
                    active: true,
                },
                {
                    title: "视频",
                    key: "sp",
                },
                {
                    title: "朋友",
                    key: "py",
                },
                {
                    title: "直播",
                    key: "zb",
                },
                {
                    title: "私人FM",
                    key: "srfm",
                },
                {
                    title: "我喜欢的音乐",
                    key: "wxhdyy",
                },
            ],
            collapsed: false,
            canMyLikeHover: true,
        });
        return {
            ...toRefs(state),
            window,
        };
    },
});
</script>

<style scoped lang="scss">
.leftSideBar {
    width: 200px;
    height: calc(100vh - 75px - 60px);
    .hover-menuItem {
        &:hover {
            background-color: #f3f3f3;
        }
    }
    .visitedMenu {
        background-color: #f3f3f3;
    }
    .hover-arrow {
        > svg {
            opacity: 0.6;
        }
        &:hover {
            > svg {
                opacity: 1;
            }
        }
        .collapsed {
            transform: rotate(-90deg);
        }
        .downArrow {
            transition: transform ease 0.3s;
        }
    }
    .heartBeat {
        &:hover {
            background-color: #f3f3f3;
        }
    }
}
</style>
