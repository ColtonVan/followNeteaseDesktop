import { onMounted, onUnmounted, Ref } from "vue";
export default (moveRef: Ref, dragRef?: Ref) => {
    setTimeout(() => {
        if (!dragRef) dragRef = moveRef;
        const getWindowWidth = () => {
            //获取窗口宽度
            if (window.innerWidth) {
                //兼容DOM
                return window.innerWidth;
            } else if (document.body && document.body.clientWidth) {
                //兼容IE
                return document.body.clientWidth;
            }
            return 0;
        };
        const getWindowHeight = () => {
            //获取窗口高度
            if (window.innerHeight) {
                //兼容DOM
                return window.innerHeight;
            } else if (document.body && document.body.clientHeight) {
                //兼容IE
                return document.body.clientHeight;
            }
            return 0;
        };
        let canDrag = false;
        let startClientX = 0;
        let startClientY = 0;
        let startOffsetLeft = 0;
        let startOffsetTop = 0;
        dragRef.value.addEventListener("mousedown", (e: MouseEvent) => {
            canDrag = true;
            startClientX = e.clientX;
            startClientY = e.clientY;
            startOffsetLeft = moveRef.value.offsetLeft;
            startOffsetTop = moveRef.value.offsetTop;
        });
        const handleMouseMove = (e: MouseEvent) => {
            if (canDrag) {
                let difX = e.clientX - startClientX;
                let difY = e.clientY - startClientY;
                let currentLeft = difX + startOffsetLeft;
                let currentTop = difY + startOffsetTop;
                if (currentLeft - moveRef.value.offsetWidth / 2 < 0) {
                    currentLeft = moveRef.value.offsetWidth / 2;
                }
                if (currentTop - moveRef.value.offsetHeight / 2 < 0) {
                    currentTop = moveRef.value.offsetHeight / 2;
                }
                if (currentLeft + moveRef.value.offsetWidth - moveRef.value.offsetWidth / 2 > getWindowWidth()) {
                    currentLeft = getWindowWidth() - moveRef.value.offsetWidth + moveRef.value.offsetWidth / 2;
                }
                if (currentTop + moveRef.value.offsetHeight - moveRef.value.offsetHeight / 2 > getWindowHeight()) {
                    currentTop = getWindowHeight() - moveRef.value.offsetHeight + moveRef.value.offsetHeight / 2;
                }
                moveRef.value.style.left = currentLeft + "px";
                moveRef.value.style.top = currentTop + "px";
            }
        };
        const handleMouseUp = (e: MouseEvent) => {
            canDrag = false;
        };
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
    });
};
