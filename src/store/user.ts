import {ref} from "vue"
import {defineStore} from "pinia"
import  * as cookies from "@/utils/cookies"
import {loginApi} from "@/api/login"
import {LoginRequestData}from "@/api/login/types/login"

export const useUserStore = defineStore("user",()=>{
  const token = ref<string>(cookies.getToken() || "")
  const login =async({username,password}:LoginRequestData)=>{
    const {data} = await loginApi({username,password})
    cookies.setToken(data.token)
  }
  
  const logout = ()=>{
    cookies.removeToken()

  }

  return {
    token,
    login,
    logout
  }

})