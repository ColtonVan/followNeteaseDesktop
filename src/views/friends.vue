<template>
    <HorizontalNav :navs="navs" />
    <div class="d-flex justify-content-between friends hideScrollBar pt-3">
        <div class="flex-1 eventContent pe-5">
            <div class="eventItem border-bottom pb-5 pt-3 d-flex canSelect" v-for="event in events" :key="event.id">
                <div class="me-3">
                    <img class="rounded-circle" width="36" height="36" :src="event.tailMark?.circle?.imageUrl" alt="" />
                </div>
                <div>
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
                    <div>
                        <img
                            class="rounded-5 eventPicsItem"
                            :style="{ 'object-fit': pics.length > 1 ? 'cover' : '' }"
                            :width="img.width / 8"
                            :height="pics.length > 1 ? img.width / 8 : img.height / 8"
                            v-for="(img, imgIndex) in event.pics"
                            :key="imgIndex"
                            :src="img.originUrl"
                        />
                    </div>
                </div>
            </div>
        </div>
        <div class="rightEvent border-start"></div>
    </div>
</template>

<script lang="ts">
import { NavsProps } from "@/components/viewParts/HorizontalNav.vue";
import { defineComponent, reactive, toRefs } from "vue";
import { getEventApi } from "@/api/common";
import { mapEventName, YYYYMMDD } from "@/hooks/useFilters";
interface FriendsProps {
    navs: NavsProps[];
    events: object;
}
export default defineComponent({
    setup() {
        const state = reactive<FriendsProps>({
            navs: [
                {
                    title: "动态",
                    active: true,
                },
            ],
            events: {},
        });
        const getUserEvent = () => {
            getEventApi().then((res: any) => {
                if (res.code === 200) {
                    state.events = res.event.map(item => ({
                        ...item,
                        jsonActive:
                            JSON.parse(item.json).msg && JSON.parse(item.json)?.msg.match(/(?<=#).+(?=#)/).length
                                ? `#${JSON.parse(item.json)?.msg.match(/(?<=#).+(?=#)/)}#`
                                : "",
                        jsonNormal:
                            item.json && JSON.parse(item.json).msg ? JSON.parse(item.json).msg.split("#")[item.json.split("#").length - 1] : "",
                    }));
                }
            });
        };
        getUserEvent();
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
    height: calc(100% - 38px);
    overflow-y: scroll;
    .eventContent {
        min-width: 800px;
        .eventItem {
            .richText {
                white-space: pre-wrap;
            }
            .eventPicsItem {
            }
        }
    }
    .rightEvent {
        width: 220px;
        height: 520px;
    }
}
</style>
