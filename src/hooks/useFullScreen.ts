import { useStore } from "vuex";

export default () => {
    const store = useStore();
    document.documentElement.onfullscreenchange = (e) => {
        let documentSceen: any = document;
        store.commit("changeFullScreen", !!documentSceen.fullscreenElement)
    }
    const fullScreen = () => {
        let screenEle: Element = document.documentElement;
        var requestMethod = screenEle.requestFullscreen || //W3C
            (screenEle as any).webkitrequestFullscreen || //Chrome等
            (screenEle as any).mozrequestFullscreen || //FireFox
            (screenEle as any).msrequestFullscreen; //IE11
        if (requestMethod) {
            requestMethod.call(screenEle);
        } else if (typeof window.ActiveXObject !== "undefined") {//for Internet Explorer
            var wscript = new ActiveXObject("WScript.Shell");
            if (wscript !== null) {
                wscript.SendKeys("{F11}");
            }
        }
    }
    const exitFullScreen = () => {
        let screenEle: Document = document;
        var exitMethod = screenEle.exitFullscreen || //W3C
            (screenEle as any).webkitexitFullscreen || //Chrome等
            (screenEle as any).mozexitFullscreen || //FireFox
            (screenEle as any).msexitFullscreen; //IE11
        if (exitMethod) {
            exitMethod.call(screenEle);
        } else if (typeof window.ActiveXObject !== "undefined") {//for Internet Explorer
            var wscript = new ActiveXObject("WScript.Shell");
            if (wscript !== null) {
                wscript.SendKeys("{F11}");
            }
        }
    }
    return {
        fullScreen,
        exitFullScreen,
        toggleFullScreen() {
            if (!!document.fullscreenElement) {
                exitFullScreen();
            } else {
                fullScreen();
            }
        }
    }
}