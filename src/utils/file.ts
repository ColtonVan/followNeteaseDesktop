export const downloadMusic = async (url: string, name: string | number = Date.now()) => {
      if (!url) return Promise.reject();
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
      });
};
export class FileSelector {
      private readonly accept: string[];
      private inputTag: HTMLInputElement;
      constructor(fileOptions = { accept: ["image/png", "image/gif","image/jpg","image/jpeg"] }) {
            this.accept = fileOptions.accept;
            this.init();
      }
      init() {
            this.inputTag = document.createElement("input");
            this.inputTag.setAttribute("type", "file");
            this.inputTag.setAttribute("accept", this.accept.join(","));
      }
      select() {
            this.inputTag.value = "";
            this.inputTag.click();
      }
      handleCallback(callback?: (files: FileList) => void) {
            this.inputTag.addEventListener("change", (event: Event) => {
                  const target = event.target as HTMLInputElement;
                  callback(target.files as FileList);
            });
      }
}
