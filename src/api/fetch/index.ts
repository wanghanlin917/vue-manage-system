import {request}  from '@/utils/request'
import * as Fetch from '@/api/fetch/types/fetch'
import { method } from 'lodash'


export function fetchUserDataApi(params:{username:string,page?:number}){
  return request<Fetch.FetchUserResponse>({
    url:'/user',
    method:'get',
    params
  })
}
export function fetchUserAddApi(data:any){
  return request<Fetch.FetchUserResponse>({
    url:'/user',
    method:'post',
    data
  })
}

export function fetchUserEditApi(data:any,id:number){
  return request<Fetch.FetchUserResponse>({
    url:`/user/${id}`,
    method:'patch',
    data
  })
}
export function fetchUserDeleteApi(id:number){
  return request<any>({
    url:`/user/${id}`,
    method:'delete'
  })
}


export function fetchRoleDataApi(params?:{name:string,page?:number }){
  return request<Fetch.FetchRoleResponse>({
    url:'/role',
    method:'get',
    params
  })
}

export function fetchRoleAddApi(data:Fetch.FetchRoleRequestData){
return request<Fetch.FetchRoleResponse>({
  url:'/role',
  method:'post',
  data
})
}

export function fetchRoleUpdateApi(data:Fetch.FetchRoleRequestData,id:string){
  return request<Fetch.FetchRoleResponse>({
    url:`/role/${id}`,
    method:'patch',
    data
  })
}

export function fetchRoleDeleteApi(id:number){
  return request<any>({
    url:`/role/${id}`,
    method:'delete'
  })
}

export function totalRoleApi(){
  return request<any>({
    url:'/role/total_role',
    method:'get'
  })
}
