import { onMounted, onUnmounted } from "vue";
export default (callback: () => void) => {
    onMounted(() => {
        document.addEventListener("click", callback);
    })
    onUnmounted(() => {
        document.removeEventListener("click", callback);
    })
}