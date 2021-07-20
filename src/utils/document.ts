export const getDoucmentHeight = () => document.documentElement.clientHeight || document.body.clientHeight;
export const getDoucmentWidth = () => document.documentElement.clientWidth || document.body.clientWidth;
export const copyValue = value => {
      let inputTag = document.createElement("input");
      inputTag.value = value;
      document.body.appendChild(inputTag);
      inputTag.select();
      document.execCommand("copy");
      document.body.removeChild(inputTag);
};
