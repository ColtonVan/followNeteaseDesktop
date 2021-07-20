<template>
    <svg t="1619057969840" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3362" width="200" height="200">
        <path
            d="M222.521003 164.329672l0 694.317349 543.891338-347.158674L222.521003 164.329672M178.355107 64.247256c5.207605 0 10.549264 1.178849 15.644305 3.729951l681.693844 416.160211c23.359011 11.698436 23.359011 43.00956 0 54.707996L193.999412 955.006649c-5.096065 2.543939-10.437723 3.715625-15.644305 3.715625-17.382902 0-33.235962-13.025665-33.235962-31.079856L145.119145 95.335299C145.118122 77.288271 160.956855 64.247256 178.355107 64.247256L178.355107 64.247256z"
            p-id="3363"
            :fill="color"
            data-spm-anchor-id="a313x.7781069.0.i0"
            class="selected"
        ></path>
    </svg>
</template>
<script lang='ts'>
import { defineComponent } from 'vue';
export default defineComponent({
    props: {
        color: {
            type: String,
            default: '#ffffff'
        },
    },
    setup() {},
});
</script>