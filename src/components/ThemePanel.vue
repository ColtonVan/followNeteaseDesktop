<template>
    <div class="themePanel">
        <div class="nav border-bottom">
            <div>纯色</div>
        </div>
        <div class="themeMain d-flex flex-wrap justify-content-between">
            <div
                class="cursor-pointer d-flex justify-content-center align-items-center"
                v-for="item in ['primary', 'dark', 'free']"
                :key="item"
                :class="`themeBox-${item}`"
                @click="$store.commit('changeTheme', `${item}Theme`)"
            >
                <NoteIcon width="45px" height="45px" />
                <PitchOnIcon v-if="globalTheme.includes(item)" width="26px" height="26px" />
            </div>
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
            globalTheme: computed(() => store.getters.getTheme),
        });
        return {
            ...toRefs(state),
        };
    },
});
</script>

<style scoped lang="scss">
.themePanel {
    position: absolute;
    top: calc(60px / 2 + 18px / 2 + 3px);
    left: -80%;
    transform: translate(-25%);
    width: 315px;
    /* height: 250px; */
    min-height: 150px;
    box-sizing: border-box;
    padding: 15px;
    background-color: #fff;
    box-shadow: 0 0 3.5px 2.5px rgba($color: #000000, $alpha: 0.075);
    border-radius: 7px;
    font-size: 12px;
    z-index: 996;
    .nav {
        width: 100%;
        height: 20px;
        > div {
            border-bottom: 2px solid #333;
        }
    }
    .themeMain {
        padding-top: 12px;
        > div {
            width: 90px;
            height: 90px;
            border-spacing: 2px;
            margin: 2px;
            /* box-sizing: border-box; */
            position: relative;
            > svg:first-child {
                opacity: 0.8;
                border-radius: 50%;
                box-shadow: 0 0 3px 3px rgba($color: #fff, $alpha: 0.1);
            }
            > svg:nth-child(2) {
                position: absolute;
                right: 0;
                bottom: 0;
                transform: translate(15%, 15%);
                padding: 3.2px;
                background-color: #fff;
                border-radius: 50%;
            }
        }
        //主题方块
        @each $key, $val in $colors {
            .themeBox-#{$key} {
                background-color: #{$val};
                &:hover {
                    &:before {
                        content: "";
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        width: calc(100% + 7.5px);
                        height: calc(100% + 7.5px);
                        border: 1px solid #{$val};
                    }
                    border: 1px solid transparent;
                }
            }
        }
    }
}
</style>
