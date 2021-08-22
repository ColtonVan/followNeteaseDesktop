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
//单击、长按
export const useClickOnce = (ClickOnceCallBack: () => void, noClickOnceCallBack?: () => void) => {
    let preDate = 0;
    const handleMousedown = () => {
        preDate = Date.now();
    };
    const handleMouseup = () => {
        if (Date.now() - preDate < 400) {
            ClickOnceCallBack();
        } else {
            noClickOnceCallBack();
        }
    };
    onMounted(() => {
        document.addEventListener("mousedown", handleMousedown);
        document.addEventListener("mouseup", handleMouseup);
    });
};
//双击
export const useDoubleClick = () => {
    let clickArr = [];
    return (doubleClickCallBack: () => void) => {
        let nowDate = Date.now();
        if (clickArr.length && nowDate - clickArr[clickArr.length - 1] < 400) {
            doubleClickCallBack();
            return clickArr = [];
        }
        clickArr.push(nowDate);
    }
}
export const useDocumentContextMenu = (callback)=>{
    document.addEventListener("contextmenu",event=>{
        callback(event);
    })
}