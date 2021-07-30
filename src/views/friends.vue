<template>
      <HorizontalNav :navs="navs" />
      <div class="d-flex justify-content-between friends hideScrollBar pt-3">
            <div class="flex-1 eventContent pe-5">
                  <div class="eventItem border-bottom pb-4 pt-3 d-flex canSelect" v-for="event in events" :key="event.id">
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
                                          item.json && JSON.parse(item.json).msg
                                                ? JSON.parse(item.json).msg.split("#")[item.json.split("#").length - 1]
                                                : "",
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
                  .rightContent {
                        .eventPicsItem {

                        }
                        .operatedRow{
                              margin-top: 20px;
                        }
                  }
            }
      }
      .rightEvent {
            width: 220px;
            height: 520px;
      }
}
</style>
