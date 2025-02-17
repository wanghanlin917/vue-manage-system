import { request } from "@/utils/request"
import type * as Login from "./types/login"

export function loginApi(data:Login.LoginRequestData){
  return request<Login.LoginResponseData>({
    url:"login",
    method:"post",
    data
  })
}