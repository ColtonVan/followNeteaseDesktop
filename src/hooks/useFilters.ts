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
