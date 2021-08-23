<template>
    <div class="d-flex justify-content-between friends hideScrollBar">
        <div class="flex-1 eventContent px-5 py-4 w-100">
            <HorizontalNav :navs="navs" />
            <div v-if="!events.length" class="text-black-50 text-center noEvents">暂无动态</div>
            <div v-else class="eventItem border-bottom pb-4 pt-3 d-flex canSelect" v-for="event in events" :key="event.id">
                <div class="me-3">
                    <img class="rounded-circle" width="43" height="43" :src="event.user?.avatarUrl" alt="" />
                </div>
                <div class="position-relative w-100 rightContent">
                    <div>
                        <span class="colorA me-2">{{ event.actName }}</span>
                        <span>{{ mapEventName(event.type) }}</span>
                    </div>
                    <div class="text-muted pt-2 pb-3">
                        {{ YYYYMMDD(event.eventTime) }}
                    </div>
                    <div>
                        <span class="colorA cursor-pointer" v-html="event.jsonActive"></span>
                        <span class="richText" v-html="event.jsonNormal"></span>
                    </div>
                    <div
                        class="mt-3 d-flex flex-wrap"
                        :style="{
                            width:
                                event.pics.length && event.pics.length % 3 == 0
                                    ? 'calc(153px * 3 + 3vw * 3)'
                                    : event.pics.length && event.pics.length % 2 == 0
                                    ? 'calc(153px * 2 + 3vw * 2)'
                                    : 'auto',
                        }"
                    >
                        <img
                            class="rounded-5 eventPicsItem me-3 mb-3 cursor-zoom-in"
                            :style="{ 'object-fit': event.pics.length > 1 ? 'cover' : '' }"
                            :width="event.pics.length == 1 ? img.width / 3 : 153"
                            :height="event.pics.length == 1 ? img.height / 3 : 153"
                            v-for="(img, imgIndex) in event.pics"
                            :key="imgIndex"
                            :src="img.originUrl"
                        />
                    </div>
                    <div class="d-flex justify-content-end operatedRow">
                        <div class="pe-4 flex-center hover-opacity">
                            <PraiseIcon width="12" height="12" />
                            （{{ event.info.likedCount }}）
                        </div>
                        <div class="px-4 flex-center hover-opacity border-start">
                            <shareIcon width="12" height="12" />
                            （{{ event.info.shareCount }}）
                        </div>
                        <div class="ps-4 flex-center hover-opacity border-start">
                            <CommentIcon width="12" height="12" />
                            （{{ event.info.commentCount }}）
                        </div>
                    </div>
                    <CommonComment />
                </div>
            </div>
        </div>
        <div class="rightEvent border-start flex-shrink-0">
            <UserInfoCardForFriends v-if="loginStatus" />
            <div v-else class="d-flex px-4 flex-column align-items-center">
                <img class="mt-5 w-100" :src="require('@/assets/img/platform.png')" alt="" />
                <div class="text-black-50 my-3 text-center">登录NoteMusic,可以享受无限收藏的乐趣，并且无限同步到手机</div>
                <div
                    @click="$store.commit('changeLoginModalVisible', true)"
                    class="loginBtn fs-5 w-100 text-white cursor-pointer text-center rounded-pill bg-primary"
                >
                    立即登录
                </div>
            </div>
            <div class="w-100" v-if="hotTopics?.length">
                <div class="px-4 d-flex justify-content-between pt-4 pb-3">
                    <span>热门话题</span>
                    <span class="hover-opacity">更多&nbsp;></span>
                </div>
                <div class="ps-4 py-1 hover-item-grey d-flex" v-for="(item, index) in hotTopics" :key="index">
                    <img :src="item.sharePicUrl" width="38" height="38" class="rounded-2 object-fit-cover me-2" alt="" />
                    <div>
                        <div class="mb-1">#{{ item.title }}#</div>
                        <div class="text-black-50">{{ item.participateCount }}人参与</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { NavsProps } from "@/components/viewParts/HorizontalNav.vue";
import { computed, ComputedRef, defineComponent, reactive, toRefs, watch } from "vue";
import { getEventApi } from "@/api/common";
import { mapEventName, YYYYMMDD } from "@/hooks/useFilters";
import { useStore } from "vuex";
import { getHotTopicApi } from "@/api/common";
interface FriendsProps {
    navs: NavsProps[];
    events: object;
    loginStatus: ComputedRef;
    hotTopics: object[];
}
export default defineComponent({
    setup() {
        const store = useStore();
        const state = reactive<FriendsProps>({
            navs: [
                {
                    title: "动态",
                    active: true,
                },
            ],
            events: {},
            loginStatus: computed(() => store.getters.getLoginStatus),
            hotTopics: [],
        });
        watch(
            () => state.loginStatus,
            newV => {
                initPageData();
            }
        );
        const initPageData = () => {
            getEventApi().then((res: any) => {
                if (res.code === 200) {
                    state.events = res.event.map(item => ({
                        ...item,
                        jsonActive:
                            JSON.parse(item.json).msg && JSON.parse(item.json)?.msg.match(/(?<=#).+(?=#)/)?.length
                                ? `#${JSON.parse(item.json)?.msg.match(/(?<=#).+(?=#)/)}#`
                                : "",
                        jsonNormal:
                            item.json && JSON.parse(item.json).msg ? JSON.parse(item.json).msg.split("#")[item.json.split("#").length - 1] : "",
                    }));
                }else{
                    state.events = [];
                }
            });
            getHotTopicApi().then((res: any) => {
                if (res.code === 200) {
                    state.hotTopics = res.hot;
                }else{
                    state.hotTopics = [];
                }
            });
        };
        initPageData();
        return {
            ...toRefs(state),
            mapEventName,
            YYYYMMDD,
            JSON: window.JSON,
        };
    },
});
</script>

<style scoped lang="scss">
.friends {
    // height: calc(100% - 38px);
    overflow-y: scroll;
    .eventContent {
        min-width: 800px;
        .noEvents{
            margin-top: 80px;
        }
        .eventItem {
            .richText {
                white-space: pre-wrap;
            }
            .rightContent {
                .eventPicsItem {
                }
                .operatedRow {
                    margin-top: 20px;
                }
            }
        }
    }
    .rightEvent {
        width: 235px;
        height: 520px;
        .loginBtn {
            padding: 7px 0;
        }
    }
}
</style>
