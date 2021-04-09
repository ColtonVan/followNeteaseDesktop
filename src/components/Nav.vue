<template>
    <div class="nav d-flex justify-content-between align-items-center">
        <div class="leftArea">
            
        </div>
        <div class="rightArea mx-3">
            <SkinIcon class="cursor-pointer" width="18" height="18"/>
            <EmailIcon class="cursor-pointer" width="18" height="18"/>
            <FullScreen class="cursor-pointer" width="18" height="18"/>
            <CloseIcon class="cursor-pointer" width="18" height="18"/>
            
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
.nav {
    height: 60px;
    width: 100vw;
    .rightArea{
        svg~svg{
            margin-left: 18px;
        }
    }
}
.primaryTheme {
    .nav {
        background-color: $primary;
    }
}
.darkTheme {

}
.whiteTheme {

}
</style>
