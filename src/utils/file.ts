export const downloadMusic = async (url: string, name: string | number = Date.now()) => {
    if(!url)return Promise.reject();
    return fetch(url).then(res => {
            if (res.status === 200) {
                res.blob().then(blob => {
                    let blobUrl = window.URL.createObjectURL(blob);
                    let tagA: any = document.createElement("a");
                    tagA.download = String(name);
                    tagA.href = blobUrl;
                    tagA.click();
                    window.URL.revokeObjectURL(blobUrl);
                    return true;
                });
            } else {
                return Promise.reject();
            }
        })
};
