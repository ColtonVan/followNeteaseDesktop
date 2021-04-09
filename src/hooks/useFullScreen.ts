export default () => {
    return {
        fullScreen() {
            let screenEle: Element = document.documentElement;
            var requestMethod = screenEle.requestFullscreen || //W3C
                (screenEle as any).webkitrequestFullscreen || //Chrome等
                (screenEle as any).mozrequestFullscreen || //FireFox
                (screenEle as any).msrequestFullscreen; //IE11
            if (requestMethod) {
                requestMethod.call(document.documentElement);
            } else if (typeof window.ActiveXObject !== "undefined") {//for Internet Explorer
                var wscript = new ActiveXObject("WScript.Shell");
                if (wscript !== null) {
                    wscript.SendKeys("{F11}");
                }
            }
        },
        exitFullScreen() {
            let screenEle: Document = document;
            var exitMethod = screenEle.exitFullscreen || //W3C
                (screenEle as any).webkitexitFullscreen || //Chrome等
                (screenEle as any).mozexitFullscreen || //FireFox
                (screenEle as any).msexitFullscreen; //IE11
            if (exitMethod) {
                exitMethod.call(document.documentElement);
            } else if (typeof window.ActiveXObject !== "undefined") {//for Internet Explorer
                var wscript = new ActiveXObject("WScript.Shell");
                if (wscript !== null) {
                    wscript.SendKeys("{F11}");
                }
            }
        }
    }
}