export const isEmptyObject = (obj)=>{
    for (const key in obj) {
        return false;
    }
    return true;
    // return JSON.stringify(obj) === "{}";
}