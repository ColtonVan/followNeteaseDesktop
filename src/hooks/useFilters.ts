import { getSongUrlApi } from "@/api/song";
export const playCount = (count: number) => {
    if (count >= 100000000) {
        return (count / 100000000).toFixed(1) + "亿";
    }
    if (count >= 10000) {
        return (count / 10000).toFixed(1) + "万";
    }
    return count;
};
export const playTime = (time: number) => {
    if (!time) return "00:00";
    let minute = Math.floor(time / 1000 / 60);
    let second = Math.floor((time - minute * 60 * 1000) / 1000);
    return `${String(minute).padStart(2, "0")}:${String(second).padStart(2, "0")}`;
};
export const musicQuality = (level: string) => {
    if (!level || level.includes("standard")) {
        return "标准";
    }
    if (level.includes("exhigh")) {
        return "高品质";
    }
    return "标注";
};
export const YYYYMMDD = () => {
    let currentDate = new Date();
    let YYYY = currentDate.getFullYear();
    let MM = String(currentDate.getMonth() + 1).padStart(2, "0");
    let DD = String(currentDate.getDate()).padStart(2, "0");
    return `${YYYY}-${MM}-${DD}`;
};
export const addHaveUrl = async originalList => {
    return await getSongUrlApi({ id: originalList.map(item => item.id) }).then((res: any) => {
        if (res.code === 200) {
            res.data.forEach(dataItem => {
                originalList.forEach(track => {
                    if (dataItem.id === track.id) {
                        if (dataItem.url) {
                            track.haveUrl = true;
                        } else {
                            track.haveUrl = false;
                        }
                    }
                });
            });
            return originalList;
        }
    });
};
export const fromLyricStrToTime = timeStr => {
    // 00:04.193
    if (!/^\d{2}\:\d{2}\.\d+$/.test(timeStr)) return 0;
    let splitPart1 = timeStr.split(":");
    let splitPart2 = splitPart1[1].split(".");
    let splitArr = [];
    splitArr[0] = splitPart1[0];
    splitArr[1] = splitPart2[0];
    splitArr[2] = `0.${splitPart2[1]}`;
    return Number(splitArr[0]) * 60 * 1000 + Number(splitArr[1]) * 1000 + Number(splitArr[2]) * 1000;
};
