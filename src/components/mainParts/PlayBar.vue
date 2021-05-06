<template>
    <div class="playBar border-top position-absolute bottom-0 vw-100 d-flex align-items-center justify-content-between">
        <div class="ps-3 d-flex align-items-center">
            <div class="musicCoverBox rounded-4 overflow-hidden">
                <img :src="defaultAlbum" width="55" alt="" />
            </div>
            <div class="ms-3 fs-5">
                <div class="d-flex align-items-center">
                    <span>出山</span>
                    <LikedIcon class="ms-2 cursor-pointer" width="16" height="16" />
                </div>
                <div class="mt-1">
                    <span>花粥</span>
                    <span>/</span>
                    <span>王胜娚</span>
                </div>
            </div>
        </div>
        <div>
            <div>
                
            </div>
            <div class="d-flex">
                <span>00:00</span>
                <div class="progressOuter py-2 mx-3 opacity-75">
                    <div class="progress cursor-pointer" style="width: 360px;height: 3px;overflow:inherit;">
                        <div
                            class="progress-bar"
                            role="progressbar"
                            style="width: 50%"
                            aria-valuenow="50"
                            aria-valuemin="0"
                            aria-valuemax="100"
                        ></div>
                        <div class="rounded-circle p-2 proDot"></div>
                    </div>
                </div>
                <span>00:00</span>
            </div>
        </div>
        <div class="d-flex align-items-center pe-4">
            <VolumeIcon class="cursor-pointer" width="22" height="22" />
            <SilenceIcon class="cursor-pointer" width="22" height="22" />
            <div class="progressOuter py-2 ms-2 opacity-75">
                <div class="progress cursor-pointer" style="width: 60px;height: 3px;overflow:inherit;">
                    <div class="progress-bar" role="progressbar" style="width: 50%" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
                    <div class="rounded-circle p-2 proDot"></div>
                </div>
            </div>
            <PlayListIcon class="ms-4 cursor-pointer opacity-75" width="22" height="22" />
        </div>
    </div>
</template>

<script lang="ts">
import { useStore } from "vuex";
import { computed, defineComponent, reactive, toRefs } from "vue";

export default defineComponent({
    setup() {
        const store = useStore();
        const state = reactive({
            defaultAlbum: require("@/assets/img/default_album.jpg"),
            theme: computed(() => store.getters.getTheme),
        });
        return {
            ...toRefs(state),
        };
    },
});
</script>

<style scoped lang="scss">
.playBar {
    height: 75px;
    .musicCoverBox {
        width: 55px;
        height: 55px;
    }
    .progressOuter {
        .proDot {
            transform: translateY(-35%);
            display: none;
        }
        &:hover {
            .proDot {
                display: inline-block;
            }
        }
    }
}
.primaryTheme {
    .progress-bar {
        background-color: $primary;
    }
    .proDot {
        background-color: $primary;
    }
}
.darkTheme {
    .progress-bar {
        background-color: $dark;
    }
    .proDot {
        background-color: $dark;
    }
}
.freeTheme {
    .progress-bar {
        background-color: $free;
    }
    .proDot {
        background-color: $free;
    }
}
</style>
