import { onMounted, onUnmounted } from "vue";
export default (callback: () => void) => {
    onMounted(() => {
        document.addEventListener("click", callback);
    });
    onUnmounted(() => {
        document.removeEventListener("click", callback);
    });
};
export const useClickDom = (domId: string, callback: () => void) => {
    onMounted(() => {
        document.getElementById(domId).addEventListener("click", callback);
    });
    onUnmounted(() => {
        document.getElementById(domId).removeEventListener("click", callback);
    });
};
export const useClickOnce = (ClickOnceCallBack: () => void, noClickOnceCallBack?: () => void) => {
    let preDate = 0;
    const handleMousedown = () => {
        preDate = Date.now();
    };
    const handleMouseup = () => {
        if (Date.now() - preDate < 400) {
            ClickOnceCallBack();
        }else{
            noClickOnceCallBack();
        }
    };
    onMounted(() => {
        document.addEventListener("mousedown", handleMousedown);
        document.addEventListener("mouseup", handleMouseup);
    });
};
