import axios, { AxiosInstance, AxiosError, AxiosResponse, InternalAxiosRequestConfig, AxiosRequestConfig } from 'axios';
import {ElMessage} from 'element-plus'
import {getToken} from '@/utils/cookies'
import {merge} from 'lodash'
import {useUserStore} from '@/store/user'


function logout() {
    useUserStore().logout()
    location.reload()
  }
function createService() {
const service: AxiosInstance = axios.create({
    timeout: 5000
});

service.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        return config;
    },
    (error: AxiosError) => {
        console.log(error);
        return Promise.reject();
    }
);

service.interceptors.response.use(
    (response: AxiosResponse) => {
        const apiData = response.data
        console.log("拦截器",apiData);
        // 二进制数据则直接返回
        const responseType = response.request?.responseType
        if (responseType === "blob" || responseType === "arraybuffer") return apiData
        const code = apiData.code
        if (code === undefined) {
            ElMessage.error("非本系统的接口")
            return Promise.reject(new Error("非本系统的接口"))
          }
          switch (code) {
            case 0:
              // 本系统采用 code === 0 来表示没有业务错误
              console.log("响应拦截器数据", apiData)
              return apiData
            case 401:
              // Token 过期时
              return logout()
            case -1:
              return apiData
            default:
              return Promise.reject(new Error("Error"))
          }
        // if (response.status === 200) {
        //     return response;
        // } else {
        //     Promise.reject();
        // }
    },
    (error: AxiosError) => {
        console.log(error);
        return Promise.reject();
    }
);

return service

}
// 创建请求方法
function createRequest(service:AxiosInstance){
    return function<T>(config:AxiosRequestConfig):Promise<T>{
        const token = getToken()
        console.log("拦截器",token);
        
        const defaultConfig = {
            headers:{
                // 携带Token
                Authorizations: token ? `${token}`:undefined,
                "Content-Type":"application/json"
            },
            baseURL:'/api/',
            data:{}
        }
        const mergeConfig = merge(defaultConfig,config)
        console.log("end",mergeConfig);
        
        return service(mergeConfig)
    }
}
const service = createService()

export const request = createRequest(service)

