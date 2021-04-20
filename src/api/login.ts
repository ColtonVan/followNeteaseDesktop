import axiosInstance, { AxiosResponseProps } from "@/utils/request";
const { request, get, post } = axiosInstance;
export const getQrKey = () => {
    return get("/login/qr/key", { params: { timeStamp: Date.now() } });
}
export const createLoginQr = (params?: any) => {
    return get("/login/qr/create", { params: params || {} });
}
export const checkQrStatus = (params?: any) => {
    return get("/login/qr/check", { params: params || {} });
}
export const getAccountInfo = () => {
    return get("/user/account", { params: { timeStamp: Date.now() } });
}
export const getUserInfo = () => {
    return getAccountInfo().then(async (res: any) => {
        if (res.code === 200) {
            return await get("/user/account", { params: { uid: res.account.id, timeStamp: Date.now() } });
        }
    })
}
export const getUserDetail = () => {
    return getAccountInfo().then(async (res: any) => {
        if (res.code === 200) {
            return await get("/user/detail", { params: { uid: res.account.id, timeStamp: Date.now() } });
        }
    })
}
export const logout = () => {
    return get("/logout", { params: { timeStamp: Date.now() } });
}