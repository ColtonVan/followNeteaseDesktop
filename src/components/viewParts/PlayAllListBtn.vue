<template>
    <div
        class="rounded-pill align-self-start d-flex align-items-center justify-content-between text-white cursor-pointer position-relative overflow-hidden playAllBtn"
    >
        <div class="d-flex align-items-center justify-content-center border-end h-100 hover-btn">
            <DownArrowIcon width="20" height="20" />
            <span class="ms-1">播放全部</span>
        </div>
        <div class="d-flex align-items-center justify-content-center flex-grow-1 h-100 hover-btn">
            <PlusIcon width="20" height="20" />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
    setup() {},
});
</script>

<style scoped lang="scss">
.playAllBtn {
    width: 160px;
    height: 36px;
    svg:first-of-type {
        transform: rotate(-90deg);
    }
    > div:nth-child(1) {
        flex-grow: 3;
    }
}
.hover-btn {
    &:hover {
        background-color: rgba($color: #000000, $alpha: 0.1) !important;
    }
}
.primaryTheme {
    .dateText {
        color: $primary;
    }
    .playAllBtn {
        background-color: $primary;
    }
}
.darkTheme {
    .dateText {
        color: $dark;
    }
    .playAllBtn {
        background-color: $dark;
    }
}
.freeTheme {
    .dateText {
        color: $free;
    }
    .playAllBtn {
        background-color: $free;
    }
}
</style>
