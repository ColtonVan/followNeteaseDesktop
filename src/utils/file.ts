export const downloadMusic = (url: string, name: string | number = Date.now()) => {
    console.log(name);
    let tagA: any = document.createElement("a");
    tagA.download = String(name);
    tagA.href = url;
    tagA.click();
};